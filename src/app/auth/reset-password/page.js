"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { resetPassword } from "@/api/route";
import logo from "../../../../public/assets/img/xCelerate-Logo.png";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // const API = process.env.NEXT_PUBLIC_BACKEND_URL;
  // const Token = localStorage.getItem("access-token");
  const Token = Cookies.get("access_token");
  const router = useRouter();

  const handleResetPassword = async (event) => {
    setLoading(true);
    // console.log(email);
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await resetPassword(formData);
      if (response.data.status_code === 200) {
        toast.success("Email sent successfully, Check your email", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            setEmail("");
            // router.push("/auth/login");
          },
        });
        setLoading(false);
      } else {
        toast.error("Wrong Email.", response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred.", error.response.data.email[0]);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 mt-[10%] font-inter flex flex-col justify-center ">
      <div className="flex items-center justify-center">
      <Image
            src={logo}
            alt="logo"
            width={300}
            height={50}
            className=" object-contain"
          />
      </div>
      <div className="mt-8 bg-surface-100 rounded-xl shadow-lg ">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-[#282323]">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-dark-600">
              Remember your password?
              <a
                className="text-blue-300 decoration-1 hover:underline font-medium pl-1 cursor-pointer"
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
                  <label className="block text-sm font-medium leading-5 text-dark-700">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="email address"
                      value={email.trim()}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full outline-none border border-dark-200 rounded-md text-sm focus:border-blue-300 focus:ring-blue-300 shadow-sm"
                      required
                    />
                  </div>
                  <p
                    className="hidden text-xs text-[#ca0f0f] mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p>
                </div>
                <button
                  type="submit"
                  onClick={handleResetPassword}
                  className="w-full flex justify-center py-3 px-4 text-sm gap-4 font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  {loading && (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  )}{" "}
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