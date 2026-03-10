const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// GET /api/profile - Get current user profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile - Update profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, bio, jobTitle, linkedinUrl, githubUrl, codingPlatformUrl, education, experience, skills } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (jobTitle !== undefined) updates.jobTitle = jobTitle;
    if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) updates.githubUrl = githubUrl;
    if (codingPlatformUrl !== undefined) updates.codingPlatformUrl = codingPlatformUrl;
    if (education !== undefined) updates.education = education;
    if (experience !== undefined) updates.experience = experience;
    if (skills !== undefined) updates.skills = skills;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Profile updated", user: user.toJSON() });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
