"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/providers/useSidebar";
import {
  FaEnvelope,
  FaLocationArrow,
  FaLockOpen,
  FaMailBulk,
  FaMap,
  FaMapPin,
  FaPhone,
  FaPhoneAlt,
  FaSearchLocation,
  FaUnlock,
  FaUser,
} from "react-icons/fa";
import { getUserProfile } from "@/api/route";

function Profile() {
  const { isSidebarOpen } = useSidebar();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [isDisabled, setIsDisable] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUserProfile();
        if (response.status === 200) {
          console.log("Fetched user data:", response.data);
          setUser(response.data);
          console.log(user, "user");
          // console.log(response.data.response.city, "city")
        } else {
          console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  });

  const handleEnabled = () => {
    setIsDisable(false);
  };

  const handleDisabled = () => {
    setIsDisable(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob("");
    setCity("");
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      city: city,
      dob: dob,
    };
  };

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
          <div
          //  className="rounded-xl text-blue-500"
          >
            <div className="flex flex-col lg:flex-row lg:px-8 px-4 lg:h-48 h-50">
              <div className="flex flex-col lg:flex-row w-full justify-center items-center lg:justify-start ">
                <div className="ml-2 mb-1 mt-4 relative block w-48 h-48 rounded-full bg-blue-400 border-0">
                  {/* profile picture here */}
                </div>

                <div className="flex lg:flex-col flex-row lg:w-[50%] w-[100%] lg:ml-8 lg:justify-center lg:items-center mt-4">
                  <div className="flex flex-col w-full mb-8">
                    <h2 className="font-medium text-2xl">Name</h2>
                    <p>{`${user?.response?.first_name} ${user?.response?.last_name}`}</p>
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
                  onClick={handleChangePassword}
                  className="flex w-full h-14 items-center justify-center rounded-lg bg-blue-300 py-1.5 text-sm font-semibold leading-6 text-base text-surface-100 shadow-sm outline-blue-300 focus:outline-blue-300 focus-visible:outline mb-4"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="lg:px-16 px-4 pt-8 pb-0 mt-4 rounded-xl">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <h2 className="text-lg font-bold block leading-6">Basic Info</h2>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label
                    htmlFor="first-name"
                    // className="text-lg block text-sm font-medium leading-6"
                  >
                    First Name
                  </label>
                  <div className="mt-2 sm:pr-4">
                    <div className="relative flex items-center">
                      <FaUser className="absolute left-3  text-dark-600 mt-2" />
                      <input
                        id="first-name"
                        disabled={isDisabled}
                        value={user?.response?.first_name}
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
                    <label
                      htmlFor="last-name"
                      // className="text-lg block text-sm font-medium leading-6"
                    >
                      Last Name
                    </label>
                  </div>
                  <div className="relative flex items-center mt-2">
                    <FaUser className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="last-name"
                      disabled={isDisabled}
                      value={user?.response?.last_name}
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
                  <label
                    htmlFor="email"
                    // className="text-lg block text-sm font-medium leading-6"
                  >
                    Email
                  </label>
                  <div className="mt-2 sm:pr-4">
                    <div className="relative flex items-center">
                      <FaEnvelope className="absolute left-3  text-dark-600 mt-2" />
                      <input
                        id="email"
                        disabled={isDisabled}
                        readOnly
                        value={user?.response?.email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:w-[50%] md:w-[50%]">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="contact"
                      // className="text-lg block text-sm font-medium leading-6"
                    >
                      Contact Number
                    </label>
                  </div>
                  <div className="relative flex items-center mt-2">
                    <FaPhoneAlt className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="contact"
                      disabled={isDisabled}
                      value={user?.response?.contact}
                      onChange={(e) => setContactNumber(e.target.value)}
                      name="contact"
                      type="tel"
                      pattern="[0-9]{4}-[0-9]{7}"
                      placeholder="Enter your Contact Number in this format XXXX-XXXXXXX"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="dob"
                      // className="text-lg block text-sm font-medium leading-6"
                    >
                      Date of Birth
                    </label>
                  </div>
                  <div className="mt-2 sm:pr-4">
                    <div className="relative flex items-center">
                      <FaEnvelope className="absolute left-3  text-dark-600 mt-2" />
                      <input
                        id="dob"
                        name="dob"
                        disabled={isDisabled}
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        type="date"
                        placeholder="Enter your Date of Birth"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:w-[50%]">
                  <label
                    htmlFor="city"
                    // className="text-lg block text-sm font-medium leading-6"
                  >
                    City of Residence
                  </label>
                  <div className="relative flex items-center mt-2">
                    <FaMapPin className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="city"
                      name="city"
                      disabled={isDisabled}
                      value={user?.response?.city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      placeholder="Enter your city"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-bold block leading-6">
                Change Password
              </h2>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label htmlFor="new-password">New Password</label>
                  <div className="mt-2 sm:pr-4">
                    <div className="relative flex items-center">
                      <FaUnlock className="absolute left-3 text-dark-600" />
                      <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        disabled={isDisabled}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="Enter your New Password"
                        // required
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="lg:w-[50%] md:w-[50%]">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="relative flex items-center mt-2">
                    <FaUnlock className="absolute left-3 text-dark-600 mt-2" />
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      disabled={isDisabled}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Confirm your New Password"
                      className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 sm:mb-0 lg:w-[60%] flex mt-8 ">
                <button
                  type="button"
                  onClick={(e) => handleDisabled()}
                  disabled={isDisabled}
                  className="flex w-full h-14 mr-4 items-center justify-center rounded-lg bg-surface-100 border border-3 border-dark-400 text-base py-1.5 text-sm font-semibold leading-6 text-dark-400 outline-dark-400 focus:outline-dark-400 shadow-sm focus-visible:outline focus-visible:outline-2 mb-4 "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="flex w-full h-14 items-center justify-center rounded-lg bg-blue-300 py-4 text-sm font-semibold leading-6 text-base text-surface-100 shadow-sm outline-blue-300 focus:outline-blue-300 focus-visible:outline mb-4 "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
