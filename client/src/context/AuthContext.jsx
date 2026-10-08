import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     CHECK LOGIN
  ========================= */

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Authentication error:",
          error.response?.data || error.message
        );

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* =========================
     REGISTER
  ========================= */

  const register = async (
    nameOrUserData,
    email,
    password
  ) => {
    let userData;

    /*
      Supports both:

      register({
        name,
        email,
        password
      })

      AND

      register(
        name,
        email,
        password
      )
    */

    if (
      typeof nameOrUserData === "object" &&
      nameOrUserData !== null
    ) {
      userData = {
        name: nameOrUserData.name,
        email: nameOrUserData.email,
        password: nameOrUserData.password,
      };
    } else {
      userData = {
        name: nameOrUserData,
        email,
        password,
      };
    }

    const response = await api.post(
      "/auth/register",
      userData
    );

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setUser(user);

    return response.data;
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async (
    emailOrUserData,
    password
  ) => {
    let userData;

    /*
      Supports both:

      login({
        email,
        password
      })

      AND

      login(
        email,
        password
      )
    */

    if (
      typeof emailOrUserData === "object" &&
      emailOrUserData !== null
    ) {
      userData = {
        email: emailOrUserData.email,
        password: emailOrUserData.password,
      };
    } else {
      userData = {
        email: emailOrUserData,
        password,
      };
    }

    const response = await api.post(
      "/auth/login",
      userData
    );

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setUser(user);

    return response.data;
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  /* =========================
     UPDATE USER
  ========================= */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   USE AUTH
========================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};