const pdfParseModule = require("pdf-parse");

const ResumeAnalysis = require("../models/ResumeAnalysis");
const User = require("../models/User");

/*
=========================================================
OLLAMA CONFIGURATION
=========================================================
*/

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen2.5:1.5b";


/*
=========================================================
PDF TEXT EXTRACTION
Supports different pdf-parse versions
=========================================================
*/

const extractPdfText = async (buffer) => {
  // Older pdf-parse versions
  if (typeof pdfParseModule === "function") {
    const result = await pdfParseModule(buffer);

    return result.text || "";
  }

  // Default export
  if (
    pdfParseModule.default &&
    typeof pdfParseModule.default === "function"
  ) {
    const result =
      await pdfParseModule.default(buffer);

    return result.text || "";
  }

  // Newer pdf-parse versions
  if (pdfParseModule.PDFParse) {
    const parser =
      new pdfParseModule.PDFParse({
        data: buffer,
      });

    const result =
      await parser.getText();

    if (
      typeof parser.destroy ===
      "function"
    ) {
      await parser.destroy();
    }

    return result.text || "";
  }

  throw new Error(
    "Unable to initialize PDF parser."
  );
};


/*
=========================================================
CALL OLLAMA AI
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
          temperature: 0.2,
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
ANALYZE RESUME
=========================================================
*/

