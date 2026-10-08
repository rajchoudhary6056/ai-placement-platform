const SkillGapAnalysis = require("../models/SkillGapAnalysis");
const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

/* =========================================================
   OLLAMA
========================================================= */

const askOllama = async (prompt) => {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama error: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return data.response || "";
};

/* =========================================================
   JSON PARSER
========================================================= */

const parseAIJson = (text) => {
  if (!text) {
    throw new Error("AI returned empty response");
  }

  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      const jsonPart = cleaned.substring(start, end + 1);

      return JSON.parse(jsonPart);
    }

    throw new Error("AI returned invalid JSON");
  }
};

/* =========================================================
   HELPERS
========================================================= */

const safeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value;
};

const normalizeNumber = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(number)));
};

/* =========================================================
   ANALYZE SKILL GAP
========================================================= */

const analyzeSkillGap = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const targetRole =
      user.targetRole?.trim() || "MERN Developer";

    const latestResume = await ResumeAnalysis.findOne({
      user: userId,
    }).sort({ createdAt: -1 });

    const currentSkills = safeArray(user.skills);

    const resumeSkills = latestResume
      ? [
          ...safeArray(latestResume.missingSkills),
          ...safeArray(latestResume.recommendedSkills),
        ]
      : [];

    const education = user.education || {};

    const prompt = `
You are an AI career guidance assistant for a college placement preparation platform.

Analyze the student's current skills and target job role.

TARGET ROLE:
${targetRole}

CURRENT SKILLS:
${currentSkills.length ? currentSkills.join(", ") : "No skills added"}

EDUCATION:
College: ${education.college || "Not provided"}
Degree: ${education.degree || "B.Tech"}
Branch: ${education.branch || "Computer Science"}
Graduation Year: ${education.graduationYear || "Not provided"}
CGPA: ${education.cgpa || "Not provided"}

EXPERIENCE:
${user.experience || "Fresher"}

LATEST RESUME INFORMATION:
Resume Score: ${
      latestResume ? latestResume.resumeScore : "Not available"
    }

Resume ATS Score: ${
      latestResume ? latestResume.atsScore : "Not available"
    }

Resume Missing Skills:
${
  latestResume?.missingSkills?.length
    ? latestResume.missingSkills.join(", ")
    : "Not available"
}

Resume Recommended Skills:
${
  latestResume?.recommendedSkills?.length
    ? latestResume.recommendedSkills.join(", ")
    : "Not available"
}

IMPORTANT:
Return ONLY valid JSON.

Return exactly this structure:

{
  "overallReadiness": 0,
  "strongSkills": [],
  "missingSkills": [
    {
      "skill": "",
      "priority": "High",
      "reason": ""
    }
  ],
  "summary": "",
  "roadmap": [
    {
      "week": 1,
      "title": "",
      "skills": [],
      "tasks": [],
      "resources": []
    }
  ]
}

RULES:

1. overallReadiness must be between 0 and 100.
2. strongSkills should contain skills the student already has.
3. missingSkills should contain realistic skills required for the target role.
4. Priority must be exactly High, Medium or Low.
5. Give maximum 8 missing skills.
6. Create a practical 12-week roadmap.
7. Week numbers must be 1 to 12.
8. Each week should contain:
   - title
   - skills
   - 2 to 4 practical tasks
   - 1 to 3 resources
9. Focus on placement preparation.
10. Include DSA, projects, interview preparation and job-specific skills where appropriate.
11. Do not recommend unrealistic advanced technologies.
12. Keep explanations concise.
`;

    const aiResponse = await askOllama(prompt);

    const parsed = parseAIJson(aiResponse);

    const analysis = {
      user: userId,
      targetRole,
      currentSkills,
      strongSkills: safeArray(parsed.strongSkills),

      missingSkills: safeArray(parsed.missingSkills)
        .slice(0, 8)
        .map((item) => ({
          skill: item.skill || "Unknown Skill",
          priority: ["High", "Medium", "Low"].includes(
            item.priority
          )
            ? item.priority
            : "Medium",
          reason: item.reason || "",
        })),

      overallReadiness: normalizeNumber(
        parsed.overallReadiness
      ),

      summary:
        parsed.summary ||
        "Your skill gap analysis has been generated.",

      roadmap: safeArray(parsed.roadmap)
        .slice(0, 12)
        .map((item, index) => ({
          week: Number(item.week) || index + 1,
          title:
            item.title ||
            `Week ${index + 1} Preparation`,

          skills: safeArray(item.skills),

          tasks: safeArray(item.tasks),

          resources: safeArray(item.resources),
        })),
    };

    const savedAnalysis =
      await SkillGapAnalysis.create(analysis);

    return res.status(201).json({
      success: true,
      message: "Skill gap analysis generated successfully",
      analysis: savedAnalysis,
    });
  } catch (error) {
    console.error(
      "Skill Gap Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate skill gap analysis",
    });
  }
};

/* =========================================================
   HISTORY
========================================================= */

const getSkillGapHistory = async (req, res) => {
  try {
    const analyses = await SkillGapAnalysis.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("-roadmap");

    return res.json({
      success: true,
      analyses,
    });
  } catch (error) {
    console.error(
      "Skill Gap History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skill gap history",
    });
  }
};

/* =========================================================
   LATEST ANALYSIS
========================================================= */

const getLatestSkillGap = async (req, res) => {
  try {
    const analysis =
      await SkillGapAnalysis.findOne({
        user: req.user.id,
      }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(
      "Latest Skill Gap Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest analysis",
    });
  }
};

module.exports = {
  analyzeSkillGap,
  getSkillGapHistory,
  getLatestSkillGap,
};