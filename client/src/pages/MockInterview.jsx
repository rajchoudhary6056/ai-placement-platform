import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const MockInterview = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("setup");

  const [jobRole, setJobRole] = useState(
    "MERN Developer"
  );

  const [interviewType, setInterviewType] =
    useState("Technical");

  const [interview, setInterview] =
    useState(null);

  const [answer, setAnswer] =
    useState("");

  const [evaluation, setEvaluation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [totalQuestions, setTotalQuestions] =
    useState(5);

  const [finalScore, setFinalScore] =
    useState(null);

  /*
  ========================================================
  START INTERVIEW
  ========================================================
  */

  const startInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.post(
          "/interview/start",
          {
            jobRole,
            interviewType,
          }
        );

      const data =
        response.data;

      setInterview(data.interview);

      setQuestionNumber(
        data.interview.currentQuestion
      );

      setTotalQuestions(
        data.interview.totalQuestions
      );

      setEvaluation(null);
      setAnswer("");

      setStep("question");

    } catch (error) {
      console.error(
        "Start Interview Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to start interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  SUBMIT ANSWER
  ========================================================
  */

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError(
        "Please write your answer before submitting."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await api.post(
          "/interview/answer",
          {
            interviewId:
              interview.id,

            answer:
              answer.trim(),
          }
        );

      const data =
        response.data;

      setEvaluation(
        data.evaluation
      );

      setAnswer("");

      if (data.completed) {
        setFinalScore(
          data.finalScore
        );

        setStep("completed");

      } else {

        setQuestionNumber(
          data.questionNumber
        );

        setInterview((prev) => ({
          ...prev,

          currentQuestion:
            data.questionNumber,

          question:
            data.nextQuestion,
        }));

        setStep("evaluation");
      }

    } catch (error) {
      console.error(
        "Submit Answer Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to evaluate answer."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  NEXT QUESTION
  ========================================================
  */

  const nextQuestion = () => {
    setEvaluation(null);
    setAnswer("");
    setStep("question");
  };

  /*
  ========================================================
  RESET
  ========================================================
  */

  const startNewInterview = () => {
    setStep("setup");

    setInterview(null);

    setEvaluation(null);

    setAnswer("");

    setError("");

    setFinalScore(null);

    setQuestionNumber(1);
  };

  /*
  ========================================================
  SCORE CLASS
  ========================================================
  */

  const getScoreClass = (score) => {
    if (score >= 8) {
      return "score-good";
    }

    if (score >= 5) {
      return "score-medium";
    }

    return "score-low";
  };

  /*
  ========================================================
  SETUP SCREEN
  ========================================================
  */

  if (step === "setup") {
    return (
      <div className="mock-interview-page">
        <div className="mock-interview-container">

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <div className="mock-interview-header">
            <div>
              <p className="page-kicker">
                AI CAREER TOOL
              </p>

              <h1>
                AI Mock Interview
              </h1>

              <p>
                Practice real interview questions
                and get instant AI feedback.
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="interview-setup-card">

            <div className="setup-icon">
              🤖
            </div>

            <h2>
              Prepare for Your Interview
            </h2>

            <p className="setup-description">
              Select your target job role and
              interview type. Our AI interviewer
              will generate personalized questions.
            </p>

            <div className="interview-form">

              <div className="form-group">
                <label>
                  Job Role
                </label>

                <select
                  value={jobRole}
                  onChange={(e) =>
                    setJobRole(
                      e.target.value
                    )
                  }
                >
                  <option>
                    MERN Developer
                  </option>

                  <option>
                    Frontend Developer
                  </option>

                  <option>
                    Backend Developer
                  </option>

                  <option>
                    Java Developer
                  </option>

                  <option>
                    Full Stack Developer
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Interview Type
                </label>

                <div className="interview-type-options">

                  <button
                    type="button"
                    className={
                      interviewType ===
                      "Technical"
                        ? "type-option active"
                        : "type-option"
                    }
                    onClick={() =>
                      setInterviewType(
                        "Technical"
                      )
                    }
                  >
                    <span>
                      💻
                    </span>

                    <div>
                      <strong>
                        Technical
                      </strong>

                      <small>
                        Technical skills,
                        coding & concepts
                      </small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={
                      interviewType === "HR"
                        ? "type-option active"
                        : "type-option"
                    }
                    onClick={() =>
                      setInterviewType(
                        "HR"
                      )
                    }
                  >
                    <span>
                      👤
                    </span>

                    <div>
                      <strong>
                        HR / Behavioral
                      </strong>

                      <small>
                        Communication &
                        behavioral questions
                      </small>
                    </div>
                  </button>

                </div>
              </div>

              <div className="interview-info">

                <div>
                  <span>📝</span>
                  <p>
                    5 AI-generated questions
                  </p>
                </div>

                <div>
                  <span>⭐</span>
                  <p>
                    Score out of 10
                  </p>
                </div>

                <div>
                  <span>💡</span>
                  <p>
                    Personalized feedback
                  </p>
                </div>

              </div>

              <button
                className="start-interview-button"
                onClick={startInterview}
                disabled={loading}
              >
                {loading
                  ? "Generating Interview..."
                  : "Start AI Interview →"}
              </button>

            </div>
          </div>

        </div>
      </div>
    );
  }

  /*
  ========================================================
  QUESTION SCREEN
  ========================================================
  */

  if (
    step === "question" ||
    step === "evaluation"
  ) {
    return (
      <div className="mock-interview-page">
        <div className="mock-interview-container">

          <div className="interview-topbar">

            <button
              className="back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

            <div className="question-progress">
              Question{" "}
              {questionNumber} of{" "}
              {totalQuestions}
            </div>

          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  (questionNumber /
                    totalQuestions) *
                  100
                }%`,
              }}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="interview-question-card">

            <div className="question-card-header">

              <div>
                <span className="question-badge">
                  {interviewType}
                </span>

                <h2>
                  Question{" "}
                  {questionNumber}
                </h2>
              </div>

              <span className="question-number">
                {questionNumber}/
                {totalQuestions}
              </span>

            </div>

            <div className="question-box">

              <div className="ai-avatar">
                AI
              </div>

              <p>
                {interview?.question}
              </p>

            </div>

            {step === "question" && (
              <>
                <label className="answer-label">
                  Your Answer
                </label>

                <textarea
                  className="interview-answer"
                  value={answer}
                  onChange={(e) =>
                    setAnswer(
                      e.target.value
                    )
                  }
                  placeholder="Type your answer here..."
                  rows="8"
                />

                <div className="answer-footer">

                  <span>
                    {answer.length} characters
                  </span>

                  <button
                    className="submit-answer-button"
                    onClick={submitAnswer}
                    disabled={loading}
                  >
                    {loading
                      ? "AI Evaluating..."
                      : "Submit Answer →"}
                  </button>

                </div>
              </>
            )}

            {step === "evaluation" &&
              evaluation && (
                <div className="evaluation-section">

                  <div className="evaluation-score">

                    <div
                      className={`evaluation-score-circle ${getScoreClass(
                        evaluation.score
                      )}`}
                    >
                      {evaluation.score}
                      <small>
                        /10
                      </small>
                    </div>

                    <div>
                      <h3>
                        AI Evaluation
                      </h3>

                      <p>
                        {evaluation.feedback}
                      </p>
                    </div>

                  </div>

                  {evaluation.missingPoints
                    ?.length > 0 && (
                    <div className="feedback-card">
                      <h4>
                        Missing Points
                      </h4>

                      <ul>
                        {evaluation.missingPoints.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {evaluation.improvements
                    ?.length > 0 && (
                    <div className="feedback-card">
                      <h4>
                        How to Improve
                      </h4>

                      <ul>
                        {evaluation.improvements.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <button
                    className="next-question-button"
                    onClick={nextQuestion}
                  >
                    Next Question →
                  </button>

                </div>
              )}

          </div>

        </div>
      </div>
    );
  }

  /*
  ========================================================
  COMPLETED SCREEN
  ========================================================
  */

  return (
    <div className="mock-interview-page">
      <div className="mock-interview-container">

        <div className="interview-completed-card">

          <div className="completed-icon">
            🎉
          </div>

          <h1>
            Interview Completed!
          </h1>

          <p>
            Great job! Here is your final
            interview performance.
          </p>

          <div className="final-score">

            <span>
              Final Score
            </span>

            <strong>
              {finalScore}
              <small>/10</small>
            </strong>

          </div>

          <div className="final-message">

            {finalScore >= 8 ? (
              <p>
                Excellent performance! You
                are well prepared for this
                interview.
              </p>
            ) : finalScore >= 5 ? (
              <p>
                Good attempt! Keep practicing
                to improve your interview skills.
              </p>
            ) : (
              <p>
                Keep practicing. Focus on the
                feedback and improve your concepts.
              </p>
            )}

          </div>

          <div className="completed-actions">

            <button
              className="start-interview-button"
              onClick={startNewInterview}
            >
              Start New Interview
            </button>

            <button
              className="secondary-action-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default MockInterview;