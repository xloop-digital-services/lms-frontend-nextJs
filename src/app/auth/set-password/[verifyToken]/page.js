"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../../../../../public/assets/img/logo.png";
import Image from "next/image";

export default function Page({ params }) {
  const verifyToken = params.verifyToken;
  const router = useRouter();

  return (
    <div className="w-full max-w-lg mx-auto p-6 mt-[10%] font-inter flex flex-col justify-center ">
      <div className="flex items-center justify-center">
        <Image src={logo} alt="Workflow" />
      </div>
      <div className="mt-7 bg-surface-100 rounded-xl shadow-lg ">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-[#282323] font-exo">
              Set your Password by Verification
            </h1>
            <p className="mt-2 text-sm text-dark-600">
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
              <div className="flex flex-col space-y-3">
                <div className="space-y-3">
                  <label
                    for="email"
                    className="block text-sm font-medium leading-5 text-dark-700"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="new-password"
                      id="new-password"
                      name="new-password"
                      placeholder="Enter new password"
                      //   value={email}
                      //   onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full outline-none border border-dark-200 rounded-md text-sm focus:border-blue-300 focus:ring-[#03A1D8] shadow-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label
                    for="email"
                    className="block text-sm font-medium leading-5 text-dark-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="confirm-password"
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Confirm by password"
                      //   value={email}
                      //   onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full outline-none border border-dark-200 rounded-md text-sm focus:border-blue-300 focus:ring-[#03A1D8] shadow-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  //   onClick={handleResetPassword}
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