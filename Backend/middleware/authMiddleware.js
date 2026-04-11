import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";
import { ApiError } from "./errorHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is missing in environment variables.");
  }

  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const cookieToken = req.cookies?.authToken || null;
  const token = cookieToken || bearerToken;

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  if (user.status === "blocked") {
    throw new ApiError(403, "Your account is blocked. Please contact support.");
  }

  req.user = user;
  next();
});

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    next(new ApiError(401, "Access denied. Authentication required."));
    return;
  }

  const effectiveRole = req.user.systemRole || req.user.role;

  if (!allowedRoles.includes(effectiveRole)) {
    next(new ApiError(403, "Access denied. Insufficient role permissions."));
    return;
  }

  next();
};
