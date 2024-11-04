"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import userIcon from "../../public/assets/img/images.png";
import logo from "../../public/assets/img/xCelerate-Logo.png";
import { FaBell, FaRegBell, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import Notifications from "./Notifications";
import { getUserProfile } from "@/api/route";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/providers/AuthContext";
import useClickOutside from "@/providers/useClickOutside";
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState({});
  const { logOutUser } = useAuth();

  useClickOutside(dropdownRef, () => setShowNotifications(false));

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUserProfile();
        setLoader(true);
        if (response.status === 200) {
          console.log("Fetched user data:", response.data);
          setLoader(false);
          setUser(response.data.response);
          console.log(response.data.response);
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

  const isLinkActive = (path) => {
    return pathname === path;
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotification);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  const toggleDropdownLogout = () => {
    setShowDropdown(!showDropdown);
  };

  const getFirstWord = (name) => {
    if (!name) return;
    return name.split("")[0];
  };

  const firstWord = getFirstWord(user?.first_name);
  // console.log(firstWord)

  return (
    <>
      <nav className="fixed w-screen bg-surface-100 z-10 font-inter">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            {/* <div className="hidden sm:flex justify start ml-20">
              <Link href="/dashboard" passHref>
                <Image
                  src={logo}
                  alt="logo"
                  width={230}
                  height={100}
                  // className={`w-full h-full `}
                />
              </Link>
            </div> */}

            {loader ? (
              <div className="flex justify-end items-center w-full">
                <CircularProgress />
              </div>
            ) : (
              <div className="flex justify-end items-center w-full">
                <div className="absolute inset-y-0 right-0 flex justify-center items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative flex text-sm text-blue-500 focus:outline-none hover:text-blue-400 "
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      title="announcements"
                      onClick={toggleNotifications}
                    >
                      <FaBell size={24} />
                    </button>
                  </div>
                </div>
                {showNotification && (
                  <div
                    ref={dropdownRef}
                    className="absolute border border-dark-100 right-0 mx-16 mt-[420px] z-10 w-80 origin-top-right rounded-md bg-surface-100 py-1 shadow-lg ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Notifications />
                  </div>
                )}
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                </button>

                <div className="relative ml-3 flex ">
                  <div
                    className="flex items-center"
                    onClick={toggleDropdown}
                    ref={dropdownRef}
                  >
                    <div className="w-[50px] h-[50px] uppercase rounded-full mr-2 flex justify-center items-center text-surface-100 bg-blue-300">
                      {firstWord}
                      {/* <Image
                        src={userIcon}
                        alt="Profile"
                        width={100}
                        height={100}
                        className={`w-full h-full rounded-3xl `}
                        style={{ objectFit: "cover" }}
                      /> */}
                    </div>
                    <div>
                      <div className="flex justify-end items-center cursor-pointer hover:font-medium text-blue-500">
                        <div className="text-blue-500">
                          <p className="text-md capitalize">{`${user?.first_name} ${user?.last_name}`}</p>
                          <p className="text-xs uppercase">
                            {user?.registration_id}
                          </p>
                        </div>
                        <div
                          className={`ml-1 ${
                            showDropdown
                              ? "rotate-180 duration-300"
                              : "duration-300"
                          }`}
                          onClick={toggleDropdown}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`h-4 w-4 cursor-pointer`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                    </button>
                  </div>
                  {showDropdown && (
                    <div
                      className="absolute right-0 mt-[66px] z-10 w-48 origin-top-right rounded-md bg-surface-100 py-1 shadow-lg ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex="-1"
                    >
                      <Link
                        href="/user/profile"
                        passHref
                        className="flex items-center px-4 py-2 text-blue-500 hover:font-semibold"
                        onClick={toggleDropdown}
                      >
                        <FaUser size={17} className="mr-2" />
                        Your Profile
                      </Link>

                      {/* <Link
                        href="/user/management"
                        passHref
                        className="flex items-center px-4 py-2 text-[#07224D] hover:bg-gray-200"
                        onClick={toggleDropdown}
                      >
                        <FaUsers size={17} className="mr-2" />
                        Manage Users
                      </Link> */}

                      <Link
                        href="/auth/login"
                        passHref
                        className="flex items-center px-4 py-2 text-blue-500 hover:font-semibold"
                        onClick={logOutUser}
                      >
                        <FaSignOutAlt size={17} className="mr-2" />
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
