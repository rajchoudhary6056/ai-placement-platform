const MockInterview = require("../models/MockInterview");
const User = require("../models/User");

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5:1.5b";

/*
=========================================================
OLLAMA REQUEST
=========================================================
*/

const askOllama = async (prompt) => {
  const response = await fetch(
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
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama error ${response.status}: ${errorText}`
    );
  }

  const data =
    await response.json();

  if (!data.response) {
    throw new Error(
      "Ollama did not return a response."
    );
  }

  return data.response;
};


/*
=========================================================
PARSE JSON
=========================================================
*/

const parseAIJson = (text) => {
  let cleanText = text.trim();

  cleanText = cleanText
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/i,
      ""
    )
    .trim();

  return JSON.parse(cleanText);
};


/*
=========================================================
START INTERVIEW
=========================================================
*/

const startInterview = async (
  req,
  res
) => {
  try {

    const {
      jobRole,
      interviewType,
    } = req.body;

    if (!jobRole || !interviewType) {
      return res.status(400).json({
        success: false,
        message:
          "Job role and interview type are required.",
      });
    }

    if (
      !["Technical", "HR"].includes(
        interviewType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview type.",
      });
    }

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    const skills =
      Array.isArray(user.skills)
        ? user.skills.join(", ")
        : "Not specified";

    const prompt = `
You are an expert placement interviewer.

Generate 5 interview questions for a student.

Job Role:
${jobRole}

Interview Type:
${interviewType}

Student Skills:
${skills}

Student Education:
${user.education?.degree || "B.Tech"}
${user.education?.branch || "Computer Science"}

Target Role:
${user.targetRole || jobRole}

Generate questions suitable for a fresher/entry-level student.

For Technical interview:
Focus on programming, DSA, JavaScript, React, Node.js,
MongoDB, APIs, databases and practical development.

For HR interview:
Focus on introduction, strengths, weaknesses,
career goals, teamwork, challenges and behavioral questions.

Return ONLY valid JSON.

Format:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ]
}

Return exactly 5 questions.
`;

    const aiResponse =
      await askOllama(prompt);

    let result;

    try {
      result =
        parseAIJson(aiResponse);
    } catch (error) {
      console.error(
        "Question JSON Error:",
        aiResponse
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid questions. Please try again.",
      });
    }

    const questions =
      Array.isArray(result.questions)
        ? result.questions
            .filter(
              (q) =>
                typeof q === "string" &&
                q.trim()
            )
            .slice(0, 5)
        : [];

    if (questions.length === 0) {
      return res.status(500).json({
        success: false,
        message:
          "AI could not generate interview questions.",
      });
    }

    const interview =
      await MockInterview.create({
        user: user._id,

        jobRole,

        interviewType,

        totalQuestions:
          questions.length,

        currentQuestion: 1,

        questions,

        answers: [],

        totalScore: 0,

        status: "in-progress",
      });

    return res.status(201).json({
      success: true,

      message:
        "Interview started successfully.",

      interview: {
        id: interview._id,

        jobRole:
          interview.jobRole,

        interviewType:
          interview.interviewType,

        totalQuestions:
          interview.totalQuestions,

        currentQuestion:
          interview.currentQuestion,

        question:
          interview.questions[0],
      },
    });

  } catch (error) {

    console.error(
      "Start Interview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to start interview.",
    });
  }
};


/*
=========================================================
SUBMIT ANSWER
=========================================================
*/

const submitAnswer = async (
  req,
  res
) => {
  try {

    const {
      interviewId,
      answer,
    } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message:
          "Interview ID and answer are required.",
      });
    }

    const interview =
      await MockInterview.findOne({
        _id: interviewId,
        user: req.user.id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    if (
      interview.status ===
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This interview is already completed.",
      });
    }

    const questionIndex =
      interview.answers.length;

    const question =
      interview.questions[
        questionIndex
      ];

    if (!question) {
      return res.status(400).json({
        success: false,
        message:
          "No more questions available.",
      });
    }

    const prompt = `
You are an expert technical interviewer.

Evaluate a student's interview answer.

Job Role:
${interview.jobRole}

Interview Type:
${interview.interviewType}

Question:
${question}

Student Answer:
${answer}

Give an objective evaluation suitable for a fresher.

Return ONLY valid JSON.

Format:

{
  "score": 0,
  "feedback": "",
  "missingPoints": [],
  "improvements": []
}

Rules:

1. Score must be between 0 and 10.
2. Give higher score when answer is correct,
   relevant and clearly explained.
3. Feedback should explain what was good or bad.
4. missingPoints should contain important concepts
   missing from the answer.
5. improvements should contain practical suggestions.
`;

    const aiResponse =
      await askOllama(prompt);

    let evaluation;

    try {
      evaluation =
        parseAIJson(aiResponse);
    } catch (error) {

      console.error(
        "Evaluation JSON Error:",
        aiResponse
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned invalid evaluation. Please try again.",
      });
    }

    const score = Math.min(
      10,
      Math.max(
        0,
        Number(
          evaluation.score
        ) || 0
      )
    );

    const missingPoints =
      Array.isArray(
        evaluation.missingPoints
      )
        ? evaluation.missingPoints
        : [];

    const improvements =
      Array.isArray(
        evaluation.improvements
      )
        ? evaluation.improvements
        : [];

    interview.answers.push({
      question,

      answer,

      score,

      feedback:
        evaluation.feedback ||
        "",

      missingPoints,

      improvements,
    });

    interview.totalScore =
      interview.answers.reduce(
        (total, item) =>
          total +
          Number(item.score || 0),
        0
      );

    const nextIndex =
      interview.answers.length;

    const completed =
      nextIndex >=
      interview.questions.length;

    if (completed) {

      interview.status =
        "completed";

    } else {

      interview.currentQuestion =
        nextIndex + 1;
    }

    await interview.save();

    return res.status(200).json({

      success: true,

      completed,

      evaluation: {
        score,

        feedback:
          evaluation.feedback ||
          "",

        missingPoints,

        improvements,
      },

      nextQuestion:
        completed
          ? null
          : interview.questions[
              nextIndex
            ],

      questionNumber:
        completed
          ? interview.questions.length
          : nextIndex + 1,

      totalQuestions:
        interview.questions.length,

      totalScore:
        interview.totalScore,

      finalScore:
        completed
          ? Number(
              (
                interview.totalScore /
                interview.questions.length
              ).toFixed(1)
            )
          : null,
    });

  } catch (error) {

    console.error(
      "Submit Answer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to evaluate answer.",
    });
  }
};


/*
=========================================================
INTERVIEW HISTORY
=========================================================
*/

const getInterviewHistory = async (
  req,
  res
) => {
  try {

    const interviews =
      await MockInterview.find({
        user: req.user.id,
      })
        .select(
          "-answers.answer"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      interviews,
    });

  } catch (error) {

    console.error(
      "Interview History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interview history.",
    });
  }
};


module.exports = {
  startInterview,
  submitAnswer,
  getInterviewHistory,
};