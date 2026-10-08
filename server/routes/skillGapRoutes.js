const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  analyzeSkillGap,
  getSkillGapHistory,
  getLatestSkillGap,
} = require("../controllers/skillGapController");

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  analyzeSkillGap
);

router.get(
  "/history",
  authMiddleware,
  getSkillGapHistory
);

router.get(
  "/latest",
  authMiddleware,
  getLatestSkillGap
);

module.exports = router;