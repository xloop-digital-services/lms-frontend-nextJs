"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { storeToken } from "@/components/storeToken";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      const group = userData?.Group;
      localStorage.setItem("userGroup", group);
    }
  }, [userData]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const logInUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${API}/login/`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status_code === 200) {
        setUserData(response.data.response);
        storeToken(response.data.response.token, response.data);

        router.push("/dashboard");
        toast.success("Login Successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Login failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const logOutUser = () => {
    console.log("Logging out user...");
    setUserData(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("userGroup");
    router.push("/login"); 
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        logInUser,
        logOutUser,
        userData,
        loading,
        handleShowPassword
      }}
    >
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);