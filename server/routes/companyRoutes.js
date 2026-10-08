const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCompanies,
  getCompanyById,
} = require("../controllers/companyController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getCompanies
);

router.get(
  "/:id",
  authMiddleware,
  getCompanyById
);

module.exports = router;