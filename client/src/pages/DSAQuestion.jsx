import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "../styles/dsa.css";

const DSAQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [code, setCode] = useState(`import java.util.*;

class Solution {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        int[] arr = new int[n];

        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        int max = arr[0];

        for (int i = 1; i < n; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }

        System.out.println(max);

        sc.close();
    }
}`);

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadQuestion();
  }, [id]);

  // =====================================================
  // LOAD QUESTION
  // =====================================================

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError("");
      setRunResult(null);
      setEvaluation(null);

      const response = await api.get(
        `/dsa/questions/${id}`
      );

      setQuestion(response.data.question);

      if (response.data.submission) {
        setSubmission(response.data.submission);

        if (response.data.submission.code) {
          setCode(response.data.submission.code);
        }
      } else {
        setSubmission(null);
      }
    } catch (err) {
      console.error(
        "Load Question Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load question."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RUN CODE
  // =====================================================

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError("Please write Java code first.");
      return;
    }

    if (!id) {
      setError("Question ID is missing.");
      return;
    }

    try {
      setRunning(true);
      setError("");
      setRunResult(null);
      setEvaluation(null);

      // IMPORTANT:
      // Do NOT use Number(id)
      // MongoDB _id must be sent as string.

      const response = await api.post(
        "/dsa/run",
        {
          questionId: id,
          code,
          language: "Java",
        }
      );

      setRunResult({
        success: response.data.allPassed,
        testResults: response.data.results || [],
        totalTests: response.data.total || 0,
        passedCount: response.data.passed || 0,
        compileError: "",
      });
    } catch (err) {
      console.error(
        "Run Code Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to run code"
      );
    } finally {
      setRunning(false);
    }
  };

  // =====================================================
  // SUBMIT SOLUTION
  // =====================================================

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please write Java code first.");
      return;
    }

    if (!id) {
      setError("Question ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setRunResult(null);
      setEvaluation(null);

      // IMPORTANT:
      // Send MongoDB _id directly.

      const response = await api.post(
        "/dsa/submit",
        {
          questionId: id,
          code,
          language: "Java",
        }
      );

      setRunResult({
        success: response.data.solved,
        testResults:
          response.data.testResults || [],
        totalTests:
          response.data.testResults?.length || 0,
        passedCount:
          response.data.testResults?.filter(
            (item) => item.passed
          ).length || 0,
        compileError: "",
      });

      setEvaluation({
        ...response.data.evaluation,
        score: response.data.score,
        status: response.data.solved
          ? "solved"
          : "attempted",
      });

      if (response.data.solved) {
        setSubmission({
          code,
          status: "solved",
          score: response.data.score,
        });
      }
    } catch (err) {
      console.error(
        "Submit Solution Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to submit solution"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // CLEAR OUTPUT
  // =====================================================

  const clearOutput = () => {
    setRunResult(null);
    setEvaluation(null);
    setError("");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  // =====================================================
  // QUESTION NOT FOUND
  // =====================================================

  if (!question) {
    return (
      <div className="dsa-error-page">
        <div className="dsa-error-card">
          <div className="dsa-error-icon">
            ⚠️
          </div>

          <h2>Question Not Found</h2>

          <p>
            {error ||
              "Unable to load this DSA question."}
          </p>

          <button
            className="dsa-back-button"
            onClick={() =>
              navigate("/dsa-practice")
            }
          >
            ← Back to DSA Practice
          </button>
        </div>
      </div>
    );
  }

  const difficultyClass =
    question.difficulty
      ?.toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <div className="dsa-question-page">
      <div className="dsa-question-container">

        {/* TOP */}

        <div className="dsa-question-top">
          <button
            className="dsa-back-button"
            onClick={() =>
              navigate("/dsa-practice")
            }
          >
            ← Back to DSA Practice
          </button>

          {submission?.status ===
            "solved" && (
            <div className="dsa-solved-badge">
              ✓ Solved
            </div>
          )}
        </div>

        {/* QUESTION HEADER */}

        <div className="dsa-question-header-card">
          <div className="dsa-question-heading">
            <div>

              <div className="dsa-question-badges">

                <span
                  className={`dsa-difficulty ${difficultyClass}`}
                >
                  {question.difficulty}
                </span>

                <span className="dsa-topic-badge">
                  {question.topic}
                </span>

              </div>

              {/* IMPORTANT:
                  MongoDB ID is NOT displayed.
              */}

              <h1>
                {question.title}
              </h1>

            </div>
          </div>

          <p className="dsa-question-description">
            {question.description}
          </p>
        </div>

        {/* INPUT / OUTPUT */}

        <div className="dsa-info-grid">

          <div className="dsa-info-card">
            <h3>Input</h3>

            <pre>
              {question.input}
            </pre>
          </div>

          <div className="dsa-info-card">
            <h3>Output</h3>

            <pre>
              {question.output}
            </pre>
          </div>

        </div>

        {/* EXPLANATION */}

        <div className="dsa-explanation-card">
          <h3>💡 Explanation</h3>

          <p>
            {question.explanation}
          </p>
        </div>

        {/* CONSTRAINTS */}

        <div className="dsa-constraints-card">
          <h3>Constraints</h3>

          <p>
            {question.constraints}
          </p>
        </div>

        {/* CODE EDITOR */}

        <div className="dsa-editor-card">

          <div className="dsa-editor-header">

            <div>
              <h2>💻 Java Code</h2>

              <span className="dsa-language-badge">
                Java
              </span>
            </div>

            <button
              className="dsa-clear-output-button"
              onClick={clearOutput}
            >
              Clear Output
            </button>

          </div>

          <textarea
            className="dsa-code-editor"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            spellCheck="false"
          />

          <div className="dsa-editor-footer">

            <div className="dsa-editor-tip">
              💡 Make sure your class name is{" "}
              <strong>Solution</strong>.
            </div>

            <div className="dsa-action-buttons">

              <button
                className="dsa-run-button"
                onClick={handleRunCode}
                disabled={
                  running ||
                  submitting
                }
              >
                {running
                  ? "⏳ Running..."
                  : "▶ Run Code"}
              </button>

              <button
                className="dsa-submit-button"
                onClick={handleSubmit}
                disabled={
                  running ||
                  submitting
                }
              >
                {submitting
                  ? "⏳ Evaluating..."
                  : "🚀 Submit Solution"}
              </button>

            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="dsa-error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* TEST RESULT */}

        {runResult && (
          <div className="dsa-test-result-card">

            <div className="dsa-result-header">

              <div>
                <h2>Test Cases</h2>

                <span
                  className={
                    runResult.success
                      ? "dsa-result-success"
                      : "dsa-result-failed"
                  }
                >
                  {runResult.success
                    ? "✓ All Test Cases Passed"
                    : "✕ Some Test Cases Failed"}
                </span>
              </div>

              <div className="dsa-test-count">
                {runResult.passedCount}
                {" / "}
                {runResult.totalTests}
                {" Passed"}
              </div>

            </div>

            <div className="dsa-test-list">

              {runResult.testResults.map(
                (test) => (
                  <div
                    key={test.testCase}
                    className={`dsa-test-item ${
                      test.passed
                        ? "test-passed"
                        : "test-failed"
                    }`}
                  >

                    <div className="dsa-test-item-header">

                      <span>
                        Test Case{" "}
                        {test.testCase}
                      </span>

                      <strong>
                        {test.passed
                          ? "✓ Passed"
                          : "✕ Failed"}
                      </strong>

                    </div>

                    <div className="dsa-test-details">

                      <div>
                        <span>Input</span>

                        <pre>
                          {test.input}
                        </pre>
                      </div>

                      <div>
                        <span>Expected</span>

                        <pre>
                          {test.expected}
                        </pre>
                      </div>

                      <div>
                        <span>Actual</span>

                        <pre>
                          {test.actual ||
                            "(no output)"}
                        </pre>
                      </div>

                    </div>

                    {test.error && (
                      <div className="dsa-runtime-error">
                        {test.error}
                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          </div>
        )}

        {/* AI EVALUATION */}

        {evaluation && (
          <div className="dsa-evaluation-card">

            <div className="dsa-evaluation-header">

              <div>
                <span className="dsa-ai-label">
                  🤖 AI Evaluation
                </span>

                <h2>
                  Solution Analysis
                </h2>
              </div>

              <div
                className={`dsa-score-circle ${
                  evaluation.score >= 7
                    ? "score-good"
                    : evaluation.score >= 4
                    ? "score-medium"
                    : "score-low"
                }`}
              >
                <strong>
                  {evaluation.score}
                </strong>

                <span>/10</span>
              </div>

            </div>

            <div
              className={`dsa-verdict ${
                evaluation.verdict ===
                "Correct Solution"
                  ? "verdict-correct"
                  : "verdict-improvement"
              }`}
            >
              {evaluation.verdict ===
              "Correct Solution"
                ? "✓ Correct Solution"
                : "⚠ Needs Improvement"}
            </div>

            <div className="dsa-feedback-section">

              <h3>AI Feedback</h3>

              <p>
                {evaluation.feedback}
              </p>

            </div>

            <div className="dsa-complexity-grid">

              <div className="dsa-complexity-card">
                <span>
                  Time Complexity
                </span>

                <strong>
                  {evaluation.timeComplexity}
                </strong>
              </div>

              <div className="dsa-complexity-card">
                <span>
                  Space Complexity
                </span>

                <strong>
                  {evaluation.spaceComplexity}
                </strong>
              </div>

            </div>

            <div className="dsa-feedback-grid">

              <div className="dsa-feedback-list-card">

                <h3>✓ Strengths</h3>

                {evaluation.strengths?.length >
                0 ? (
                  <ul>
                    {evaluation.strengths.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    No specific strengths.
                  </p>
                )}

              </div>

              <div className="dsa-feedback-list-card">

                <h3>💡 Improvements</h3>

                {evaluation.improvements
                  ?.length > 0 ? (
                  <ul>
                    {evaluation.improvements.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    No major improvements.
                  </p>
                )}

              </div>

            </div>

            {evaluation.status ===
              "solved" && (
              <div className="dsa-solved-message">
                🎉 Congratulations! You solved
                this question.
              </div>
            )}

          </div>
        )}

        {/* BOTTOM NAVIGATION */}

        <div className="dsa-bottom-navigation">

          <button
            className="dsa-secondary-button"
            onClick={() =>
              navigate("/dsa-practice")
            }
          >
            ← All Questions
          </button>

          <button
            className="dsa-next-button"
            onClick={async () => {
              try {
                const response =
                  await api.get(
                    "/dsa/questions"
                  );

                const questions =
                  response.data.questions ||
                  [];

                const currentIndex =
                  questions.findIndex(
                    (item) =>
                      String(item.id) ===
                      String(id)
                  );

                if (
                  currentIndex !== -1 &&
                  currentIndex <
                    questions.length - 1
                ) {
                  const nextQuestion =
                    questions[
                      currentIndex + 1
                    ];

                  navigate(
                    `/dsa-practice/${nextQuestion.id}`
                  );
                } else {
                  navigate(
                    "/dsa-practice"
                  );
                }
              } catch (err) {
                console.error(err);

                navigate(
                  "/dsa-practice"
                );
              }
            }}
          >
            Next Question →
          </button>

        </div>

      </div>
    </div>
  );
};

export default DSAQuestion;