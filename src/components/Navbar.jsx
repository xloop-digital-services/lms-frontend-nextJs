"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import userIcon from "../../public/assets/img/images.png";
import logo from "../../public/assets/img/xCelerate-Logo.png";
import { FaBell, FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import Notifications from "./Notifications";
import { getUserProfile } from "@/api/route";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/providers/AuthContext";
import useClickOutside from "@/providers/useClickOutside";
import useWebSocket from "@/providers/useWebSockets";
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState({});
  const { logOutUser, userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const userID = userData?.User?.id;
  const group = userData?.Group;
  const { messages: messages, loading: loading } = useWebSocket(
    `ws://13.126.167.22:8000/ws/notification/?user_id=${userID}`,
    group
  );

  const { messages: announcements, loading: load } = useWebSocket(
    `ws://13.126.167.22:8000/ws/announcements/?user_id=${userID}`,
    group
  );

  const ra = announcements.filter((message) => message.read === true).length;
  const ura = announcements.filter((message) => message.read === false).length;
  const rn = messages.filter((message) => message.status === "read").length;
  const urn = messages.filter((message) => message.status === "unread").length;
  const reads = ra + rn;
  const unreads = ura + urn;
  // console.log(ura, urn);

  // console.log("unread", unreads);
  // console.log("reads", reads);

  useClickOutside(dropdownRef, () => setShowNotifications(false));

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUserProfile();
        setLoader(true);
        if (response.status === 200) {
          // console.log("Fetched user data:", response.data);
          setLoader(false);
          setUser(response.data.response);
          // console.log(response.data.response);
          // console.log(user, "user");
          // console.log(response.data.response.city, "city")
        } else {
          // console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        // console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);

  const isLinkActive = (path) => {
    return pathname === path;
  };

  const handleCreateAnnoucement = () => {
    router.push("/announcement/new-announcement");
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
                  // className={w-full h-full }
                />
              </Link>
            </div> */}

            {loader ? (
              <div className="flex justify-end items-center w-full">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="flex justify-end items-center w-full">
                  <div className=" inset-y-0 right-0 flex justify-center items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <div className="flex items-center">
                      {isAdmin ? (
                        <div className="w-full px-4 max-sm:px-1">
                          <button
                            className="flex gap-2 w-full justify-center rounded-lg border border-dark-300 hover:border-blue-300 px-2 py-2 items-center hover:bg-blue-100 hover:text-blue-300"
                            onClick={handleCreateAnnoucement}
                          >
                            <FaPlus />
                            <p
                              className="max-sm:hidden "
                              title="New Announcement"
                            >
                              New announcement
                            </p>
                          </button>
                        </div>
                      ) : (
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
                          {unreads > 0 && (
                            <span
                              className="absolute -top-1 -right-1 inline-block w-[10px] h-[11px] bg-mix-200 rounded-xl text-surface-100"
                              //  className="absolute -top-3 text-center -right-5 inline-block w-[30px] h-[21px] bg-mix-200 rounded-xl text-surface-100"
                            >
                              {/* {unreads}+ */}
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {showNotification && (
                    <div
                      ref={dropdownRef}
                      className="absolute border border-dark-100 right-0 mx-16 max-sm:mx-4 mt-[490px] z-10 w-96 max-sm:w-72 origin-top-right rounded-md bg-surface-100 py-1 shadow-lg ring-opacity-5 focus:outline-none"
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
                        className={w-full h-full rounded-3xl }
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
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