const analyzeResume = async (
  req,
  res
) => {
  try {

    /*
    -------------------------------------------------------
    1. CHECK FILE
    -------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a PDF resume.",
      });
    }


    /*
    -------------------------------------------------------
    2. GET USER
    -------------------------------------------------------
    */

    const user =
      await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }


    /*
    -------------------------------------------------------
    3. EXTRACT PDF TEXT
    -------------------------------------------------------
    */

    const extractedText =
      await extractPdfText(
        req.file.buffer
      );

    if (
      !extractedText ||
      !extractedText.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from this PDF. Please upload a text-based PDF resume.",
      });
    }


    /*
    -------------------------------------------------------
    4. LIMIT RESUME TEXT
    -------------------------------------------------------
    */

    const resumeText =
      extractedText
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 20000);


    /*
    -------------------------------------------------------
    5. USER PROFILE DATA
    -------------------------------------------------------
    */

    const targetRole =
      user.targetRole ||
      "Not specified";

    const skills =
      Array.isArray(user.skills)
        ? user.skills.join(", ")
        : "Not specified";

    const education =
      user.education || {};

    const educationText = `
College: ${
      education.college ||
      "Not specified"
    }

Degree: ${
      education.degree ||
      "Not specified"
    }

Branch: ${
      education.branch ||
      "Not specified"
    }

Graduation Year: ${
      education.graduationYear ||
      "Not specified"
    }

CGPA: ${
      education.cgpa ||
      "Not specified"
    }
`;


    /*
    -------------------------------------------------------
    6. AI PROMPT
    -------------------------------------------------------
    */

    const prompt = `
You are an expert technical recruiter
and placement mentor.

Analyze the student's resume carefully.

STUDENT TARGET ROLE:
${targetRole}

STUDENT SKILLS:
${skills}

STUDENT EDUCATION:
${educationText}

RESUME:
========================
${resumeText}
========================

Evaluate this resume for:
- ATS compatibility
- Technical skills
- Projects
- Education
- Experience
- Job readiness
- Resume quality
- Target role suitability

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "resumeScore": 0,
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "missingSkills": [],
  "recommendedSkills": [],
  "improvements": [],
  "experienceLevel": "",
  "jobRole": ""
}

IMPORTANT RULES:

1. resumeScore must be between 0 and 100.

2. atsScore must be between 0 and 100.

3. summary must briefly explain the overall quality of the resume.

4. strengths should contain 3 to 6 useful strengths.

5. missingSkills should contain important skills missing
   for the student's target role.

6. recommendedSkills should contain skills the student
   should learn to improve placement chances.

7. improvements should contain practical resume improvements.

8. experienceLevel should be one of:
   "Fresher"
   "Entry Level"
   "Intermediate"
   "Experienced"

9. jobRole should identify the most suitable job role.

10. Do NOT return markdown.

11. Do NOT return explanations outside JSON.

12. Return valid JSON only.
`;


    /*
    -------------------------------------------------------
    7. SEND TO OLLAMA
    -------------------------------------------------------
    */

    console.log(
      `Sending resume to Ollama model: ${OLLAMA_MODEL}`
    );

    const aiResponse =
      await askOllama(prompt);


    /*
    -------------------------------------------------------
    8. PARSE AI RESPONSE
    -------------------------------------------------------
    */

    let analysis;

    try {

      let cleanResponse =
        aiResponse.trim();

      // Remove markdown code fences if AI returns them
      cleanResponse =
        cleanResponse
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

      analysis =
        JSON.parse(cleanResponse);

    } catch (error) {

      console.error(
        "AI JSON Parse Error:",
        error
      );

      console.error(
        "AI Response:",
        aiResponse
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid analysis format. Please try again.",
      });
    }


    /*
    -------------------------------------------------------
    9. NORMALIZE SCORES
    -------------------------------------------------------
    */

    const resumeScore =
      Math.min(
        100,
        Math.max(
          0,
          Number(
            analysis.resumeScore
          ) || 0
        )
      );

    const atsScore =
      Math.min(
        100,
        Math.max(
          0,
          Number(
            analysis.atsScore
          ) || 0
        )
      );


    /*
    -------------------------------------------------------
    10. NORMALIZE ARRAYS
    -------------------------------------------------------
    */

    const strengths =
      Array.isArray(
        analysis.strengths
      )
        ? analysis.strengths
        : [];

    const missingSkills =
      Array.isArray(
        analysis.missingSkills
      )
        ? analysis.missingSkills
        : [];

    const recommendedSkills =
      Array.isArray(
        analysis.recommendedSkills
      )
        ? analysis.recommendedSkills
        : [];

    const improvements =
      Array.isArray(
        analysis.improvements
      )
        ? analysis.improvements
        : [];


    /*
    -------------------------------------------------------
    11. SAVE TO MONGODB
    -------------------------------------------------------
    */

    const savedAnalysis =
      await ResumeAnalysis.create({
        user: user._id,

        fileName:
          req.file.originalname,

        resumeScore,

        atsScore,

        summary:
          analysis.summary || "",

        strengths,

        missingSkills,

        recommendedSkills,

        improvements,

        experienceLevel:
          analysis.experienceLevel ||
          "",

        jobRole:
          analysis.jobRole ||
          "",

        extractedText:
          resumeText,
      });


    /*
    -------------------------------------------------------
    12. SEND RESULT TO FRONTEND
    -------------------------------------------------------
    */

    return res.status(200).json({

      success: true,

      message:
        "Resume analyzed successfully.",

      analysis: {

        id:
          savedAnalysis._id,

        fileName:
          savedAnalysis.fileName,

        resumeScore:
          savedAnalysis.resumeScore,

        atsScore:
          savedAnalysis.atsScore,

        summary:
          savedAnalysis.summary,

        strengths:
          savedAnalysis.strengths,

        missingSkills:
          savedAnalysis.missingSkills,

        recommendedSkills:
          savedAnalysis.recommendedSkills,

        improvements:
          savedAnalysis.improvements,

        experienceLevel:
          savedAnalysis.experienceLevel,

        jobRole:
          savedAnalysis.jobRole,

        createdAt:
          savedAnalysis.createdAt,
      },
    });

  } catch (error) {

    console.error(
      "Resume Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to analyze resume.",
    });
  }
};


/*
=========================================================
RESUME HISTORY
=========================================================
*/

const getResumeHistory = async (
  req,
  res
) => {

  try {

    const analyses =
      await ResumeAnalysis.find({
        user: req.user.id,
      })
        .select(
          "-extractedText"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({

      success: true,

      analyses,
    });

  } catch (error) {

    console.error(
      "Resume History Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch resume history.",
    });
  }
};


/*
=========================================================
EXPORTS
=========================================================
*/

module.exports = {
  analyzeResume,
  getResumeHistory,
};