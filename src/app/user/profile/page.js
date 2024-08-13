"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import {
  FaEnvelope,
  FaMapPin,
  FaPhoneAlt,
  FaUnlock,
  FaUser,
} from "react-icons/fa";
import { getUserProfile, updateUserProfile } from "@/api/route";
import { toast } from "react-toastify";

function Profile() {
  const { isSidebarOpen } = useSidebar();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [isDisabled, setIsDisable] = useState(true);
  const [isDisabledPass, setIsDisablePass] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUserProfile();
        if (response.status === 200) {
          console.log("Fetched user data:", response.data);
          const userData = response.data.response;
          setUser(userData);
          setFirstName(userData.first_name || "");
          setLastName(userData.last_name || "");
          setEmail(userData.email || "");
          setContactNumber(userData.contact || "");
          setDob(userData.dob || "");
          setCity(userData.city || "");
        } else {
          console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);

  const handleEnabledPass = () => setIsDisablePass(false);
  const handleDisabledPass = () => {
    setIsDisablePass(true);
    setPassword("");
    setConfirmPassword("");
  };

  const handleEnabled = () => setIsDisable(false);
  const handleDisabled = () => {
    setIsDisable(true);
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setEmail(user?.email || "");
    setContactNumber(user?.contact || "");
    setDob(user?.dob || "");
    setCity(user?.city || "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      first_name: firstName,
      last_name: lastName,
      contact: contactNumber,
      dob,
      email,
      city,
    };

    try {
      const response = await updateUserProfile(userData);
      if (response.status === 200) {
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setUser(userData);
        setIsDisable(true);
      } else {
        toast.error(
          `Profile update failed. Please check your details. ${
            response.data?.message || ""
          }`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`, {
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

  const getFirstWord = (name) => (name ? name[0] : "");

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-28 max-md:pt-44 max-lg:pt-44 ${
          isSidebarOpen
            ? "translate-x-64 pr-4 pl-20"
            : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          paddingBottom: "20px",
          width: isSidebarOpen ? "83%" : "100%",
        }}
      >
        <div className="lg:pt-12 pb-8 lg:pl-12 lg:pr-12 rounded-xl bg-surface-100 w-full">
          <div className="flex flex-col lg:flex-row lg:px-8 px-4 lg:h-48 h-50">
            <div className="flex flex-col lg:flex-row w-full justify-center items-center lg:justify-start">
              <div className="ml-2 mb-1 mt-4 relative block w-48 h-48 rounded-full bg-blue-300 border-0 flex font-extrabold text-5xl text-surface-100 justify-center items-center">
                {getFirstWord(user?.first_name)}
              </div>

              <div className="flex lg:flex-col flex-row lg:w-[50%] w-[100%] lg:ml-8 lg:justify-center lg:items-center mt-4">
                <div className="flex flex-col w-full mb-8">
                  <h2 className="font-medium text-2xl">Name</h2>
                  <p>{`${user?.first_name} ${user?.last_name}`}</p>
                </div>
                <div className="flex flex-col w-full">
                  <h2 className="font-medium text-xl">Email Address</h2>
                  <p>{email}</p>
                </div>
              </div>
            </div>
            <div className="flex lg:flex-col flex-row lg:w-[20%] lg:justify-center justify-around gap-4 items-center">
              <button
                onClick={handleEnabled}
                className="flex w-full h-14 items-center justify-center rounded-lg bg-blue-300 py-1.5 text-sm font-semibold leading-6 text-base text-surface-100 shadow-sm outline-blue-300 focus:outline-blue-300 focus-visible:outline mb-4"
              >
                Edit profile
              </button>
              <button
                onClick={handleEnabledPass}
                className="flex w-full h-14 items-center justify-center rounded-lg bg-blue-300 py-1.5 text-sm font-semibold leading-6 text-base text-surface-100 shadow-sm outline-blue-300 focus:outline-blue-300 focus-visible:outline mb-4"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="lg:px-16 px-4 pt-8 pb-0 mt-4 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-bold block leading-6">Basic Info</h2>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label htmlFor="first-name">First Name</label>
                  <div className="mt-2 sm:pr-4">
                    <div className="relative flex items-center">
                      <FaUser className="absolute left-3  text-dark-600 mt-2" />
                      <input
                        id="first-name"
                        disabled={isDisabled}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        name="first-name"
                        type="text"
                        placeholder="Enter your first name"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:w-[50%] md:w-[50%]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="last-name">Last Name</label>
                  </div>
                  <div className="relative flex items-center mt-2">
                    <FaUser className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="last-name"
                      disabled={isDisabled}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      name="last-name"
                      type="text"
                      placeholder="Enter your last name"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label htmlFor="email">Email address</label>
                  <div className="relative flex items-center mt-2 sm:pr-4">
                    <FaEnvelope className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="email"
                      disabled
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="lg:w-[50%] md:w-[50%]">
                  <label htmlFor="contact">Contact Number</label>
                  <div className="relative flex items-center mt-2">
                    <FaPhoneAlt className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="contact"
                      disabled={isDisabled}
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      name="contact"
                      type="tel"
                      placeholder="Enter your contact number"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label htmlFor="dob">Date of Birth</label>
                  <div className="relative flex items-center mt-2 sm:pr-4">
                    <input
                      id="dob"
                      disabled
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      name="dob"
                      type="date"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="lg:w-[50%] md:w-[50%]">
                  <label htmlFor="city">City</label>
                  <div className="relative flex items-center mt-2">
                    <FaMapPin className="absolute left-3 text-dark-600 mt-2" />
                    <input
                      id="city"
                      disabled
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-surface-100 rounded-md px-4 py-2 mr-2 border border-blue-300 text-blue-300"
                  onClick={handleDisabled}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-300 text-surface-100 rounded-md px-4 py-2 border border-blue-300 "
                >
                  Save Changes
                </button>
              </div>
            </form>
            {!isDisabledPass && (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 mt-8 pt-8 pb-0 rounded-xl bg-gray-100"
              >
                <h2 className="text-lg font-bold block leading-6">
                  Change Password
                </h2>
                <div className="flex sm:flex-row flex-col lg:w-[100%]">
                  <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                    <label htmlFor="password">New Password</label>
                    <div className="relative flex items-center mt-2 sm:pr-4">
                      <FaUnlock className="absolute left-3 text-dark-600 mt-2" />
                      <input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        type="password"
                        placeholder="Enter your new password"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="lg:w-[50%] md:w-[50%]">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="relative flex items-center mt-2">
                      <FaUnlock className="absolute left-3 text-dark-600 mt-2" />
                      <input
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-surface-100 rounded-md px-4 py-2 mr-2 border border-blue-300 text-blue-300"
                    onClick={handleDisabledPass}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-300 text-surface-100 rounded-md px-4 py-2 border border-blue-300 "
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
