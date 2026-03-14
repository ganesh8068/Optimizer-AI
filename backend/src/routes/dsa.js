const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/**
 * Helper to calculate and set streak
 */
const updateStreakLogic = (user, solvedDateStr) => {
  const solvedDate = new Date(solvedDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  solvedDate.setHours(0, 0, 0, 0);

  const lastDateStr = user.dsaProgress.streak.lastDate;
  
  if (!lastDateStr) {
    user.dsaProgress.streak.count = 1;
    user.dsaProgress.streak.lastDate = solvedDateStr;
    return;
  }

  const lastDate = new Date(lastDateStr);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(solvedDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    user.dsaProgress.streak.count += 1;
    user.dsaProgress.streak.lastDate = solvedDateStr;
  } else if (diffDays > 1) {
    // Gap occurred
    user.dsaProgress.streak.count = 1;
    user.dsaProgress.streak.lastDate = solvedDateStr;
  }
  // If diffDays === 0, already solved today, no change
};

// GET /api/dsa/progress - Get user's DSA progress
router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const progress = user.dsaProgress;

    // Check if streak should be 0 (if last date was before yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (progress.streak.lastDate) {
      const lastDate = new Date(progress.streak.lastDate);
      lastDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        progress.streak.count = 0;
        // We don't necessarily need to save here, just returning 0 is enough
        // but let's be consistent
      }
    }

    res.json(progress);
  } catch (error) {
    console.error("DSA progress fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/dsa/toggle - Toggle problem completion
router.post("/toggle", authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.body;
    const user = await User.findById(req.user._id);
    const todayStr = new Date().toISOString().split('T')[0];

    const problemIndex = user.dsaProgress.completedProblems.indexOf(problemId);
    
    if (problemIndex > -1) {
      // Un-complete
      user.dsaProgress.completedProblems.splice(problemIndex, 1);
      
      // Update activity graph
      const currentCount = user.dsaProgress.activityGraph.get(todayStr) || 0;
      user.dsaProgress.activityGraph.set(todayStr, Math.max(0, currentCount - 1));
    } else {
      // Complete
      user.dsaProgress.completedProblems.push(problemId);
      
      // Update activity graph
      const currentCount = user.dsaProgress.activityGraph.get(todayStr) || 0;
      user.dsaProgress.activityGraph.set(todayStr, currentCount + 1);
      
      // Update streak
      updateStreakLogic(user, todayStr);
    }

    await user.save();
    res.json(user.dsaProgress);
  } catch (error) {
    console.error("DSA toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/dsa/sync - Sync initial localStorage data
router.post("/sync", authMiddleware, async (req, res) => {
  try {
    const { progress, streak, graphData, notes } = req.body;
    const user = await User.findById(req.user._id);

    // Only sync if database is empty or we want to overwrite
    // For simplicity, we'll merge or replace
    if (progress) user.dsaProgress.completedProblems = progress;
    if (streak) {
        user.dsaProgress.streak.count = streak.count || 0;
        user.dsaProgress.streak.lastDate = streak.date || "";
    }
    if (graphData) {
        for (const [date, count] of Object.entries(graphData)) {
            user.dsaProgress.activityGraph.set(date, count);
        }
    }
    if (notes) {
        for (const [id, note] of Object.entries(notes)) {
            user.dsaProgress.notes.set(id, note);
        }
    }

    await user.save();
    res.json({ message: "Sync successful", progress: user.dsaProgress });
  } catch (error) {
    console.error("DSA sync error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/dsa/notes - Update problem note
router.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { problemId, note } = req.body;
    const user = await User.findById(req.user._id);
    
    user.dsaProgress.notes.set(problemId, note);
    
    await user.save();
    res.json({ message: "Note updated" });
  } catch (error) {
    console.error("DSA notes update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
