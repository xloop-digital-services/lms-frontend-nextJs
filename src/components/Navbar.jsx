"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import userIcon from "../../public/assets/img/images.png";
import logo from "../../public/assets/img/xCelerate-Logo.png";
import {
  FaBell,
  FaBullhorn,
  FaPlus,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
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
  const dropbutton = useRef(null);
  const [user, setUser] = useState({});
  const { logOutUser, userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const userID = userData?.User?.id;
  const group = userData?.Group;
  const { messages: messages, loading: loading } = useWebSocket(
    `wss://lms-api-xloopdigital.com/ws/notification/?user_id=${userID}`,
    group
  );

  const { messages: announcements, loading: load } = useWebSocket(
    `wss://lms-api-xloopdigital.com/ws/announcements/?user_id=${userID}`,
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

  useClickOutside(dropdownRef, dropbutton, () => {
    setShowNotifications(false);
    setShowDropdown(false);
  });

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
  }, [userID]);

  const isLinkActive = (path) => {
    return pathname === path;
  };

  const handleCreateAnnoucement = () => {
    router.push("/announcement/");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
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
                  <div className=" inset-y-0 right-0 flex justify-center items-center pr-2 sm:static sm:inset-auto sm:ml-6 max-sm:pr-0">
                    <div className="flex items-center">
                      {isAdmin ? (
                        <div className="w-full px-4 max-sm:px-1 ">
                          <button
                            className="flex gap-2 w-full justify-center rounded-lg border border-dark-300 hover:border-blue-300 px-2 py-2 items-center hover:bg-blue-100 hover:text-blue-300"
                            onClick={handleCreateAnnoucement}
                          >
                            <FaBullhorn className="text-blue-500" />
                            <p
                              className="max-sm:hidden text-blue-500 "
                              title="View Announcement"
                            >
                              View announcements
                            </p>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="relative max-sm:mr-3 flex text-sm text-blue-500 focus:outline-none hover:text-blue-400 "
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

                  <div className="relative flex items-center" ref={dropdownRef}>
                    {/* Profile Icon */}
                    <div
                      className="w-[50px] h-[50px] uppercase rounded-full mr-2 cursor-pointer flex justify-center items-center text-surface-100 bg-blue-300"
                      onClick={toggleDropdown}
                    >
                      {firstWord}
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col">
                      <div
                        ref={dropbutton}
                        className="flex justify-end items-center cursor-pointer hover:font-medium text-blue-500"
                        onClick={toggleDropdown}
                      >
                        <div>
                          <p className="text-md capitalize">{`${user?.first_name} ${user?.last_name}`}</p>
                          <p className="text-xs uppercase">
                            {user?.registration_id}
                          </p>
                        </div>
                        <div
                          className={`ml-1 transition-transform ${
                            showDropdown ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`h-4 w-4`}
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

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-40 z-10 w-48 origin-top-right rounded-lg bg-surface-100 py-2 shadow-lg focus:outline-none"
                        role="menu"
                      >
                        <Link
                          href="/user/profile"
                          passHref
                          className="flex items-center px-4 py-2 text-blue-500 hover:bg-blue-50 hover:font-semibold"
                          onClick={toggleDropdown}
                        >
                          <FaUser size={17} className="mr-2" />
                          Your Profile
                        </Link>
                        <Link
                          href="/auth/login"
                          passHref
                          className="flex items-center px-4 py-2 text-blue-500 hover:bg-blue-50 hover:font-semibold"
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