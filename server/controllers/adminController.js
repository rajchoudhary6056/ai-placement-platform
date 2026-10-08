const User = require("../models/User");
const Job = require("../models/Job");
const CompanyPreparation = require("../models/CompanyPreparation");
const DSAProgress = require("../models/DSAProgress");
const DSAQuestion = require("../models/DSAQuestion");

const dsaQuestions = require("../data/dsaQuestions");

/* =========================
   HELPERS
========================= */

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions
    .map((item) => ({
      question: String(
        item.question || ""
      ).trim(),

      answer: String(
        item.answer || ""
      ).trim(),
    }))
    .filter((item) => item.question);
};

const normalizeTestCases = (testCases) => {
  if (!Array.isArray(testCases)) {
    return [];
  }

  return testCases
    .map((item) => ({
      input: String(
        item.input || ""
      ).trim(),

      expectedOutput: String(
        item.expectedOutput ||
          item.output ||
          ""
      ).trim(),
    }))
    .filter(
      (item) =>
        item.input ||
        item.expectedOutput
    );
};

/* =========================
   DASHBOARD
========================= */

const getDashboardStats = async (
  req,
  res
) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalJobs,
      totalCompanies,
      totalProgressRecords,
      totalDSAQuestions,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "student",
      }),

      User.countDocuments({
        role: "admin",
      }),

      Job.countDocuments({
        isActive: true,
      }),

      CompanyPreparation.countDocuments({
        isActive: true,
      }),

      DSAProgress.countDocuments(),

      DSAQuestion.countDocuments({
        isActive: true,
      }),

      User.find()
        .select(
          "name email role profileScore targetRole createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),
    ]);

    const dsaStats =
      await DSAProgress.aggregate([
        {
          $group: {
            _id: null,

            totalSolved: {
              $sum: "$totalSolved",
            },

            totalAttempted: {
              $sum: "$totalAttempted",
            },
          },
        },
      ]);

    return res.json({
      success: true,

      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalJobs,
        totalCompanies,
        totalProgressRecords,

        totalDSAQuestions,

        totalDSASolved:
          dsaStats[0]?.totalSolved || 0,

        totalDSAAttempted:
          dsaStats[0]?.totalAttempted || 0,
      },

      recentUsers,
    });
  } catch (error) {
    console.error(
      "Admin Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin dashboard",
    });
  }
};

/* =========================
   USERS
========================= */

const getAllUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find()
      .select(
        "name email role phone location targetRole profileScore createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "Get All Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load users",
    });
  }
};

const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      String(id) ===
      String(req.user.id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin account cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    await DSAProgress.findOneAndDelete({
      user: id,
    });

    return res.json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete user",
    });
  }
};

/* =========================
   JOBS
========================= */

const getAllJobs = async (
  req,
  res
) => {
  try {
    const jobs = await Job.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(
      "Get All Jobs Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load jobs",
    });
  }
};

const createJob = async (
  req,
  res
) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      experience,
      description,
      skills,
      salary,
      applyUrl,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    if (!company?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Company name is required",
      });
    }

    const job = await Job.create({
      title: title.trim(),

      company: company.trim(),

      location:
        location?.trim() || "India",

      jobType:
        jobType || "Full Time",

      experience:
        experience?.trim() || "Fresher",

      description:
        description?.trim() || "",

      skills: normalizeArray(skills),

      salary:
        salary?.trim() ||
        "Not Disclosed",

      applyUrl:
        applyUrl?.trim() || "",

      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(
      "Create Job Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create job",
    });
  }
};

const updateJob = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      company,
      location,
      jobType,
      experience,
      description,
      skills,
      salary,
      applyUrl,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    if (!company?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Company name is required",
      });
    }

    const job =
      await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.title = title.trim();
    job.company = company.trim();

    job.location =
      location?.trim() || "India";

    job.jobType =
      jobType || "Full Time";

    job.experience =
      experience?.trim() || "Fresher";

    job.description =
      description?.trim() || "";

    job.skills =
      normalizeArray(skills);

    job.salary =
      salary?.trim() ||
      "Not Disclosed";

    job.applyUrl =
      applyUrl?.trim() || "";

    if (
      typeof isActive ===
      "boolean"
    ) {
      job.isActive = isActive;
    }

    await job.save();

    return res.json({
      success: true,
      message:
        "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error(
      "Update Job Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update job",
    });
  }
};

const deleteJob = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const job =
      await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(id);

    return res.json({
      success: true,
      message:
        "Job deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Job Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete job",
    });
  }
};

/* =========================
   COMPANIES
========================= */

const getAllCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await CompanyPreparation.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error(
      "Get All Companies Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load companies",
    });
  }
};

const createCompany = async (
  req,
  res
) => {
  try {
    const {
      name,
      shortName,
      description,
      difficulty,
      hiringType,
      selectionProcess,
      requiredSkills,
      dsaTopics,
      technicalQuestions,
      hrQuestions,
      preparationTips,
      isActive,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Company name is required",
      });
    }

    const existingCompany =
      await CompanyPreparation.findOne({
        name: name.trim(),
      });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message:
          "Company with this name already exists",
      });
    }

    const company =
      await CompanyPreparation.create({
        name: name.trim(),

        shortName:
          shortName?.trim() || "",

        description:
          description?.trim() || "",

        difficulty:
          difficulty || "Medium",

        hiringType:
          hiringType?.trim() ||
          "Campus Placement",

        selectionProcess:
          normalizeArray(
            selectionProcess
          ),

        requiredSkills:
          normalizeArray(
            requiredSkills
          ),

        dsaTopics:
          normalizeArray(dsaTopics),

        technicalQuestions:
          normalizeQuestions(
            technicalQuestions
          ),

        hrQuestions:
          normalizeQuestions(
            hrQuestions
          ),

        preparationTips:
          normalizeArray(
            preparationTips
          ),

        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,
      });

    return res.status(201).json({
      success: true,
      message:
        "Company created successfully",
      company,
    });
  } catch (error) {
    console.error(
      "Create Company Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create company",
    });
  }
};

