import User from "../models/User.js";

const DEFAULT_SUPER_ADMIN_EMAIL = "abir@cuet.ac.bd";
const DEFAULT_SUPER_ADMIN_PASSWORD = "abir2204094";
const DEFAULT_SUPER_ADMIN_NAME = "Abir";
const DEFAULT_DEPARTMENT_CODE = "04";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const ensureDefaultSuperAdmin = async () => {
  const email = normalizeEmail(
    process.env.DEFAULT_SUPER_ADMIN_EMAIL || DEFAULT_SUPER_ADMIN_EMAIL
  );
  const password =
    process.env.DEFAULT_SUPER_ADMIN_PASSWORD || DEFAULT_SUPER_ADMIN_PASSWORD;
  const name =
    String(process.env.DEFAULT_SUPER_ADMIN_NAME || DEFAULT_SUPER_ADMIN_NAME).trim() ||
    DEFAULT_SUPER_ADMIN_NAME;

  if (!email || !password) {
    return;
  }

  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    await User.create({
      name,
      email,
      password,
      role: "teacher",
      systemRole: "super-admin",
      status: "active",
      verified: true,
    });

    console.log(`Default super-admin created: ${email}`);
    return;
  }

  let shouldSave = false;

  if (existingUser.systemRole !== "super-admin") {
    existingUser.systemRole = "super-admin";
    shouldSave = true;
  }

  if (existingUser.role !== "teacher") {
    existingUser.role = "teacher";
    shouldSave = true;
  }

  if (existingUser.status !== "active") {
    existingUser.status = "active";
    shouldSave = true;
  }

  if (existingUser.verified !== true) {
    existingUser.verified = true;
    shouldSave = true;
  }

  if (!existingUser.name || existingUser.name.trim() !== name) {
    existingUser.name = name;
    shouldSave = true;
  }

  const isPasswordValid = existingUser.password
    ? await existingUser.comparePassword(password)
    : false;
  if (!isPasswordValid) {
    existingUser.password = password;
    shouldSave = true;
  }

  if (shouldSave) {
    await existingUser.save();
    console.log(`Default super-admin updated: ${email}`);
  } else {
    console.log(`Default super-admin already configured: ${email}`);
  }
};

export const backfillMissingDepartmentsToCSE = async () => {
  const result = await User.updateMany(
    {
      $or: [{ department: { $exists: false } }, { department: null }, { department: "" }],
    },
    {
      $set: { department: DEFAULT_DEPARTMENT_CODE },
    }
  );

  const modifiedCount = result?.modifiedCount || 0;
  if (modifiedCount > 0) {
    console.log(`Department backfill complete: set CSE for ${modifiedCount} existing users.`);
  } else {
    console.log("Department backfill skipped: no users with missing department.");
  }
};