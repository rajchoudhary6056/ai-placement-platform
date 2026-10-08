const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getRecommendedJobs,
  getJobById,
} = require("../controllers/jobController");

const router = express.Router();

/*
==================================================
RECOMMENDED JOBS
==================================================
*/

router.get(
  "/recommendations",
  authMiddleware,
  getRecommendedJobs
);

/*
==================================================
SINGLE JOB
==================================================
*/

router.get(
  "/:id",
  authMiddleware,
  getJobById
);

module.exports = router;