const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: [300, "Bio must be less than 300 characters"],
    },
    jobTitle: {
      type: String,
      default: "",
    },
    resumeCount: {
      type: Number,
      default: 0,
    },
    linkedinCount: {
      type: Number,
      default: 0,
    },
    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },
    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },
    codingPlatformUrl: {
      type: String,
      default: "",
      trim: true,
    },
    education: [
      {
        institution: { type: String, required: true, trim: true },
        degree: { type: String, required: true, trim: true },
        field: { type: String, default: "", trim: true },
        startYear: { type: String, default: "" },
        endYear: { type: String, default: "" },
      },
    ],
    experience: [
      {
        company: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "", trim: true },
      },
    ],
    skills: [{ type: String, trim: true }],
    dsaProgress: {
      completedProblems: [{ type: String }],
      streak: {
        count: { type: Number, default: 0 },
        lastDate: { type: String, default: "" },
      },
      activityGraph: {
        type: Map,
        of: Number,
        default: {},
      },
      notes: {
        type: Map,
        of: String,
        default: {},
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
