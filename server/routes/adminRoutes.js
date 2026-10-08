const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,

  getAllUsers,
  deleteUser,

  getAllJobs,
  createJob,
  updateJob,
  deleteJob,

  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,

  getAllDSAQuestions,
  createDSAQuestion,
  updateDSAQuestion,
  deleteDSAQuestion,
} = require("../controllers/adminController");

const router = express.Router();

/* =========================
   DASHBOARD
========================= */

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

/* =========================
   USERS
========================= */

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

/* =========================
   JOBS
========================= */

router.get(
  "/jobs",
  authMiddleware,
  adminMiddleware,
  getAllJobs
);

router.post(
  "/jobs",
  authMiddleware,
  adminMiddleware,
  createJob
);

router.put(
  "/jobs/:id",
  authMiddleware,
  adminMiddleware,
  updateJob
);

router.delete(
  "/jobs/:id",
  authMiddleware,
  adminMiddleware,
  deleteJob
);

/* =========================
   COMPANIES
========================= */

router.get(
  "/companies",
  authMiddleware,
  adminMiddleware,
  getAllCompanies
);

router.post(
  "/companies",
  authMiddleware,
  adminMiddleware,
  createCompany
);

router.put(
  "/companies/:id",
  authMiddleware,
  adminMiddleware,
  updateCompany
);

router.delete(
  "/companies/:id",
  authMiddleware,
  adminMiddleware,
  deleteCompany
);

/* =========================
   DSA QUESTIONS
========================= */

router.get(
  "/dsa-questions",
  authMiddleware,
  adminMiddleware,
  getAllDSAQuestions
);

router.post(
  "/dsa-questions",
  authMiddleware,
  adminMiddleware,
  createDSAQuestion
);

router.put(
  "/dsa-questions/:id",
  authMiddleware,
  adminMiddleware,
  updateDSAQuestion
);

router.delete(
  "/dsa-questions/:id",
  authMiddleware,
  adminMiddleware,
  deleteDSAQuestion
);

module.exports = router;