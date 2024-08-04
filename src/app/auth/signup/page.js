"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import logo from "../../../../public/assets/img/logo.png";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import Image from "next/image";
import axios from "axios";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const API = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formatContactInput = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = numericValue.replace(/(\d{4})(\d{1,7})?/, "$1-$2");
    return formattedValue.slice(0, 12);
  };

  const cities = [
    "Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi",
    "Gujranwala", "Peshawar", "Multan", "Quetta", "Sialkot"
  ];

  const SignUpUser = async (event) => {
    event.preventDefault();
    try {
      if (password === confirmPassword) {
        const response = await axios.post(
          `${API}/api/create/`,
          {
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            city,
            contact,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            // withCredentials: true, // Add this line if your backend requires credentials
          }
        );

        if (response.status === 200) {
          console.log("res", response);
          router.push("/auth/login");
        }
      } else {
      }
    } catch (error) {
      console.log("error araha he");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F6FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center space-x-4 pr-4">
        <Image className=" h-[75px] w-auto" src={logo} alt="Workflow" />
        {/* <h2 className="text-center text-3xl font-exo leading-9 font-extrabold text-dark-900">
            Learning Management 
          </h2> */}
      </div>
      <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-100  py-6 px-4 shadow sm:rounded-xl sm:px-6">
          <div className="space-y-2">
            <h1 className="font-exo font-bold text-xl text-center"> SignUp </h1>
            <p className="text-[#8A8A95] text-sm text-center">
              Please enter your information
            </p>
          </div>
          <form className="mt-7 space-y-5" onSubmit={SignUpUser}>
            <div className="sm:flex gap-4 space-y-5 sm:space-y-0">
              <div className="space-y-2">
                <label
                  for="firstName"
                  className="block text-sm font-medium leading-5  text-dark-700"
                >
                  First Name
                </label>
                <div className="mt-1 relative rounded-lg ">
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="first name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  for="lastName"
                  className="block text-sm font-medium leading-5  text-dark-700"
                >
                  Last Name
                </label>
                <div className="mt-1 relative rounded-lg ">
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="last name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                for="email"
                className="block text-sm font-medium leading-5  text-dark-700"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-lg ">
                <input
                  id="email"
                  name="email"
                  placeholder="user@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <label
                  for="password"
                  className="block text-sm font-medium leading-5 text-dark-700"
                >
                  Password
                </label>
              </div>
              <div className="mt-1 relative rounded-lg ">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="password (8 or more characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <BsEyeSlashFill size={20} />
                  ) : (
                    <IoEyeSharp size={20} />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <label
                  for="password"
                  className="block text-sm font-medium leading-5 text-dark-700"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-1 relative rounded-lg ">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  placeholder="confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <BsEyeSlashFill size={20} />
                  ) : (
                    <IoEyeSharp size={20} />
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
      <label
        htmlFor="city"
        className="block text-sm font-medium leading-5 text-dark-700"
      >
        City
      </label>
      <div className="mt-1 relative rounded-lg">
        <select
          id="city"
          name="city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        >
          <option value="" disabled>Select a city</option>
          {cities.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </div>
    </div>
            <div className="space-y-2">
              <label
                for="lastName"
                className="block text-sm font-medium leading-5  text-dark-700"
              >
                Contact
              </label>
              <div className="mt-1 relative rounded-lg ">
                <input
                  id="contact"
                  name="contact"
                  placeholder="XXXX - XXXXXXX"
                  // inputMode="numeric"
                  type="tel"
                  pattern="[0-9]{4}-[0-9]{7}"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  onInput={(e) => {
                    e.target.value = formatContactInput(e.target.value);
                  }}
                  className="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-lg shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-surface-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Sign Up
                </button>
              </span>
            </div>
          </form>
          <div className="text-[#8A8A95] text-sm text-center mt-3 space-y-3">
            <p>
              Already have an account?
              <span className="text-[#03A1D8] decoration-1 hover:underline font-medium pl-1 cursor-pointer">
                <Link href="/auth/login"> Login </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
