const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const {
  spawnSync,
} = require("child_process");

const DSAProgress = require("../models/DSAProgress");
const DSAQuestion = require("../models/DSAQuestion");

const dsaQuestions = require("../data/dsaQuestions");

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5:1.5b";

/* =========================
   HELPERS
========================= */

const safeArray = (value) => {
  return Array.isArray(value)
    ? value
    : [];
};

const normalizeOutput = (
  output
) => {
  return String(output || "")
    .replace(/\r/g, "")
    .trim();
};

const parseAIJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    const start =
      text.indexOf("{");

    const end =
      text.lastIndexOf("}");

    if (
      start !== -1 &&
      end !== -1 &&
      end > start
    ) {
      return JSON.parse(
        text.slice(start, end + 1)
      );
    }

    throw error;
  }
};

const seedQuestions = async () => {
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
      topic:
        item.topic || "Arrays",

      difficulty:
        item.difficulty || "Easy",

      description:
        item.description || "",

      input: item.input || "",

      output:
        item.output || "",

      explanation:
        item.explanation || "",

      constraints:
        item.constraints || "",

      testCases:
        Array.isArray(
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
    `${questions.length} DSA questions seeded`
  );
};

/* =========================
   OLLAMA
========================= */

const askOllama = async (
  prompt
) => {
  const response =
    await fetch(
      `${OLLAMA_URL}/api/generate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
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
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `Ollama error: ${text}`
    );
  }

  const data =
    await response.json();

  return data.response || "";
};

/* =========================
   GET QUESTIONS
========================= */

const getQuestions = async (
  req,
  res
) => {
  try {
    await seedQuestions();

    const {
      topic = "All",
      difficulty = "All",
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (
      topic &&
      topic !== "All"
    ) {
      filter.topic = topic;
    }

    if (
      difficulty &&
      difficulty !== "All"
    ) {
      filter.difficulty =
        difficulty;
    }

    const questions =
      await DSAQuestion.find(
        filter
      )
        .select(
          "title topic difficulty description"
        )
        .sort({
          createdAt: 1,
        })
        .lean();

    const progress =
      await DSAProgress.findOne({
        user: req.user.id,
      }).lean();

    const solvedIds = new Set(
      safeArray(
        progress?.solvedQuestions
      )
        .filter(
          (item) =>
            item.status === "solved"
        )
        .map((item) =>
          String(item.questionId)
        )
    );

    const formattedQuestions =
      questions.map(
        (question) => ({
          ...question,

          id: String(
            question._id
          ),

          solved:
            solvedIds.has(
              String(question._id)
            ),
        })
      );

    return res.json({
      success: true,
      questions:
        formattedQuestions,
    });
  } catch (error) {
    console.error(
      "Get DSA Questions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load DSA questions",
    });
  }
};

/* =========================
   GET SINGLE QUESTION
========================= */

const getQuestion = async (
  req,
  res
) => {
  try {
    await seedQuestions();

    const question =
      await DSAQuestion.findOne({
        _id: req.params.id,
        isActive: true,
      }).lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found",
      });
    }

    return res.json({
      success: true,

      question: {
        ...question,

        id: String(
          question._id
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get DSA Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load question",
    });
  }
};

/* =========================
   RUN JAVA
========================= */

const runJavaCode = (
  code,
  input
) => {
  const tempDir =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "placement-dsa-"
      )
    );

  const className =
    "Solution";

  const javaFile =
    path.join(
      tempDir,
      `${className}.java`
    );

  fs.writeFileSync(
    javaFile,
    code,
    "utf8"
  );

  const compile =
    spawnSync(
      "javac",
      [javaFile],
      {
        encoding: "utf8",
        timeout: 10000,
      }
    );

  if (
    compile.error ||
    compile.status !== 0
  ) {
    fs.rmSync(
      tempDir,
      {
        recursive: true,
        force: true,
      }
    );

    return {
      success: false,

      error:
        compile.stderr ||
        compile.error?.message ||
        "Compilation failed",
    };
  }

  const run =
    spawnSync(
      "java",
      [
        "-cp",
        tempDir,
        className,
      ],
      {
        input,
        encoding: "utf8",
        timeout: 5000,
      }
    );

  const result = {
    success:
      run.status === 0,

    output:
      run.stdout || "",

    error:
      run.stderr ||
      run.error?.message ||
      "",
  };

  fs.rmSync(
    tempDir,
    {
      recursive: true,
      force: true,
    }
  );

  return result;
};

/* =========================
   AI EVALUATION
========================= */

const evaluateCode = async ({
  question,
  code,
  testResults,
}) => {
  const prompt = `
You are an expert coding interviewer.

Evaluate the student's Java solution.

QUESTION:
${question.title}

DESCRIPTION:
${question.description}

STUDENT CODE:
${code}

TEST RESULTS:
${JSON.stringify(
  testResults
)}

Return ONLY valid JSON.

Required format:

{
  "score": 0,
  "verdict": "Correct Solution",
  "feedback": "short feedback",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "strengths": [
    "strength"
  ],
  "improvements": [
    "improvement"
  ]
}

Rules:

- score must be between 0 and 10
- judge correctness based on test results and code
- do not claim code is correct if tests fail
- do not suggest HashSet as an optimization for a solution that already uses HashMap for Two Sum
- keep feedback concise
`;

  try {
    const response =
      await askOllama(
        prompt
      );

    return parseAIJson(
      response
    );
  } catch (error) {
    return {
      score: 0,

      verdict:
        "Evaluation Failed",

      feedback:
        "AI evaluation could not be completed.",

      timeComplexity:
        "Not available",

      spaceComplexity:
        "Not available",

      strengths: [],

      improvements: [],
    };
  }
};

/* =========================
   RUN CODE
========================= */

const runCode = async (
  req,
  res
) => {
  try {
    const {
      questionId,
      code,
      language = "Java",
    } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message:
          "Question ID is required",
      });
    }

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Code is required",
      });
    }

    if (language !== "Java") {
      return res.status(400).json({
        success: false,
        message:
          "Only Java is currently supported",
      });
    }

    const question =
      await DSAQuestion.findById(
        questionId
      ).lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found",
      });
    }

    const testCases =
      safeArray(
        question.testCases
      );

    const results = [];

    for (
      let i = 0;
      i < testCases.length;
      i++
    ) {
      const testCase =
        testCases[i];

      const result =
        runJavaCode(
          code,
          testCase.input
        );

      const actual =
        normalizeOutput(
          result.output
        );

      const expected =
        normalizeOutput(
          testCase.expectedOutput
        );

      const passed =
        result.success &&
        actual === expected;

      results.push({
        testCase: i + 1,

        input:
          testCase.input,

        expected,

        actual,

        passed,

        error:
          result.error || "",
      });

      if (!result.success) {
        break;
      }
    }

    const passedCount =
      results.filter(
        (item) => item.passed
      ).length;

    return res.json({
      success: true,

      results,

      total:
        testCases.length,

      passed: passedCount,

      allPassed:
        testCases.length > 0 &&
        passedCount ===
          testCases.length,
    });
  } catch (error) {
    console.error(
      "Run DSA Code Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to run code",
    });
  }
};

/* =========================
   SUBMIT SOLUTION
========================= */

const submitSolution = async (
  req,
  res
) => {
  try {
    const {
      questionId,
      code,
      language = "Java",
    } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message:
          "Question ID is required",
      });
    }

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Code is required",
      });
    }

    const question =
      await DSAQuestion.findById(
        questionId
      ).lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Question not found",
      });
    }

    const testCases =
      safeArray(
        question.testCases
      );

    const testResults = [];

    for (
      let i = 0;
      i < testCases.length;
      i++
    ) {
      const testCase =
        testCases[i];

      const result =
        runJavaCode(
          code,
          testCase.input
        );

      const actual =
        normalizeOutput(
          result.output
        );

      const expected =
        normalizeOutput(
          testCase.expectedOutput
        );

      testResults.push({
        testCase: i + 1,

        input:
          testCase.input,

        expected,

        actual,

        passed:
          result.success &&
          actual === expected,

        error:
          result.error || "",
      });

      if (!result.success) {
        break;
      }
    }

    const passed =
      testResults.filter(
        (item) => item.passed
      ).length;

    const allPassed =
      testResults.length ===
        testCases.length &&
      testCases.length > 0 &&
      passed ===
        testCases.length;

    const aiEvaluation =
      await evaluateCode({
        question,
        code,
        testResults,
      });

    const score = allPassed
      ? Math.max(
          1,
          Math.min(
            10,
            Number(
              aiEvaluation.score
            ) || 8
          )
        )
      : Math.min(
          7,
          Number(
            aiEvaluation.score
          ) || 5
        );

    let progress =
      await DSAProgress.findOne({
        user: req.user.id,
      });

    if (!progress) {
      progress =
        await DSAProgress.create({
          user: req.user.id,
          solvedQuestions: [],
        });
    }

    const existingIndex =
      progress.solvedQuestions.findIndex(
        (item) =>
          String(
            item.questionId
          ) ===
          String(questionId)
      );

    const solvedStatus =
      allPassed
        ? "solved"
        : "attempted";

    const solutionData = {
      questionId,
      code,
      language,
      score,
      status: solvedStatus,
      feedback:
        aiEvaluation.feedback ||
        "",
      submittedAt:
        new Date(),
    };

    if (existingIndex !== -1) {
      progress.solvedQuestions[
        existingIndex
      ] = solutionData;
    } else {
      progress.solvedQuestions.push(
        solutionData
      );
    }

    progress.totalSolved =
      progress.solvedQuestions.filter(
        (item) =>
          item.status ===
          "solved"
      ).length;

    progress.totalAttempted =
      progress.solvedQuestions.length;

    progress.totalScore =
      progress.solvedQuestions.reduce(
        (sum, item) =>
          sum +
          (Number(
            item.score
          ) || 0),
        0
      );

    await progress.save();

    return res.json({
      success: true,

      solved: allPassed,

      score,

      testResults,

      evaluation: {
        verdict:
          aiEvaluation.verdict,

        feedback:
          aiEvaluation.feedback,

        timeComplexity:
          aiEvaluation.timeComplexity,

        spaceComplexity:
          aiEvaluation.spaceComplexity,

        strengths:
          safeArray(
            aiEvaluation.strengths
          ),

        improvements:
          safeArray(
            aiEvaluation.improvements
          ),
      },

      progress: {
        totalSolved:
          progress.totalSolved,

        totalAttempted:
          progress.totalAttempted,

        totalScore:
          progress.totalScore,
      },
    });
  } catch (error) {
    console.error(
      "Submit DSA Solution Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit solution",
    });
  }
};

/* =========================
   PROGRESS
========================= */

const getProgress = async (
  req,
  res
) => {
  try {
    await seedQuestions();

    const progress =
      await DSAProgress.findOne({
        user: req.user.id,
      }).lean();

    const totalQuestions =
      await DSAQuestion.countDocuments({
        isActive: true,
      });

    const totalSolved =
      progress?.totalSolved || 0;

    const totalAttempted =
      progress?.totalAttempted || 0;

    const progressPercentage =
      totalQuestions > 0
        ? Math.round(
            (totalSolved /
              totalQuestions) *
              100
          )
        : 0;

    return res.json({
      success: true,

      progress: {
        ...(progress || {}),

        totalSolved,

        totalAttempted,

        totalScore:
          progress?.totalScore || 0,

        totalQuestions,

        progressPercentage,
      },
    });
  } catch (error) {
    console.error(
      "Get DSA Progress Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load DSA progress",
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  runCode,
  submitSolution,
  getProgress,
};