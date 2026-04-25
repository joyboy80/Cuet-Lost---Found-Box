import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { ApiError } from "../middleware/errorHandler.js";

const CUET_EMAIL_REGEX =
  /^[^\s@]+@(student\.cuet\.ac\.bd|cuet\.ac\.bd|officers\.cuet\.ac\.bd)$/;

const deriveStudentDepartmentCode = (email, studentID) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedStudentID = String(studentID || "").trim();

  const emailMatch = normalizedEmail.match(/^u\d{2}(\d{2})\d{3}@student\.cuet\.ac\.bd$/);
  if (emailMatch) {
    return emailMatch[1];
  }

  if (/^\d{7}$/.test(normalizedStudentID)) {
    return normalizedStudentID.slice(2, 4);
  }

  return "";
};

const createToken = (userId, role) =>
  {
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT_SECRET is missing in environment variables.");
    }

    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  };

const OTP_EXPIRES_MINUTES = 10;

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

const getSuperAdminEnvConfig = () => ({
  email: String(process.env.DEFAULT_SUPER_ADMIN_EMAIL || "").trim().toLowerCase(),
  password: String(process.env.DEFAULT_SUPER_ADMIN_PASSWORD || "").trim(),
  name: String(process.env.DEFAULT_SUPER_ADMIN_NAME || "Super Admin").trim() || "Super Admin",
});

const getCookieConfig = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const setAuthCookie = (res, token) => {
  res.cookie("authToken", token, getCookieConfig());
};

const sendVerificationEmail = async (userEmail, name) => {
  const url = 'https://cuet-lost-found-box-1.onrender.com/api/verify-email';

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      userName: name
    }),
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.ok) {
      console.log('OTP Sent Successfully:', data.otp);
      return data.otp;
    } else {
      console.error('API Error:', data.error);
      throw new ApiError(502, data.error || "Failed to send verification email.");
    }
  } catch (error) {
    console.error('Network Error:', error);
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(503, "Could not connect to the mail server.");
  }
};

// Example Usage:
// sendVerificationEmail('u2204015@student.cuet.ac.bd', 'Joy');

