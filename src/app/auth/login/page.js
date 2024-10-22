"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/assets/img/xCelerate-Logo.png";
import { BsEyeSlashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useAuth } from "@/providers/AuthContext";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    handleShowPassword,
    logInUser,
    loading,
  } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center space-x-6 pr-4">
        <div className="flex items-center justify-center">
          <Image
            src={logo}
            alt="logo"
            width={300}
            height={50}
            className=" object-contain"
          />
        </div>
      </div>
      <div className="mt-9 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-100 py-8 px-4 shadow sm:rounded-xl sm:px-10">
          <div className="space-y-2">
            <h1 className="font-exo font-bold text-xl text-center">Login</h1>
            <p className="text-[#8A8A95] text-sm text-center">
              Please enter your login information
            </p>
          </div>
          <form className="mt-5" onSubmit={logInUser}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-dark-700"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-lg">
                <input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  required
                  value={email.trim()}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-5 text-dark-700"
                >
                  Password
                </label>
                <div className="text-sm leading-5">
                  <Link
                    href="/auth/reset-password"
                    className="font-medium text-blue-300 hover:text-[#3272b6] focus:outline-none focus:underline transition ease-in-out duration-150"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1 relative rounded-lg">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  title="Password (at least 8 characters, with letters, numbers, and special characters)"
                  required
                  value={password.trim()}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full p-3 pr-9 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <IoEyeSharp size={20} />
                  ) : (
                    <BsEyeSlashFill size={20} />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-lg shadow-sm">
                <button
                  type="submit"
                  className={`w-full flex justify-center gap-4 py-3 px-4 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out ${
                    loading ? "read-only" : ""
                  }`}
                >
                  {loading && (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  )}{" "}
                  Sign in
                </button>
              </span>
            </div>
          </form>
          {/* <div className="text-[#8A8A95] text-sm text-center mt-3 space-y-3">
            <p>
              Dont have an account?
              <span className="text-blue-300 decoration-1 hover:underline font-medium pl-1 cursor-pointer">
                <Link href="/auth/signup">SignUp</Link>
              </span>
            </p>
            <p>or</p>
            <button className="w-full flex justify-center py-3 px-4 hover:text-surface-100 border bg-transparent text-sm font-medium rounded-lg text-blue-300 border-blue-300 hover:bg-blue-300 focus:outline-none focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
              <Link href="/auth/signup">Register Now</Link>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