const updateCompany = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      name,
      shortName,
      description,
      difficulty,
      hiringType,
      selectionProcess,
      requiredSkills,
      dsaTopics,
      technicalQuestions,
      hrQuestions,
      preparationTips,
      isActive,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Company name is required",
      });
    }

    const company =
      await CompanyPreparation.findById(
        id
      );

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Company not found",
      });
    }

    const duplicate =
      await CompanyPreparation.findOne({
        name: name.trim(),
        _id: {
          $ne: id,
        },
      });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message:
          "Another company already uses this name",
      });
    }

    company.name = name.trim();

    company.shortName =
      shortName?.trim() || "";

    company.description =
      description?.trim() || "";

    company.difficulty =
      difficulty || "Medium";

    company.hiringType =
      hiringType?.trim() ||
      "Campus Placement";

    company.selectionProcess =
      normalizeArray(
        selectionProcess
      );

    company.requiredSkills =
      normalizeArray(
        requiredSkills
      );

    company.dsaTopics =
      normalizeArray(dsaTopics);

    company.technicalQuestions =
      normalizeQuestions(
        technicalQuestions
      );

    company.hrQuestions =
      normalizeQuestions(
        hrQuestions
      );

    company.preparationTips =
      normalizeArray(
        preparationTips
      );

    if (
      typeof isActive ===
      "boolean"
    ) {
      company.isActive = isActive;
    }

    await company.save();

    return res.json({
      success: true,
      message:
        "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error(
      "Update Company Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update company",
    });
  }
};

const deleteCompany = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const company =
      await CompanyPreparation.findById(
        id
      );

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Company not found",
      });
    }

    await CompanyPreparation.findByIdAndDelete(
      id
    );

    return res.json({
      success: true,
      message:
        "Company deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Company Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete company",
    });
  }
};

/* =========================
   DSA QUESTIONS
========================= */

const seedDSAQuestions = async () => {
  const count =
    await DSAQuestion.countDocuments();

  if (count > 0) {
    return;
  }

  if (
    !Array.isArray(dsaQuestions) ||
    dsaQuestions.length === 0
  ) {
    return;
  }

  const questions =
    dsaQuestions.map((item) => ({
      title: item.title || "",
      topic: item.topic || "Arrays",
      difficulty:
        item.difficulty || "Easy",

      description:
        item.description || "",

      input: item.input || "",

      output: item.output || "",

      explanation:
        item.explanation || "",

      constraints:
        item.constraints || "",

      testCases: Array.isArray(
        item.testCases
      )
        ? item.testCases.map(
            (test) => ({
              input:
                test.input || "",

              expectedOutput:
                test.expectedOutput ||
                test.output ||
                "",
            })
          )
        : [],

      isActive: true,
    }));

  await DSAQuestion.insertMany(
    questions
  );

  console.log(
    `${questions.length} DSA questions seeded into MongoDB`
  );
};

const getAllDSAQuestions = async (
  req,
  res
) => {
  try {
    await seedDSAQuestions();

    const questions =
      await DSAQuestion.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(
      "Get Admin DSA Questions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load DSA questions",
    });
  }
};

const createDSAQuestion = async (
  req,
  res
) => {
  try {
    const {
      title,
      topic,
      difficulty,
      description,
      input,
      output,
      explanation,
      constraints,
      testCases,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Question title is required",
      });
    }

    if (!topic?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Question topic is required",
      });
    }

    const question =
      await DSAQuestion.create({
        title: title.trim(),

        topic: topic.trim(),

        difficulty:
          difficulty || "Easy",

        description:
          description?.trim() || "",

        input:
          input?.trim() || "",

        output:
          output?.trim() || "",

        explanation:
          explanation?.trim() || "",

        constraints:
          constraints?.trim() || "",

        testCases:
          normalizeTestCases(
            testCases
          ),

        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,
      });

    return res.status(201).json({
      success: true,
      message:
        "DSA question created successfully",
      question,
    });
  } catch (error) {
    console.error(
      "Create DSA Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create DSA question",
    });
  }
};

const updateDSAQuestion = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      topic,
      difficulty,
      description,
      input,
      output,
      explanation,
      constraints,
      testCases,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Question title is required",
      });
    }

    if (!topic?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Question topic is required",
      });
    }

    const question =
      await DSAQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "DSA question not found",
      });
    }

    question.title =
      title.trim();

    question.topic =
      topic.trim();

    question.difficulty =
      difficulty || "Easy";

    question.description =
      description?.trim() || "";

    question.input =
      input?.trim() || "";

    question.output =
      output?.trim() || "";

    question.explanation =
      explanation?.trim() || "";

    question.constraints =
      constraints?.trim() || "";

    question.testCases =
      normalizeTestCases(
        testCases
      );

    if (
      typeof isActive ===
      "boolean"
    ) {
      question.isActive =
        isActive;
    }

    await question.save();

    return res.json({
      success: true,
      message:
        "DSA question updated successfully",
      question,
    });
  } catch (error) {
    console.error(
      "Update DSA Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update DSA question",
    });
  }
};

const deleteDSAQuestion = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const question =
      await DSAQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "DSA question not found",
      });
    }

    await DSAQuestion.findByIdAndDelete(
      id
    );

    return res.json({
      success: true,
      message:
        "DSA question deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete DSA Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete DSA question",
    });
  }
};

module.exports = {
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
};