const Job = require("../models/Job");
const User = require("../models/User");

/*
==================================================
DEFAULT JOBS
==================================================
*/

const defaultJobs = [
  {
    title: "MERN Stack Developer",
    company: "TechNova Solutions",
    location: "Remote / India",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Work on modern web applications using the MERN stack.",
    skills: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "HTML",
      "CSS",
    ],
    salary: "₹4 - ₹7 LPA",
    applyUrl: "#",
  },

  {
    title: "Frontend Developer",
    company: "WebCraft Technologies",
    location: "Bangalore / Remote",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Build responsive and interactive web applications.",
    skills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
    ],
    salary: "₹3.5 - ₹6 LPA",
    applyUrl: "#",
  },

  {
    title: "Backend Developer",
    company: "CodeSphere",
    location: "Pune / Remote",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Develop scalable backend APIs and database systems.",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST API",
      "JavaScript",
    ],
    salary: "₹4 - ₹8 LPA",
    applyUrl: "#",
  },

  {
    title: "Java Developer",
    company: "EnterpriseSoft",
    location: "Hyderabad",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Develop enterprise applications using Java and databases.",
    skills: [
      "Java",
      "DSA",
      "SQL",
      "OOP",
      "Git",
    ],
    salary: "₹4 - ₹7 LPA",
    applyUrl: "#",
  },

  {
    title: "React Developer Intern",
    company: "Innovate Labs",
    location: "Remote",
    jobType: "Internship",
    experience: "Fresher",
    description:
      "Work with the frontend team to develop React applications.",
    skills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
    ],
    salary: "₹15K - ₹25K / Month",
    applyUrl: "#",
  },

  {
    title: "Full Stack Developer",
    company: "DigitalEdge",
    location: "Indore / Remote",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Build complete web applications from frontend to backend.",
    skills: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "REST API",
    ],
    salary: "₹4 - ₹8 LPA",
    applyUrl: "#",
  },

  {
    title: "Software Developer",
    company: "NextGen Technologies",
    location: "Noida",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Work on software development and problem solving.",
    skills: [
      "Java",
      "DSA",
      "SQL",
      "OOP",
      "JavaScript",
    ],
    salary: "₹4 - ₹7 LPA",
    applyUrl: "#",
  },

  {
    title: "Node.js Developer",
    company: "CloudByte",
    location: "Remote / India",
    jobType: "Full Time",
    experience: "Fresher",
    description:
      "Develop REST APIs and backend services using Node.js.",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST API",
      "JavaScript",
    ],
    salary: "₹4 - ₹7 LPA",
    applyUrl: "#",
  },
];

/*
==================================================
NORMALIZE SKILL
==================================================
*/

const normalizeSkill = (skill) => {
  return String(skill || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

/*
==================================================
CALCULATE MATCH
==================================================
*/

const calculateMatch = (
  userSkills,
  jobSkills
) => {
  if (
    !Array.isArray(userSkills) ||
    !Array.isArray(jobSkills) ||
    jobSkills.length === 0
  ) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: jobSkills || [],
    };
  }

  const normalizedUserSkills =
    userSkills.map(normalizeSkill);

  const matchedSkills = [];

  const missingSkills = [];

  jobSkills.forEach((jobSkill) => {
    const normalizedJobSkill =
      normalizeSkill(jobSkill);

    const isMatched =
      normalizedUserSkills.some(
        (userSkill) => {
          return (
            userSkill === normalizedJobSkill ||
            userSkill.includes(
              normalizedJobSkill
            ) ||
            normalizedJobSkill.includes(
              userSkill
            )
          );
        }
      );

    if (isMatched) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  const percentage = Math.round(
    (matchedSkills.length /
      jobSkills.length) *
      100
  );

  return {
    percentage,
    matchedSkills,
    missingSkills,
  };
};

/*
==================================================
CREATE DEFAULT JOBS IF DATABASE IS EMPTY
==================================================
*/

const ensureDefaultJobs = async () => {
  const count = await Job.countDocuments();

  if (count === 0) {
    await Job.insertMany(defaultJobs);

    console.log(
      "Default jobs inserted successfully"
    );
  }
};

/*
==================================================
GET JOB RECOMMENDATIONS
==================================================
*/

const getRecommendedJobs = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select(
      "skills targetRole education"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await ensureDefaultJobs();

    const jobs = await Job.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    const userSkills = Array.isArray(
      user.skills
    )
      ? user.skills
      : [];

    const recommendations = jobs
      .map((job) => {
        const match = calculateMatch(
          userSkills,
          job.skills
        );

        return {
          id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          experience: job.experience,
          description: job.description,
          skills: job.skills,
          salary: job.salary,
          applyUrl: job.applyUrl,

          matchPercentage:
            match.percentage,

          matchedSkills:
            match.matchedSkills,

          missingSkills:
            match.missingSkills,
        };
      })
      .sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

    res.status(200).json({
      success: true,

      targetRole:
        user.targetRole || "",

      userSkills,

      jobs: recommendations,
    });
  } catch (error) {
    console.error(
      "Get Recommended Jobs Error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load job recommendations",
      error: error.message,
    });
  }
};

/*
==================================================
GET SINGLE JOB
==================================================
*/

const getJobById = async (
  req,
  res
) => {
  try {
    await ensureDefaultJobs();

    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const user = await User.findById(
      req.user.id
    ).select("skills");

    const match = calculateMatch(
      user?.skills || [],
      job.skills
    );

    res.status(200).json({
      success: true,

      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        experience: job.experience,
        description: job.description,
        skills: job.skills,
        salary: job.salary,
        applyUrl: job.applyUrl,

        matchPercentage:
          match.percentage,

        matchedSkills:
          match.matchedSkills,

        missingSkills:
          match.missingSkills,
      },
    });
  } catch (error) {
    console.error(
      "Get Job Error:",
      error
    );

    res.status(500).json({
      message: "Unable to load job",
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendedJobs,
  getJobById,
};