import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ANY_CUET_EMAIL_REGEX =
  /^[^\s@]+@(student\.cuet\.ac\.bd|cuet\.ac\.bd|officers\.cuet\.ac\.bd)$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [
        {
          validator: (value) => ANY_CUET_EMAIL_REGEX.test(value),
          message: "Please provide a valid CUET official email address.",
        },
      ],
    },
    studentID: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    department: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["teacher", "student", "staff"],
      required: true,
      default: "student",
    },
    systemRole: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    verified: {
      type: Boolean,
      default: true,
    },
    verificationOtpHash: {
      type: String,
      default: "",
      select: false,
    },
    verificationOtpExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
