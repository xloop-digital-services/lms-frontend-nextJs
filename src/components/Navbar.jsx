"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import userIcon from "../../public/assets/img/images.png";
import logo from "../../public/assets/img/logo.png";
import { FaBell, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isLinkActive = (path) => {
    return pathname === path;
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleDropdownLogout = () => {
    setShowDropdown(!showDropdown);
  };

  const showModal = () => {
    setShowMenu(!showMenu);
  };
  const handleIconClick = (name) => {
    setSearch(name);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed w-screen bg-surface-100 z-10">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            <div className="flex justify start ">
              <Link href="/dashboard" passHref>
                <Image
                  src={logo}
                  alt="logo"
                  width={200}
                  height={100}
                  className={`w-full h-full rounded-3xl `}
                  style={{ objectFit: "cover" }}
                />
              </Link>
            </div>

            <div className="absolute inset-y-0 right-0 flex justify-center items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* {loader ? (
                <CircularProgress />
              ) : ( */}
              <div className="flex justify-center items-center">
                <FaBell size={24} />
              </div>
              <div className="relative ml-3 flex ">
                <div
                  className="flex items-center"
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                >
                  <div className="w-[50px] h-[50px] rounded-full mr-2">
                    <Image
                      src={userIcon}
                      alt="Profile"
                      width={100}
                      height={100}
                      className={`w-full h-full rounded-3xl `}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-end items-center">
                      <div className={``} style={{ color: "#07224D" }}>
                        name
                      </div>
                      <div className={`ml-1`} onClick={toggleDropdown}>
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
                      className="flex items-center px-4 py-2 text-[#07224D] hover:bg-gray-200"
                      onClick={toggleDropdown}
                    >
                      <FaUser size={17} className="mr-2" />
                      Your Profile
                    </Link>

                    <Link
                      href="/user/management"
                      passHref
                      className="flex items-center px-4 py-2 text-[#07224D] hover:bg-gray-200"
                      onClick={toggleDropdown}
                    >
                      <FaUsers size={17} className="mr-2" />
                      Manage Users
                    </Link>

                    <Link
                      href="/auth/login"
                      passHref
                      className="flex items-center px-4 py-2 text-[#07224D] hover:bg-gray-200"
                      onClick={toggleDropdownLogout}
                    >
                      <FaSignOutAlt size={17} className="mr-2" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
