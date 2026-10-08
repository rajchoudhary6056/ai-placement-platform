const User = require("../models/User");
const DSAProgress = require("../models/DSAProgress");
const StudyPlan = require("../models/StudyPlan");

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5:1.5b";

/* =========================================================
   HELPERS
========================================================= */

const safeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item || "").trim())
    .filter(Boolean);
};

const parseAIJson = (text) => {
  if (!text) {
    throw new Error("Empty AI response");
  }

  let cleaned = String(text).trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      return JSON.parse(
        cleaned.substring(start, end + 1)
      );
    }

    throw new Error(
      "AI returned invalid JSON"
    );
  }
};

const normalizeWeek = (week, index) => {
  return {
    weekNumber:
      Number(week?.weekNumber) || index + 1,

    title:
      String(
        week?.title ||
          `Week ${index + 1} Preparation`
      ).trim(),

    focus:
      String(
        week?.focus ||
          "Placement preparation"
      ).trim(),

    goals: safeArray(week?.goals),

    topics: safeArray(week?.topics),

    tasks: safeArray(week?.tasks),

    practice: safeArray(week?.practice),

    resources: safeArray(week?.resources),

    estimatedHours:
      Number(week?.estimatedHours) || 10,

    completed: false,
  };
};

/* =========================================================
   OLLAMA
========================================================= */

