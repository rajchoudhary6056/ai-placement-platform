import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const CompanyPreparation = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] =
    useState([]);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("overview");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/companies");

      setCompanies(
        response.data.companies || []
      );
    } catch (error) {
      console.error(
        "Company loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (company) => {
    try {
      setDetailLoading(true);
      setError("");

      const response =
        await api.get(
          `/companies/${company._id}`
        );

      setSelectedCompany(
        response.data.company
      );

      setActiveTab("overview");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Company detail error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load company details."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const backToCompanies = () => {
    setSelectedCompany(null);
    setActiveTab("overview");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>

        <p
          style={{
            marginTop: "15px",
            color: "#64748b",
          }}
        >
          Loading company preparation...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight:
          "calc(100vh - 70px)",
        padding: "35px 20px 70px",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >

        {/* BACK TO DASHBOARD */}

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          style={{
            border: "none",
            background: "transparent",
            color: "#475569",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #0f172a, #312e81)",
            borderRadius: "24px",
            padding: "35px",
            color: "white",
            marginBottom: "25px",
            boxShadow:
              "0 15px 40px rgba(15,23,42,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            Placement Preparation
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "34px",
            }}
          >
            Company Preparation 🏢
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "720px",
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Prepare for top companies with
            company-specific technical,
            DSA and HR preparation.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              border:
                "1px solid #fecaca",
              padding: "14px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* =====================================================
            COMPANY LIST
        ====================================================== */}

        {!selectedCompany ? (
          <>
            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#0f172a",
                }}
              >
                Choose a Company
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                Select a company to start
                your preparation.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {companies.map((company) => (
                <div
                  key={company._id}
                  style={{
                    background: "white",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "20px",
                    padding: "24px",
                    boxShadow:
                      "0 7px 25px rgba(15,23,42,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        background:
                          "#eef2ff",
                        fontSize: "25px",
                      }}
                    >
                      🏢
                    </div>

                    <span
                      style={{
                        background:
                          company.difficulty ===
                          "Hard"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          company.difficulty ===
                          "Hard"
                            ? "#b91c1c"
                            : "#b45309",
                        padding:
                          "6px 10px",
                        borderRadius:
                          "999px",
                        fontSize: "11px",
                        fontWeight: "800",
                      }}
                    >
                      {company.difficulty}
                    </span>
                  </div>

                  <h2
                    style={{
                      margin:
                        "18px 0 7px",
                      fontSize: "22px",
                    }}
                  >
                    {company.name}
                  </h2>

                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: 1.6,
                      fontSize: "14px",
                      minHeight:
                        "90px",
                    }}
                  >
                    {company.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap:
                        "wrap",
                      gap: "6px",
                      margin:
                        "15px 0",
                    }}
                  >
                    {company.requiredSkills
                      ?.slice(0, 5)
                      .map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={`${skill}-${index}`}
                            style={{
                              background:
                                "#f1f5f9",
                              color:
                                "#475569",
                              padding:
                                "6px 9px",
                              borderRadius:
                                "7px",
                              fontSize:
                                "11px",
                              fontWeight:
                                "600",
                            }}
                          >
                            {skill}
                          </span>
                        )
                      )}
                  </div>

                  <button
                    onClick={() =>
                      selectCompany(
                        company
                      )
                    }
                    disabled={
                      detailLoading
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px",
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      color: "white",
                      fontWeight: "700",
                      cursor:
                        "pointer",
                    }}
                  >
                    {detailLoading
                      ? "Loading..."
                      : "Start Preparation →"}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (

          /* ===================================================
             COMPANY DETAILS
          ==================================================== */

          <div>
            <button
              onClick={
                backToCompanies
              }
              style={{
                border: "none",
                background:
                  "white",
                color: "#4338ca",
                border:
                  "1px solid #c7d2fe",
                padding:
                  "10px 15px",
                borderRadius:
                  "10px",
                fontWeight: "700",
                cursor: "pointer",
                marginBottom:
                  "20px",
              }}
            >
              ← All Companies
            </button>

            {/* COMPANY HEADER */}

            <div
              style={{
                background:
                  "white",
                borderRadius:
                  "20px",
                padding:
                  "28px",
                border:
                  "1px solid #e2e8f0",
                marginBottom:
                  "20px",
                boxShadow:
                  "0 7px 25px rgba(15,23,42,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  gap: "20px",
                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize:
                        "14px",
                      color:
                        "#6366f1",
                      fontWeight:
                        "800",
                      marginBottom:
                        "7px",
                    }}
                  >
                    COMPANY PREPARATION
                  </div>

                  <h1
                    style={{
                      margin:
                        "0 0 8px",
                      fontSize:
                        "32px",
                    }}
                  >
                    {
                      selectedCompany.name
                    }
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color:
                        "#64748b",
                      lineHeight:
                        1.6,
                    }}
                  >
                    {
                      selectedCompany.description
                    }
                  </p>
                </div>

                <div
                  style={{
                    background:
                      "#eef2ff",
                    color:
                      "#4338ca",
                    padding:
                      "12px 15px",
                    borderRadius:
                      "12px",
                    fontWeight:
                      "700",
                    whiteSpace:
                      "nowrap",
                  }}
                >
                  🎯{" "}
                  {
                    selectedCompany.hiringType
                  }
                </div>
              </div>

              {/* TABS */}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX:
                    "auto",
                  marginTop:
                    "25px",
                  paddingBottom:
                    "3px",
                }}
              >
                {[
                  ["overview", "📋 Overview"],
                  ["dsa", "💻 DSA"],
                  [
                    "technical",
                    "🧠 Technical",
                  ],
                  ["hr", "🎤 HR"],
                  [
                    "tips",
                    "🚀 Tips",
                  ],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() =>
                        setActiveTab(
                          value
                        )
                      }
                      style={{
                        border:
                          "none",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "9px",
                        background:
                          activeTab ===
                          value
                            ? "#4f46e5"
                            : "#f1f5f9",
                        color:
                          activeTab ===
                          value
                            ? "white"
                            : "#475569",
                        fontWeight:
                          "700",
                        cursor:
                          "pointer",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* TAB CONTENT */}

            {activeTab ===
              "overview" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background:
                      "white",
                    borderRadius:
                      "18px",
                    padding:
                      "23px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <h3>
                    📝 Selection Process
                  </h3>

                  <div
                    style={{
                      marginTop:
                        "15px",
                    }}
                  >
                    {selectedCompany.selectionProcess?.map(
                      (
                        step,
                        index
                      ) => (
                        <div
                          key={`${step}-${index}`}
                          style={{
                            display:
                              "flex",
                            gap:
                              "12px",
                            marginBottom:
                              "13px",
                          }}
                        >
                          <span
                            style={{
                              width:
                                "28px",
                              height:
                                "28px",
                              minWidth:
                                "28px",
                              borderRadius:
                                "50%",
                              background:
                                "#eef2ff",
                              color:
                                "#4338ca",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              fontWeight:
                                "800",
                              fontSize:
                                "12px",
                            }}
                          >
                            {index + 1}
                          </span>

                          <span
                            style={{
                              paddingTop:
                                "5px",
                              color:
                                "#475569",
                              fontSize:
                                "14px",
                            }}
                          >
                            {step}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "white",
                    borderRadius:
                      "18px",
                    padding:
                      "23px",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <h3>
                    🛠️ Required Skills
                  </h3>

                  <div
                    style={{
                      display:
                        "flex",
                      flexWrap:
                        "wrap",
                      gap:
                        "8px",
                      marginTop:
                        "17px",
                    }}
                  >
                    {selectedCompany.requiredSkills?.map(
                      (
                        skill,
                        index
                      ) => (
                        <span
                          key={`${skill}-${index}`}
                          style={{
                            background:
                              "#eef2ff",
                            color:
                              "#4338ca",
                            padding:
                              "8px 11px",
                            borderRadius:
                              "8px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "700",
                          }}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab ===
              "dsa" && (
              <div
                style={{
                  background:
                    "white",
                  borderRadius:
                    "18px",
                  padding:
                    "25px",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                <h2>
                  💻 Important DSA Topics
                </h2>

                <p
                  style={{
                    color:
                      "#64748b",
                  }}
                >
                  Focus on these topics
                  while preparing
                  for{" "}
                  {
                    selectedCompany.name
                  }.
                </p>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap:
                      "12px",
                    marginTop:
                      "20px",
                  }}
                >
                  {selectedCompany.dsaTopics?.map(
                    (
                      topic,
                      index
                    ) => (
                      <div
                        key={`${topic}-${index}`}
                        style={{
                          padding:
                            "15px",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "12px",
                          background:
                            "#f8fafc",
                          fontWeight:
                            "700",
                          color:
                            "#334155",
                        }}
                      >
                        {index +
                          1}
                        .{" "}
                        {topic}
                      </div>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/dsa-practice"
                    )
                  }
                  style={{
                    marginTop:
                      "22px",
                    border:
                      "none",
                    background:
                      "#4f46e5",
                    color:
                      "white",
                    padding:
                      "12px 18px",
                    borderRadius:
                      "10px",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  Practice DSA →
                </button>
              </div>
            )}

            {activeTab ===
              "technical" && (
              <QuestionList
                title="🧠 Technical Interview Questions"
                questions={
                  selectedCompany.technicalQuestions
                }
              />
            )}

            {activeTab ===
              "hr" && (
              <QuestionList
                title="🎤 HR Interview Questions"
                questions={
                  selectedCompany.hrQuestions
                }
              />
            )}

            {activeTab ===
              "tips" && (
              <div
                style={{
                  background:
                    "white",
                  borderRadius:
                    "18px",
                  padding:
                    "25px",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                <h2>
                  🚀 Preparation Tips
                </h2>

                <div
                  style={{
                    display:
                      "grid",
                    gap:
                      "12px",
                    marginTop:
                      "20px",
                  }}
                >
                  {selectedCompany.preparationTips?.map(
                    (
                      tip,
                      index
                    ) => (
                      <div
                        key={`${tip}-${index}`}
                        style={{
                          display:
                            "flex",
                          gap:
                            "12px",
                          padding:
                            "15px",
                          background:
                            "#f8fafc",
                          borderRadius:
                            "11px",
                        }}
                      >
                        <span>
                          ✅
                        </span>

                        <span
                          style={{
                            color:
                              "#475569",
                            lineHeight:
                              1.5,
                          }}
                        >
                          {tip}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionList = ({
  title,
  questions,
}) => {
  const [openIndex, setOpenIndex] =
    useState(null);

  return (
    <div
      style={{
        display: "grid",
        gap: "13px",
      }}
    >
      <div
        style={{
          background:
            "white",
          borderRadius:
            "18px",
          padding:
            "23px",
          border:
            "1px solid #e2e8f0",
        }}
      >
        <h2
          style={{
            margin:
              "0 0 7px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            color:
              "#64748b",
          }}
        >
          Click a question to view
          the preparation answer.
        </p>
      </div>

      {questions?.map(
        (item, index) => (
          <div
            key={`${item.question}-${index}`}
            style={{
              background:
                "white",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                "15px",
              overflow:
                "hidden",
            }}
          >
            <button
              onClick={() =>
                setOpenIndex(
                  openIndex ===
                    index
                    ? null
                    : index
                )
              }
              style={{
                width:
                  "100%",
                border:
                  "none",
                background:
                  "white",
                padding:
                  "18px",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap:
                  "15px",
                textAlign:
                  "left",
                cursor:
                  "pointer",
              }}
            >
              <span
                style={{
                  fontWeight:
                    "700",
                  color:
                    "#1e293b",
                  lineHeight:
                    1.5,
                }}
              >
                {index + 1}.{" "}
                {item.question}
              </span>

              <span
                style={{
                  color:
                    "#4f46e5",
                  fontSize:
                    "20px",
                  flexShrink:
                    0,
                }}
              >
                {openIndex ===
                index
                  ? "−"
                  : "+"}
              </span>
            </button>

            {openIndex ===
              index && (
              <div
                style={{
                  padding:
                    "0 18px 20px",
                  borderTop:
                    "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    marginTop:
                      "15px",
                    background:
                      "#eef2ff",
                    padding:
                      "15px",
                    borderRadius:
                      "11px",
                    color:
                      "#3730a3",
                    lineHeight:
                      1.6,
                    fontSize:
                      "14px",
                  }}
                >
                  <strong>
                    Answer / Guidance:
                  </strong>

                  <p
                    style={{
                      margin:
                        "7px 0 0",
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default CompanyPreparation;