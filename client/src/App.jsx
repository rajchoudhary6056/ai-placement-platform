import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./pages/MockInterview";
import SkillGap from "./pages/SkillGap";
import StudyPlan from "./pages/StudyPlan";

import DSAPractice from "./pages/DSAPractice";
import DSAQuestion from "./pages/DSAQuestion";

import JobRecommendations from "./pages/JobRecommendations";
import CompanyPreparation from "./pages/CompanyPreparation";

import AdminDashboard from "./pages/AdminDashboard";

const ProtectedPage = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
      </div>
    );
  }

  // User login nahi hai
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Admin ko student dashboard nahi milega
  if (user.role === "admin") {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // Normal student
  return (
    <ProtectedPage>
      <Dashboard />
    </ProtectedPage>
  );
};

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
      </div>
    );
  }

  // Login nahi hai
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Student admin page access kare
  if (user.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <ProtectedPage>
      <AdminDashboard />
    </ProtectedPage>
  );
};

const App = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Role Based Dashboard */}
      <Route
        path="/dashboard"
        element={<RoleBasedDashboard />}
      />

      {/* Student Protected Routes */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <Profile />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <ResumeAnalyzer />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <MockInterview />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <SkillGap />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-plan"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <StudyPlan />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa-practice"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <DSAPractice />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa-practice/:id"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <DSAQuestion />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-recommendations"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <JobRecommendations />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      <Route
        path="/company-preparation"
        element={
          <ProtectedRoute>
            <ProtectedPage>
              <CompanyPreparation />
            </ProtectedPage>
          </ProtectedRoute>
        }
      />

      {/* Admin Route */}
      <Route
        path="/admin"
        element={<AdminRoute />}
      />

      {/* Home */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Invalid URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
};

export default App;