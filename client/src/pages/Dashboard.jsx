import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

import api from "../services/api";



const Dashboard = () => {

  const { user } = useAuth();

  const navigate = useNavigate();



  const [profile, setProfile] = useState(null);

  const [interviews, setInterviews] = useState([]);

  const [resumeAnalyses, setResumeAnalyses] = useState([]);

  const [skillGap, setSkillGap] = useState(null);

  const [dsaProgress, setDsaProgress] = useState(null);

  const [studyPlan, setStudyPlan] = useState(null);



  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const results = await Promise.allSettled([

          api.get("/profile"),

          api.get("/interview/history"),

          api.get("/resume/history"),

          api.get("/skill-gap/latest"),

          api.get("/dsa/progress"),

          api.get("/study-plan"),

        ]);



        if (results[0].status === "fulfilled") {

          setProfile(

            results[0].value.data.user

          );

        }



        if (results[1].status === "fulfilled") {

          setInterviews(

            results[1].value.data.interviews || []

          );

        }



        if (results[2].status === "fulfilled") {

          setResumeAnalyses(

            results[2].value.data.analyses || []

          );

        }



        if (results[3].status === "fulfilled") {

          setSkillGap(

            results[3].value.data.analysis || null

          );

        }



        if (results[4].status === "fulfilled") {

          setDsaProgress(

            results[4].value.data.progress || null

          );

        }



        if (results[5].status === "fulfilled") {

          setStudyPlan(

            results[5].value.data.studyPlan || null

          );

        }

      } catch (error) {

        console.error(

          "Dashboard error:",

          error

        );

      } finally {

        setLoading(false);

      }

    };



    loadDashboard();

  }, []);



  if (loading) {

    return (

      <div className="loading-page">

        <div className="loader"></div>

      </div>

    );

  }



  const profileData = profile || user;



  const completedInterviews = interviews.filter(

    (item) => item.status === "completed"

  );



  const latestInterview =

    completedInterviews.length > 0

      ? completedInterviews[0]

      : null;



  const latestScore = latestInterview

    ? Math.round(

        latestInterview.totalScore || 0

      )

    : 0;



  const profileScore =

    profileData?.profileScore || 0;



  const dsaSolved =

    dsaProgress?.totalSolved || 0;



  const dsaTotal =

    dsaProgress?.totalQuestions || 10;



  const dsaPercentage =

    dsaProgress?.progressPercentage ??

    Math.round(

      (dsaSolved / dsaTotal) * 100

    );



  const studyPlanTotalWeeks =

    studyPlan?.totalWeeks || 12;



  const studyPlanCompletedWeeks =

    studyPlan?.completedWeeks || 0;



  const studyPlanPercentage =

    studyPlanTotalWeeks > 0

      ? Math.round(

          (studyPlanCompletedWeeks /

            studyPlanTotalWeeks) *

            100

        )

      : 0;



  return (

    <div className="dashboard-page">

      <div className="dashboard-container">



        {/* =========================
            HEADER
        ========================= */}



        <div className="dashboard-header">

          <div className="dashboard-kicker">

            AI Placement Platform

          </div>



          <h1>

            Welcome back,{" "}

            {profileData?.name || "Student"} 👋

          </h1>



          <p>

            Prepare smarter, improve your skills

            and get placement ready.

          </p>

        </div>



        {/* =========================
            PROFILE SCORE
        ========================= */}



        <div className="profile-score-card">

          <div className="score-content">

            <span className="score-label">

              Profile Completion

            </span>



            <h2>

              {profileScore}%

            </h2>



            <span>

              Complete your profile to improve

              your placement chances.

            </span>

          </div>



          <div className="score-circle">

            {profileScore}%

          </div>

        </div>



        {/* =========================
            STATS
        ========================= */}



        <div className="stats-grid">



          <div className="stat-card">

            <h3>

              {interviews.length}

            </h3>

            <p>

              Mock Interviews

            </p>

          </div>



          <div className="stat-card">

            <h3>

              {resumeAnalyses.length}

            </h3>

            <p>

              Resumes Analyzed

            </p>

          </div>



          <div className="stat-card">

            <h3>

              {skillGap

                ? `${skillGap.overallReadiness}%`

                : "--"}

            </h3>

            <p>

              Placement Readiness

            </p>

          </div>



          <div className="stat-card">

            <h3>

              {dsaSolved}

            </h3>

            <p>

              DSA Solved

            </p>

          </div>



        </div>



        {/* =========================
            AI TOOLS
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                AI Placement Tools

              </h2>



              <p>

                Use AI-powered tools to prepare

                for your placement.

              </p>

            </div>

          </div>



          <div className="ai-tools-grid">



            {/* RESUME */}



            <div className="ai-tool-card">



              <div className="tool-icon">

                📄

              </div>



              <h3>

                AI Resume Analyzer

              </h3>



              <p>

                Upload your resume and get an

                AI-based score, missing skills

                and improvement suggestions.

              </p>



              <button

                onClick={() =>

                  navigate(

                    "/resume-analyzer"

                  )

                }

              >

                Analyze Resume →

              </button>



            </div>



            {/* INTERVIEW */}



            <div className="ai-tool-card">



              <div className="tool-icon">

                🎤

              </div>



              <h3>

                AI Mock Interview

              </h3>



              <p>

                Practice Technical and HR

                interviews with AI-generated

                questions and instant feedback.

              </p>



              <button

                onClick={() =>

                  navigate(

                    "/mock-interview"

                  )

                }

              >

                Start Interview →

              </button>



            </div>



            {/* SKILL GAP */}



            <div className="ai-tool-card">



              <div className="tool-icon">

                🎯

              </div>



              <h3>

                Skill Gap Analysis

              </h3>



              <p>

                Find the skills you are missing

                for your target job role.

              </p>



              <button

                onClick={() =>

                  navigate(

                    "/skill-gap"

                  )

                }

              >

                Check Skill Gap →

              </button>



            </div>



          </div>

        </div>



        {/* =========================
            STUDY PLAN STATUS
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                📚 Personalized Study Plan

              </h2>



              <p>

                Track your AI-generated placement

                preparation roadmap.

              </p>

            </div>

          </div>



          <div className="dashboard-dsa-card">



            <div className="dashboard-dsa-left">



              <div className="dashboard-dsa-icon">

                📚

              </div>



              <div className="dashboard-dsa-info">



                <h3>

                  {studyPlan

                    ? studyPlan.planTitle ||

                      "Placement Study Plan"

                    : "Your 12-Week Study Plan"}

                </h3>



                <p>

                  {studyPlan

                    ? `${studyPlanCompletedWeeks} of ${studyPlanTotalWeeks} weeks completed`

                    : "Generate your personalized AI study plan"}

                </p>



                <div className="dashboard-dsa-progress">

                  <div

                    className="dashboard-dsa-progress-fill"

                    style={{

                      width: `${Math.min(

                        studyPlanPercentage,

                        100

                      )}%`,

                    }}

                  ></div>

                </div>



                <strong>

                  {studyPlanPercentage}% Complete

                </strong>



              </div>

            </div>



            <div className="dashboard-dsa-actions">



              <button

                onClick={() =>

                  navigate(

                    "/study-plan"

                  )

                }

              >

                {studyPlan

                  ? "Continue Study Plan →"

                  : "Create Study Plan →"}

              </button>



              <button

                className="secondary-action-button"

                onClick={() =>

                  navigate(

                    "/study-plan"

                  )

                }

              >

                View Plan

              </button>



            </div>



          </div>

        </div>



        {/* =========================
            DSA PRACTICE
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                🧠 DSA Practice

              </h2>



              <p>

                Improve your coding skills with

                placement-focused DSA questions.

              </p>

            </div>

          </div>



          <div className="dashboard-dsa-card">



            <div className="dashboard-dsa-left">



              <div className="dashboard-dsa-icon">

                🧠

              </div>



              <div className="dashboard-dsa-info">



                <h3>

                  DSA Progress

                </h3>



                <p>

                  {dsaSolved} of {dsaTotal} questions

                  solved

                </p>



                <div className="dashboard-dsa-progress">

                  <div

                    className="dashboard-dsa-progress-fill"

                    style={{

                      width: `${Math.min(

                        dsaPercentage,

                        100

                      )}%`,

                    }}

                  ></div>

                </div>



                <strong>

                  {dsaPercentage}% Complete

                </strong>



              </div>

            </div>



            <div className="dashboard-dsa-actions">



              <button

                onClick={() =>

                  navigate(

                    "/dsa-practice"

                  )

                }

              >

                Practice DSA →

              </button>



              <button

                className="secondary-action-button"

                onClick={() =>

                  navigate(

                    "/dsa-practice"

                  )

                }

              >

                View Questions

              </button>



            </div>



          </div>

        </div>



        {/* =========================
            JOB + COMPANY PREPARATION
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                💼 Career Preparation

              </h2>



              <p>

                Find suitable jobs and prepare

                for top companies.

              </p>

            </div>

          </div>



          <div className="ai-tools-grid">



            {/* JOB RECOMMENDATION */}



            <div className="ai-tool-card">



              <div className="tool-icon">

                💼

              </div>



              <h3>

                Job Recommendations

              </h3>



              <p>

                Get jobs matched with your

                skills and target role.

              </p>



              <button

                onClick={() =>

                  navigate(

                    "/job-recommendations"

                  )

                }

              >

                Find Jobs →

              </button>



            </div>



            {/* COMPANY PREPARATION */}



            <div className="ai-tool-card">



              <div className="tool-icon">

                🏢

              </div>



              <h3>

                Company Preparation

              </h3>



              <p>

                Prepare for TCS, Deloitte,

                Infosys, Accenture and Wipro.

              </p>



              <button

                onClick={() =>

                  navigate(

                    "/company-preparation"

                  )

                }

              >

                Start Preparation →

              </button>



            </div>



          </div>

        </div>



        {/* =========================
            SKILL GAP STATUS
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                Skill Gap Status

              </h2>



              <p>

                Your current placement readiness.

              </p>

            </div>

          </div>



          <div className="profile-preview-card">



            {skillGap ? (

              <>

                <h3>

                  {skillGap.targetRole}

                </h3>



                <p>

                  Placement Readiness:{" "}

                  <strong>

                    {skillGap.overallReadiness}%

                  </strong>

                </p>



                <p>

                  Strong Skills:{" "}

                  <strong>

                    {skillGap.strongSkills?.length ||

                      0}

                  </strong>

                </p>



                <p>

                  Skills to Improve:{" "}

                  <strong>

                    {skillGap.missingSkills?.length ||

                      0}

                  </strong>

                </p>



                <button

                  className="edit-profile-button"

                  onClick={() =>

                    navigate(

                      "/skill-gap"

                    )

                  }

                >

                  View Complete Analysis →

                </button>

              </>

            ) : (

              <>

                <h3>

                  Skill Gap Analysis Not Generated

                </h3>



                <p>

                  Let AI analyze your skills and

                  create your personalized roadmap.

                </p>



                <button

                  className="edit-profile-button"

                  onClick={() =>

                    navigate(

                      "/skill-gap"

                    )

                  }

                >

                  Generate Analysis →

                </button>

              </>

            )}



          </div>

        </div>



        {/* =========================
            LATEST INTERVIEW
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                Latest Interview

              </h2>



              <p>

                Your most recent completed

                AI interview.

              </p>

            </div>

          </div>



          <div className="profile-preview-card">



            {latestInterview ? (

              <>

                <h3>

                  {latestInterview.jobRole}

                </h3>



                <p>

                  Interview Type:{" "}

                  <strong>

                    {latestInterview.interviewType}

                  </strong>

                </p>



                <p>

                  Score:{" "}

                  <strong>

                    {latestScore}/10

                  </strong>

                </p>



                <p>

                  Status:{" "}

                  <strong>

                    Completed

                  </strong>

                </p>

              </>

            ) : (

              <>

                <h3>

                  No interview completed yet

                </h3>



                <p>

                  Start your first AI mock

                  interview.

                </p>



                <button

                  className="edit-profile-button"

                  onClick={() =>

                    navigate(

                      "/mock-interview"

                    )

                  }

                >

                  Start Interview →

                </button>

              </>

            )}



          </div>

        </div>



        {/* =========================
            PROFILE
        ========================= */}



        <div className="dashboard-section">



          <div className="section-heading">

            <div>

              <h2>

                Your Profile

              </h2>



              <p>

                Keep your profile updated for

                better AI recommendations.

              </p>

            </div>

          </div>



          <div className="profile-preview-card">



            <h3>

              {profileData?.name || "Student"}

            </h3>



            <p>

              Email:{" "}

              {profileData?.email || "Not added"}

            </p>



            <p>

              Target Role:{" "}

              {profileData?.targetRole ||

                "Not added"}

            </p>



            <p>

              Skills:{" "}

              {profileData?.skills?.length

                ? profileData.skills.join(", ")

                : "No skills added"}

            </p>



            <button

              className="edit-profile-button"

              onClick={() =>

                navigate(

                  "/profile"

                )

              }

            >

              Edit Profile →

            </button>



          </div>

        </div>



      </div>

    </div>

  );

};



export default Dashboard;