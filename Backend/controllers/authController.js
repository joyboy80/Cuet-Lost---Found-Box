import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
  const url = 'http://localhost:5001/api/verify-email';

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
      // Logic to show OTP input field to student goes here
      return data.otp;
    } else {
      console.error('API Error:', data.error);
      alert('Failed to send email: ' + data.error);
    }
  } catch (error) {
    console.error('Network Error:', error);
    alert('Could not connect to the Mail Server');
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
    throw new ApiError(409, "User already exists with this email or studentID.");
  }

  const normalizedDepartment = String(department || "").trim();
  const finalDepartment =
    normalizedRole === "student"
      ? normalizedDepartment || deriveStudentDepartmentCode(normalizedEmail, studentID)
      : normalizedDepartment;

  try {
    sendVerificationEmail(normalizedEmail, name);
    console.log("mail sent successful", otp)
  } catch (error) {
    console.log("email send error ", error)
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    role: normalizedRole,
    department: finalDepartment,
    ...(normalizedRole === "student" && studentID ? { studentID } : {}),
    password,
    systemRole: "user",
    verified: false
  });

  const token = createToken(user._id, user.role);
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    message: `Registration successful as ${user.role}.`,
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
      verified: user.verified
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const emailValue = String(email || "").trim().toLowerCase();

  if (!emailValue || !password) {
    throw new ApiError(400, "Email and password are required.");
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

  const isPasswordValid = await bcrypt.compare(password, user.password);

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
