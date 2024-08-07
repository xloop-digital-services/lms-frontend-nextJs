"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const API = process.env.NEXT_PUBLIC_BACKEND_URL;
  const Token = localStorage.getItem("access-token");
  const router = useRouter();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${API}/api/reset-password-email/`,
        {
          email,
        },
        {
          headers: {
            Authorization: `Berear ${Token}`,
            "Content-Type": "application/json",
          },
          // withCredentials: true, // Add this line if your backend requires credentials
        }
      );
      if (response.status === 200) {
        console.log("password", response);
        alert(response.data.message)
        setEmail('')
        router.push("/auth/login");
      }
    } catch (error) {
      console.log("An Error is Occuring");
      console.log(error);
    }
  };

  return (
    <div className="w-full  max-w-lg mx-auto p-6 mt-[10%] font-inter">
      <div className="mt-7 bg-surface-100 rounded-xl shadow-lg dark:bg-dark-800 dark:border-dark-700 ">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-[#282323] dark:text-white font-exo">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-dark-600 dark:text-dark-400">
              Remember your password?
              <a
                className="text-[#03A1D8] decoration-1 hover:underline font-medium pl-1 cursor-pointer"
                href="/auth/login"
              >
                Login here
              </a>
            </p>
          </div>

          <div className="mt-5">
            <form>
              <div className="grid gap-y-5">
                <div className="space-y-3">
                  <label
                    for="email"
                    className="block text-sm font-medium leading-5 text-dark-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full outline-none border border-dark-200 rounded-md text-sm focus:border-blue-300 focus:ring-[#03A1D8] shadow-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                  <p
                    className="hidden text-xs text-[#ca0f0f] mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to you
                  </p>
                </div>
                <button
                  type="submit"
                  onClick={handleResetPassword}
                  className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