const askOllama = async (prompt) => {
  const response = await fetch(
    `${OLLAMA_URL}/api/generate`,
    {
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
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama error: ${errorText}`
    );
  }

  const data =
    await response.json();

  return data.response || "";
};

/* =========================================================
   FALLBACK PLAN
========================================================= */

const createFallbackPlan = ({
  targetRole,
  skills,
  dsaSolved,
}) => {
  const hasMern =
    skills.some((skill) =>
      /mern|react|node|express|mongodb/i.test(
        skill
      )
    );

  const hasJava =
    skills.some((skill) =>
      /java/i.test(skill)
    );

  const plan = [
    {
      weekNumber: 1,
      title: "Programming Fundamentals",
      focus:
        "Strengthen programming fundamentals and problem solving.",
      goals: [
        "Improve programming logic",
        "Revise basic syntax and concepts",
      ],
      topics: [
        "Variables",
        "Loops",
        "Functions",
        "Arrays",
        "Strings",
      ],
      tasks: [
        "Solve 3 basic programming problems daily",
        "Revise important syntax and concepts",
      ],
      practice: [
        "Two Sum",
        "Maximum Element",
        "Reverse Array",
      ],
      resources: [
        "Placement coding practice",
        "DSA notes",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 2,
      title: "Arrays and Strings",
      focus:
        "Build strong array and string problem-solving skills.",
      goals: [
        "Solve common placement array problems",
        "Improve complexity analysis",
      ],
      topics: [
        "Arrays",
        "Strings",
        "Two Pointer",
        "Sliding Window",
      ],
      tasks: [
        "Solve 3 array problems daily",
        "Write complexity for every solution",
      ],
      practice: [
        "Two Sum",
        "Maximum Subarray",
        "Palindrome",
      ],
      resources: [
        "DSA practice",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 3,
      title: "Searching and Sorting",
      focus:
        "Master important searching and sorting algorithms.",
      goals: [
        "Understand binary search",
        "Revise sorting algorithms",
      ],
      topics: [
        "Linear Search",
        "Binary Search",
        "Bubble Sort",
        "Selection Sort",
        "Insertion Sort",
      ],
      tasks: [
        "Implement each algorithm",
        "Solve at least 10 problems",
      ],
      practice: [
        "Binary Search",
        "Sorting problems",
      ],
      resources: [
        "DSA practice",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 4,
      title: "Linked List and Stack",
      focus:
        "Prepare commonly asked interview data structures.",
      goals: [
        "Understand linked list operations",
        "Understand stack applications",
      ],
      topics: [
        "Linked List",
        "Stack",
        "Queue",
      ],
      tasks: [
        "Implement linked list",
        "Practice stack problems",
      ],
      practice: [
        "Reverse Linked List",
        "Valid Parentheses",
      ],
      resources: [
        "DSA practice",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 5,
      title: "Hashing and Recursion",
      focus:
        "Improve problem solving using hashing and recursion.",
      goals: [
        "Understand HashMap",
        "Practice recursion",
      ],
      topics: [
        "HashMap",
        "HashSet",
        "Recursion",
      ],
      tasks: [
        "Solve hashing problems",
        "Practice recursive solutions",
      ],
      practice: [
        "First Non-Repeating Character",
        "Frequency problems",
      ],
      resources: [
        "DSA practice",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 6,
      title: "MERN / Development Revision",
      focus: hasMern
        ? "Strengthen MERN stack interview preparation."
        : "Strengthen web development fundamentals.",
      goals: [
        "Revise frontend and backend concepts",
        "Prepare project explanations",
      ],
      topics: hasMern
        ? [
            "React",
            "Node.js",
            "Express.js",
            "MongoDB",
          ]
        : [
            "HTML",
            "CSS",
            "JavaScript",
            "Web APIs",
          ],
      tasks: [
        "Revise your major project",
        "Prepare project architecture explanation",
        "Practice 10 technical questions",
      ],
      practice: [
        "Explain your project",
        "Explain API flow",
      ],
      resources: [
        "Your project source code",
      ],
      estimatedHours: 12,
    },

    {
      weekNumber: 7,
      title: "Backend and Database",
      focus:
        "Prepare backend and database interview concepts.",
      goals: [
        "Understand REST APIs",
        "Revise database concepts",
      ],
      topics: [
        "REST API",
        "Node.js",
        "Express.js",
        "MongoDB",
        "SQL",
      ],
      tasks: [
        "Practice API design",
        "Revise CRUD operations",
        "Practice database questions",
      ],
      practice: [
        "Build a CRUD API",
        "MongoDB aggregation practice",
      ],
      resources: [
        "Project backend",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 8,
      title: "Java and OOP",
      focus:
        "Strengthen Java and object-oriented programming.",
      goals: [
        "Revise OOP",
        "Improve Java coding",
      ],
      topics: [
        "Classes",
        "Objects",
        "Inheritance",
        "Polymorphism",
        "Encapsulation",
        "Abstraction",
      ],
      tasks: [
        "Solve Java coding problems",
        "Practice OOP interview questions",
      ],
      practice: [
        "Java basic programs",
        "OOP problems",
      ],
      resources: [
        "Java notes",
      ],
      estimatedHours: hasJava ? 10 : 8,
    },

    {
      weekNumber: 9,
      title: "Computer Science Fundamentals",
      focus:
        "Revise important placement theory subjects.",
      goals: [
        "Prepare CS fundamentals",
        "Improve technical interview confidence",
      ],
      topics: [
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "OOP",
      ],
      tasks: [
        "Revise 20 questions daily",
        "Prepare short interview answers",
      ],
      practice: [
        "DBMS interview questions",
        "OS interview questions",
        "CN interview questions",
      ],
      resources: [
        "Placement notes",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 10,
      title: "Company Specific Preparation",
      focus:
        `Prepare specifically for ${targetRole}.`,
      goals: [
        "Practice company-style questions",
        "Improve interview readiness",
      ],
      topics: [
        "Company Questions",
        "DSA",
        "Technical Interview",
      ],
      tasks: [
        "Practice 5 DSA problems daily",
        "Research target companies",
        "Prepare project questions",
      ],
      practice: [
        "Company preparation",
        "DSA timed practice",
      ],
      resources: [
        "Company Preparation module",
      ],
      estimatedHours: 12,
    },

    {
      weekNumber: 11,
      title: "Mock Interviews",
      focus:
        "Improve technical and HR interview performance.",
      goals: [
        "Complete multiple mock interviews",
        "Improve answer quality",
      ],
      topics: [
        "Technical Interview",
        "HR Interview",
        "Project Discussion",
      ],
      tasks: [
        "Complete 3 mock interviews",
        "Review AI feedback",
        "Improve weak areas",
      ],
      practice: [
        "AI Mock Interview",
        "HR questions",
      ],
      resources: [
        "AI Mock Interview module",
      ],
      estimatedHours: 10,
    },

    {
      weekNumber: 12,
      title: "Final Placement Revision",
      focus:
        "Final revision and placement readiness.",
      goals: [
        "Revise important concepts",
        "Build interview confidence",
      ],
      topics: [
        "DSA",
        "Projects",
        "CS Fundamentals",
        "HR",
      ],
      tasks: [
        "Take a complete mock interview",
        "Revise weak topics",
        "Prepare final self-introduction",
      ],
      practice: [
        "Full placement mock test",
        "Final DSA revision",
      ],
      resources: [
        "All platform modules",
      ],
      estimatedHours: 12,
    },
  ];

  return {
    planTitle:
      "Personalized 12-Week Placement Plan",

    summary:
      `A personalized preparation roadmap for ${targetRole}. Current DSA solved count: ${dsaSolved}.`,

    currentLevel:
      dsaSolved >= 20
        ? "Intermediate"
        : "Beginner",

    placementGoal:
      `Become placement-ready for ${targetRole}.`,

    weeks: plan,
  };
};

/* =========================================================
   GENERATE STUDY PLAN
========================================================= */

const generateStudyPlan = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const user =
      await User.findById(userId).select(
        "-password"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const dsaProgress =
      await DSAProgress.findOne({
        user: userId,
      });

    const skills =
      safeArray(user.skills);

    const dsaSolved =
      dsaProgress?.totalSolved || 0;

    const targetRole =
      user.targetRole ||
      "Software Developer";

    const prompt = `
You are an expert placement preparation mentor.

Create a personalized 12-week placement preparation study plan.

Student profile:

Target Role:
${targetRole}

Skills:
${skills.join(", ") || "No skills added"}

Education:
${user.education?.degree || ""}
${user.education?.branch || ""}

Graduation Year:
${user.education?.graduationYear || ""}

CGPA:
${user.education?.cgpa || ""}

Experience:
${user.experience || "Fresher"}

Bio:
${user.bio || ""}

DSA Questions Solved:
${dsaSolved}

The plan must be realistic for a college student preparing for placements.

Prioritize:
1. Weak or missing technical skills
2. DSA
3. Core CS subjects
4. Development/project preparation
5. Technical interviews
6. HR interviews
7. Company preparation
8. Mock interviews

Return ONLY valid JSON.

Use exactly this structure:

{
  "planTitle": "string",
  "summary": "string",
  "currentLevel": "Beginner or Intermediate or Advanced",
  "placementGoal": "string",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "string",
      "focus": "string",
      "goals": ["string"],
      "topics": ["string"],
      "tasks": ["string"],
      "practice": ["string"],
      "resources": ["string"],
      "estimatedHours": 10
    }
  ]
}

Rules:
- Exactly 12 weeks.
- Each week must have 2-5 goals.
- Each week must have 3-6 topics/tasks.
- Keep tasks practical.
- Include DSA throughout the plan.
- Include technical interview preparation.
- Include HR preparation near the end.
- Include mock interviews.
- Do not invent certifications.
- Do not use markdown.
`;

    let aiPlan;

    try {
      const aiResponse =
        await askOllama(prompt);

      aiPlan =
        parseAIJson(aiResponse);
    } catch (aiError) {
      console.error(
        "Study Plan AI Error:",
        aiError.message
      );

      aiPlan =
        createFallbackPlan({
          targetRole,
          skills,
          dsaSolved,
        });
    }

    let weeks =
      Array.isArray(aiPlan?.weeks)
        ? aiPlan.weeks
        : [];

    if (weeks.length !== 12) {
      const fallback =
        createFallbackPlan({
          targetRole,
          skills,
          dsaSolved,
        });

      weeks = fallback.weeks;
    }

    weeks = weeks
      .slice(0, 12)
      .map(normalizeWeek);

    const planData = {
      user: userId,

      targetRole,

      planTitle:
        String(
          aiPlan?.planTitle ||
            `Personalized 12-Week Plan for ${targetRole}`
        ).trim(),

      summary:
        String(
          aiPlan?.summary ||
            `Personalized placement preparation plan for ${targetRole}.`
        ).trim(),

      currentLevel:
        String(
          aiPlan?.currentLevel ||
            "Beginner"
        ).trim(),

      placementGoal:
        String(
          aiPlan?.placementGoal ||
            `Become placement-ready for ${targetRole}.`
        ).trim(),

      weeks,

      totalWeeks: 12,

      completedWeeks: 0,
    };

    const studyPlan =
      await StudyPlan.findOneAndUpdate(
        { user: userId },
        planData,
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Personalized study plan generated successfully",
      studyPlan,
    });
  } catch (error) {
    console.error(
      "Generate Study Plan Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate study plan",
    });
  }
};

/* =========================================================
   GET LATEST PLAN
========================================================= */

const getStudyPlan = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const studyPlan =
      await StudyPlan.findOne({
        user: userId,
      }).lean();

    return res.status(200).json({
      success: true,
      studyPlan: studyPlan || null,
    });
  } catch (error) {
    console.error(
      "Get Study Plan Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get study plan",
    });
  }
};

/* =========================================================
   COMPLETE WEEK
========================================================= */

const completeWeek = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const weekNumber =
      Number(req.params.weekNumber);

    if (
      !Number.isInteger(weekNumber) ||
      weekNumber < 1 ||
      weekNumber > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid week number",
      });
    }

    const studyPlan =
      await StudyPlan.findOne({
        user: userId,
      });

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message:
          "Study plan not found",
      });
    }

    const week =
      studyPlan.weeks.find(
        (item) =>
          item.weekNumber === weekNumber
      );

    if (!week) {
      return res.status(404).json({
        success: false,
        message: "Week not found",
      });
    }

    week.completed = !week.completed;

    studyPlan.completedWeeks =
      studyPlan.weeks.filter(
        (item) => item.completed
      ).length;

    await studyPlan.save();

    return res.status(200).json({
      success: true,
      message: week.completed
        ? "Week completed"
        : "Week marked incomplete",
      studyPlan,
    });
  } catch (error) {
    console.error(
      "Complete Week Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update week",
    });
  }
};

module.exports = {
  generateStudyPlan,
  getStudyPlan,
  completeWeek,
};