export const register = asyncHandler(async (req, res) => {
  const { name, email, studentID, password, role, department } = req.body;

  const normalizedRole = String(role || "").trim().toLowerCase();
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!name || !email || !password || !normalizedRole) {
    throw new ApiError(400, "name, email, password, and role are required.");
  }

  if (!["teacher", "student", "staff"].includes(normalizedRole)) {
    throw new ApiError(400, "role must be teacher, student, or staff.");
  }

  if (!CUET_EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(
      400,
      "Email must end with @student.cuet.ac.bd, @cuet.ac.bd, or @officers.cuet.ac.bd."
    );
  }

  if (normalizedRole === "student" && !studentID) {
    throw new ApiError(400, "studentID is required for student registration.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }

  const orConditions = [{ email: normalizedEmail }];
  if (studentID) {
    orConditions.push({ studentID });
  }

  const existingUser = await User.findOne({ $or: orConditions });

  if (existingUser) {
    if (existingUser.verified === false) {
      throw new ApiError(409, "An unverified account already exists. Please verify your email first.");
    }

    if (existingUser.verified) {
      throw new ApiError(409, "User already exists with this email or studentID.");
    }

    throw new ApiError(409, "User already exists with this email or studentID.");
  }

  const normalizedDepartment = String(department || "").trim();
  const finalDepartment =
    normalizedRole === "student"
      ? normalizedDepartment || deriveStudentDepartmentCode(normalizedEmail, studentID)
      : normalizedDepartment;

  const otp = await sendVerificationEmail(normalizedEmail, name);
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);

  const user = await User.create({
    name,
    email: normalizedEmail,
    role: normalizedRole,
    department: finalDepartment,
    ...(normalizedRole === "student" && studentID ? { studentID } : {}),
    password,
    systemRole: "user",
    verified: false,
    verificationOtpHash: otpHash,
    verificationOtpExpiresAt: otpExpiresAt,
  });

  res.status(201).json({
    success: true,
    message: `Registration successful as ${user.role}. Verify your email with the OTP sent to your inbox.`,
    requiresVerification: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      studentID: user.studentID || "",
      department: user.department || "",
      role: user.role,
      systemRole: user.systemRole,
      status: user.status,
      verified: user.verified
    },
  });
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const emailValue = String(req.body?.email || "").trim().toLowerCase();
  const otpValue = String(req.body?.otp || "").trim();

  if (!emailValue || !otpValue) {
    throw new ApiError(400, "Email and OTP are required.");
  }

  const user = await User.findOne({ email: emailValue }).select("+verificationOtpHash +verificationOtpExpiresAt");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.verified) {
    throw new ApiError(400, "Email is already verified.");
  }

  if (!user.verificationOtpHash || !user.verificationOtpExpiresAt) {
    throw new ApiError(400, "No active OTP found. Please register again.");
  }

  if (user.verificationOtpExpiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "OTP has expired. Please register again.");
  }

  const incomingHash = hashOtp(otpValue);
  if (incomingHash !== user.verificationOtpHash) {
    throw new ApiError(400, "Invalid OTP.");
  }

  user.verified = true;
  user.verificationOtpHash = "";
  user.verificationOtpExpiresAt = null;
  await user.save();

  const token = createToken(user._id, user.role);
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Email verified successfully.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      studentID: user.studentID || "",
      department: user.department || "",
      role: user.role,
      systemRole: user.systemRole,
      status: user.status,
      verified: user.verified,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const emailValue = String(email || "").trim().toLowerCase();
  const passwordValue = String(password || "");

  if (!emailValue || !passwordValue) {
    throw new ApiError(400, "Email and password are required.");
  }

  const superAdminConfig = getSuperAdminEnvConfig();
  const isSuperAdminEnvLogin =
    Boolean(superAdminConfig.email && superAdminConfig.password) &&
    emailValue === superAdminConfig.email &&
    passwordValue === superAdminConfig.password;

  if (isSuperAdminEnvLogin) {
    let superAdminUser = await User.findOne({ email: emailValue }).select("+password");

    if (!superAdminUser) {
      superAdminUser = await User.create({
        name: superAdminConfig.name,
        email: superAdminConfig.email,
        password: superAdminConfig.password,
        role: "teacher",
        systemRole: "super-admin",
        status: "active",
        verified: true,
      });
    } else {
      let shouldSave = false;

      if (superAdminUser.systemRole !== "super-admin") {
        superAdminUser.systemRole = "super-admin";
        shouldSave = true;
      }

      if (superAdminUser.role !== "teacher") {
        superAdminUser.role = "teacher";
        shouldSave = true;
      }

      if (superAdminUser.status !== "active") {
        superAdminUser.status = "active";
        shouldSave = true;
      }

      if (superAdminUser.verified !== true) {
        superAdminUser.verified = true;
        shouldSave = true;
      }

      if (!superAdminUser.name || superAdminUser.name.trim() !== superAdminConfig.name) {
        superAdminUser.name = superAdminConfig.name;
        shouldSave = true;
      }

      const isPasswordValid = superAdminUser.password
        ? await bcrypt.compare(superAdminConfig.password, superAdminUser.password)
        : false;

      if (!isPasswordValid) {
        superAdminUser.password = superAdminConfig.password;
        shouldSave = true;
      }

      if (shouldSave) {
        await superAdminUser.save();
      }
    }

    const token = createToken(superAdminUser._id, superAdminUser.role);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: superAdminUser._id,
        name: superAdminUser.name,
        email: superAdminUser.email,
        studentID: superAdminUser.studentID || "",
        department: superAdminUser.department || "",
        role: superAdminUser.role,
        systemRole: superAdminUser.systemRole,
        status: superAdminUser.status,
      },
    });
  }

  const user = await User.findOne({ email: emailValue }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.status === "blocked") {
    throw new ApiError(403, "Your account is blocked. Please contact support.");
  }

  if (user.verified === false) {
    throw new ApiError(403, "Please verify your email with OTP before logging in.");
  }

  const isPasswordValid = await bcrypt.compare(passwordValue, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = createToken(user._id, user.role);
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      studentID: user.studentID || "",
      department: user.department || "",
      role: user.role,
      systemRole: user.systemRole,
      status: user.status,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("authToken", {
    ...getCookieConfig(),
    maxAge: undefined,
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});
