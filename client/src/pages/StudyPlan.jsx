import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StudyPlan = () => {
  const navigate = useNavigate();

  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingWeek, setUpdatingWeek] = useState(null);
  const [error, setError] = useState("");
  const [expandedWeek, setExpandedWeek] = useState(1);

  /*
   * Backend kabhi studyPlan bhej sakta hai
   * aur kabhi plan.
   * Dono ko support karenge.
   */
  const getPlanFromResponse = (data) => {
    return data?.studyPlan || data?.plan || null;
  };

  const loadStudyPlan = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/study-plan");

      const plan = getPlanFromResponse(response.data);

      setStudyPlan(plan);
    } catch (err) {
      console.error("Study Plan Load Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load study plan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudyPlan();
  }, []);

  const generatePlan = async () => {
    try {
      setGenerating(true);
      setError("");

      const response = await api.post(
        "/study-plan/generate"
      );

      const plan = getPlanFromResponse(response.data);

      if (!plan) {
        throw new Error(
          "Study plan was not returned by server"
        );
      }

      setStudyPlan(plan);
      setExpandedWeek(1);
    } catch (err) {
      console.error(
        "Study Plan Generate Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to generate study plan"
      );
    } finally {
      setGenerating(false);
    }
  };

  const toggleWeek = async (weekNumber) => {
    try {
      setUpdatingWeek(weekNumber);
      setError("");

      const response = await api.put(
        `/study-plan/week/${weekNumber}`
      );

      const updatedPlan = getPlanFromResponse(
        response.data
      );

      if (!updatedPlan) {
        throw new Error(
          "Updated study plan was not returned by server"
        );
      }

      /*
       * Backend se latest complete/incomplete
       * status directly state me set hoga.
       */
      setStudyPlan(updatedPlan);
    } catch (err) {
      console.error(
        "Complete Week Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update week"
      );
    } finally {
      setUpdatingWeek(null);
    }
  };

  const progress = useMemo(() => {
    if (!studyPlan?.totalWeeks) {
      return 0;
    }

    return Math.round(
      ((studyPlan.completedWeeks || 0) /
        studyPlan.totalWeeks) *
        100
    );
  }, [studyPlan]);

  const styles = {
    page: {
      minHeight: "calc(100vh - 70px)",
      padding: "35px 20px 60px",
      background: "#f7f8fc",
    },

    container: {
      maxWidth: "1150px",
      margin: "0 auto",
    },

    backButton: {
      border: "none",
      background: "transparent",
      color: "#4f46e5",
      fontWeight: 700,
      cursor: "pointer",
      padding: "8px 0",
      marginBottom: "20px",
      fontSize: "14px",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "20px",
      marginBottom: "25px",
      flexWrap: "wrap",
    },

    kicker: {
      display: "inline-block",
      fontSize: "12px",
      fontWeight: 800,
      color: "#4f46e5",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginBottom: "7px",
    },

    title: {
      margin: 0,
      fontSize: "32px",
      color: "#111827",
    },

    subtitle: {
      margin: "8px 0 0",
      color: "#6b7280",
      lineHeight: 1.6,
      maxWidth: "700px",
    },

    primaryButton: {
      border: "none",
      background: "#4f46e5",
      color: "#ffffff",
      padding: "13px 20px",
      borderRadius: "10px",
      fontWeight: 800,
      cursor: "pointer",
      fontSize: "14px",
    },

    hero: {
      background:
        "linear-gradient(135deg, #ffffff 0%, #f3f4ff 100%)",
      border: "1px solid #e5e7eb",
      borderRadius: "18px",
      padding: "25px",
      marginBottom: "25px",
      boxShadow:
        "0 8px 25px rgba(15,23,42,0.05)",
    },

    heroTop: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },

    planTitle: {
      margin: "0 0 7px",
      color: "#111827",
      fontSize: "22px",
    },

    planSummary: {
      margin: 0,
      color: "#6b7280",
      lineHeight: 1.6,
      maxWidth: "750px",
    },

    stats: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "22px",
    },

    stat: {
      minWidth: "145px",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "13px 15px",
    },

    statLabel: {
      display: "block",
      color: "#6b7280",
      fontSize: "11px",
      fontWeight: 700,
      marginBottom: "5px",
    },

    statValue: {
      display: "block",
      color: "#111827",
      fontSize: "18px",
      fontWeight: 800,
    },

    progressOuter: {
      width: "100%",
      height: "9px",
      background: "#e5e7eb",
      borderRadius: "20px",
      overflow: "hidden",
      marginTop: "18px",
    },

    progressInner: {
      height: "100%",
      background: "#4f46e5",
      borderRadius: "20px",
      transition: "width 0.3s ease",
    },

    weekCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      marginBottom: "14px",
      overflow: "hidden",
      boxShadow:
        "0 5px 18px rgba(15,23,42,0.04)",
    },

    weekHeader: {
      width: "100%",
      border: "none",
      background: "#ffffff",
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      cursor: "pointer",
      textAlign: "left",
    },

    weekLeft: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      minWidth: 0,
    },

    weekNumber: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "#eef2ff",
      color: "#4338ca",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 900,
      fontSize: "13px",
      flexShrink: 0,
    },

    weekTitle: {
      margin: 0,
      color: "#111827",
      fontSize: "17px",
    },

    weekFocus: {
      margin: "5px 0 0",
      color: "#6b7280",
      fontSize: "13px",
    },

    completeBadge: {
      background: "#dcfce7",
      color: "#15803d",
      padding: "6px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 800,
      whiteSpace: "nowrap",
    },

    pendingBadge: {
      background: "#f3f4f6",
      color: "#6b7280",
      padding: "6px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 800,
      whiteSpace: "nowrap",
    },

    weekBody: {
      borderTop: "1px solid #eef0f4",
      padding: "20px",
      background: "#fafbff",
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(2, minmax(0, 1fr))",
      gap: "18px",
    },

    section: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "16px",
    },

    sectionTitle: {
      margin: "0 0 10px",
      fontSize: "13px",
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },

    list: {
      margin: 0,
      paddingLeft: "18px",
      color: "#4b5563",
      lineHeight: 1.7,
      fontSize: "13px",
    },

    bottomActions: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "18px",
    },

    completeButton: {
      border: "none",
      background: "#4f46e5",
      color: "#ffffff",
      padding: "11px 16px",
      borderRadius: "9px",
      fontWeight: 800,
      cursor: "pointer",
    },

    completedButton: {
      border: "1px solid #bbf7d0",
      background: "#f0fdf4",
      color: "#15803d",
      padding: "11px 16px",
      borderRadius: "9px",
      fontWeight: 800,
      cursor: "pointer",
    },

    empty: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "18px",
      padding: "55px 25px",
      textAlign: "center",
      boxShadow:
        "0 8px 25px rgba(15,23,42,0.05)",
    },

    error: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      color: "#b91c1c",
      padding: "12px 15px",
      borderRadius: "10px",
      marginBottom: "18px",
      fontSize: "13px",
      fontWeight: 600,
    },
  };

  if (loading) {
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            border: "1px solid #e5e7eb",
          }}
        >
          Loading study plan...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <button
          style={styles.backButton}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <div style={styles.header}>
          <div>
            <span style={styles.kicker}>
              AI Placement Preparation
            </span>

            <h1 style={styles.title}>
              Personalized Study Plan
            </h1>

            <p style={styles.subtitle}>
              Get a personalized 12-week
              preparation roadmap based on
              your profile, skills and DSA
              progress.
            </p>
          </div>

          <button
            style={{
              ...styles.primaryButton,
              opacity: generating ? 0.7 : 1,
            }}
            onClick={generatePlan}
            disabled={generating}
          >
            {generating
              ? "Generating..."
              : studyPlan
              ? "🔄 Regenerate Plan"
              : "✨ Generate Study Plan"}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!studyPlan ? (
          <div style={styles.empty}>
            <div
              style={{
                fontSize: "50px",
                marginBottom: "15px",
              }}
            >
              🗺️
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                color: "#111827",
              }}
            >
              No Study Plan Yet
            </h2>

            <p
              style={{
                color: "#6b7280",
                maxWidth: "550px",
                margin: "0 auto 20px",
                lineHeight: 1.6,
              }}
            >
              Generate your AI-powered
              personalized placement roadmap
              and start preparing week by week.
            </p>

            <button
              style={styles.primaryButton}
              onClick={generatePlan}
              disabled={generating}
            >
              {generating
                ? "Generating..."
                : "Generate My Plan →"}
            </button>
          </div>
        ) : (
          <>
            <div style={styles.hero}>
              <div style={styles.heroTop}>
                <div>
                  <h2 style={styles.planTitle}>
                    {studyPlan.planTitle}
                  </h2>

                  <p style={styles.planSummary}>
                    {studyPlan.summary}
                  </p>
                </div>
              </div>

              <div style={styles.stats}>

                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    TARGET ROLE
                  </span>

                  <span style={styles.statValue}>
                    {studyPlan.targetRole}
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    LEVEL
                  </span>

                  <span style={styles.statValue}>
                    {studyPlan.currentLevel}
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    COMPLETED
                  </span>

                  <span style={styles.statValue}>
                    {studyPlan.completedWeeks || 0}
                    {" / "}
                    {studyPlan.totalWeeks || 12}
                    {" "}Weeks
                  </span>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    PROGRESS
                  </span>

                  <span style={styles.statValue}>
                    {progress}%
                  </span>
                </div>

              </div>

              <div style={styles.progressOuter}>
                <div
                  style={{
                    ...styles.progressInner,
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div>
              {studyPlan.weeks?.map((week) => {
                const expanded =
                  expandedWeek ===
                  week.weekNumber;

                const isUpdating =
                  updatingWeek ===
                  week.weekNumber;

                return (
                  <div
                    key={week.weekNumber}
                    style={styles.weekCard}
                  >

                    <button
                      style={styles.weekHeader}
                      onClick={() =>
                        setExpandedWeek(
                          expanded
                            ? null
                            : week.weekNumber
                        )
                      }
                    >
                      <div style={styles.weekLeft}>

                        <div
                          style={
                            styles.weekNumber
                          }
                        >
                          W
                          {String(
                            week.weekNumber
                          ).padStart(2, "0")}
                        </div>

                        <div>
                          <h3
                            style={
                              styles.weekTitle
                            }
                          >
                            {week.title}
                          </h3>

                          <p
                            style={
                              styles.weekFocus
                            }
                          >
                            {week.focus}
                          </p>
                        </div>

                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={
                            week.completed
                              ? styles.completeBadge
                              : styles.pendingBadge
                          }
                        >
                          {week.completed
                            ? "✓ Completed"
                            : "Pending"}
                        </span>

                        <span
                          style={{
                            fontSize: "18px",
                            color: "#6b7280",
                          }}
                        >
                          {expanded ? "−" : "+"}
                        </span>
                      </div>
                    </button>

                    {expanded && (
                      <div style={styles.weekBody}>

                        <div style={styles.grid}>

                          <div style={styles.section}>
                            <h4
                              style={
                                styles.sectionTitle
                              }
                            >
                              🎯 Goals
                            </h4>

                            <ul
                              style={styles.list}
                            >
                              {week.goals?.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          <div style={styles.section}>
                            <h4
                              style={
                                styles.sectionTitle
                              }
                            >
                              📚 Topics
                            </h4>

                            <ul
                              style={styles.list}
                            >
                              {week.topics?.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          <div style={styles.section}>
                            <h4
                              style={
                                styles.sectionTitle
                              }
                            >
                              ✅ Tasks
                            </h4>

                            <ul
                              style={styles.list}
                            >
                              {week.tasks?.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          <div style={styles.section}>
                            <h4
                              style={
                                styles.sectionTitle
                              }
                            >
                              💻 Practice
                            </h4>

                            <ul
                              style={styles.list}
                            >
                              {week.practice?.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          <div style={styles.section}>
                            <h4
                              style={
                                styles.sectionTitle
                              }
                            >
                              🔗 Resources
                            </h4>

                            <ul
                              style={styles.list}
                            >
                              {week.resources?.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>

                          <div style={styles.section}>
                            <h4
                              style={
                                styles.sectionTitle
                              }
                            >
                              ⏱️ Estimated Time
                            </h4>

                            <p
                              style={{
                                margin: 0,
                                color: "#4b5563",
                                fontSize: "14px",
                              }}
                            >
                              Approximately{" "}
                              <strong>
                                {week.estimatedHours}
                                {" "}hours
                              </strong>{" "}
                              this week.
                            </p>
                          </div>

                        </div>

                        <div
                          style={
                            styles.bottomActions
                          }
                        >
                          <button
                            disabled={isUpdating}
                            style={{
                              ...(week.completed
                                ? styles.completedButton
                                : styles.completeButton),
                              opacity: isUpdating
                                ? 0.6
                                : 1,
                              cursor: isUpdating
                                ? "not-allowed"
                                : "pointer",
                            }}
                            onClick={() =>
                              toggleWeek(
                                week.weekNumber
                              )
                            }
                          >
                            {isUpdating
                              ? "Updating..."
                              : week.completed
                              ? "↩ Mark Incomplete"
                              : "✓ Mark Week Complete"}
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default StudyPlan;