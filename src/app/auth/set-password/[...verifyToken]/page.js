"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../../../../../public/assets/img/xCelerate-Logo.png";
import { toast } from "react-toastify";
import Image from "next/image";
import { setNewPassword } from "@/api/route";
import { CircularProgress } from "@mui/material";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";

export default function Page({ params }) {
  const [loading, setloading] = useState(false);
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const verifyToken = params.verifyToken;
  const router = useRouter();
  const u_id = params.verifyToken[0];
  const token = params.verifyToken[1];
  // console.log("token", u_id, "/", token)

  const handlePassword = async (event) => {
    event.preventDefault();
    setloading(true);
    // const formData = new FormData();
    // formData.append("password", newPassword);
    // formData.append("password2", confirmPassword);
    // console.log("formData",formData);

    const data = {
      password: newPassword,
      password2: confirmPassword,
    };
    // console.log("form", data);

    try {
      const response = await setNewPassword(data, u_id, token);
      console.log("res", response);
      if (response.status === 200) {
        toast.success("Password Reset Successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            setPassword("");
            setConfirmPassword("");
            router.push("/auth/login");
          },
        });
        setloading(false);
      } else {
        toast.error("Wrong Password.", response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setloading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response.data.password) {
        toast.error(error.response.data.password[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      if(error.response.data.error){
        toast.error(error.response.data.error[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }      
    } finally {
      setloading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
            <h1 className="block text-2xl font-bold text-[#282323] font-exo">
              Set your Password by Verification
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
                      type={showPassword ? "text" : "password"}
                      id="new-password"
                      name="new-password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-3 px-4 block w-full outline-none border border-dark-200 rounded-md text-sm focus:border-blue-300 focus:ring-blue-300 shadow-sm"
                      required
                      aria-describedby="email-error"
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
                <div className="space-y-3">
                  <label
                    for="email"
                    className="block text-sm font-medium leading-5 text-dark-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Confirm by password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-3 px-4 block w-full outline-none border border-dark-200 rounded-md text-sm focus:border-blue-300 focus:ring-blue-300 shadow-sm"
                      required
                      aria-describedby="email-error"
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
                <button
                  type="submit"
                  className="w-full flex justify-center gap-4 py-3 px-4 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                  onClick={handlePassword}
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
