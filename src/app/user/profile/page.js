"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSidebar } from "@/providers/useSidebar";
import {
  FaBookOpen,
  FaEnvelope,
  FaMapPin,
  FaPhoneAlt,
  FaUnlock,
  FaUser,
} from "react-icons/fa";
import { changePassword, getUserProfile, updateUserProfile } from "@/api/route";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { useAuth } from "@/providers/AuthContext";

function Profile() {
  const { isSidebarOpen } = useSidebar();
  const [firstName, setFirstName] = useState("");
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [lastName, setLastName] = useState("");
  const [editLastName, setEditLastName] = useState(lastName);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [program, setProgram] = useState("");
  const [city, setCity] = useState("");
  const [isDisabled, setIsDisable] = useState(true);
  const [isDisabledPass, setIsDisablePass] = useState(true);
  const [oldpassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderEdit, setLoaderEdit] = useState(false);
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  // const registrationID = user?.registration_id
  const { userData } = useAuth();
  const isStudent = userData?.Group === "student";
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const [registrationID, setRegistrationID] = useState("");

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
          setEditFirstName(userData.first_name || "");
          setEditLastName(userData.last_name || "");
          setEmail(userData.email || "");
          setContactNumber(userData.contact || "");
          setProgram(userData.program?.name || "");
          setCity(userData.city || "");
          setRegistrationID(userData.registration_id || "");
        } else {
          console.error("Failed to fetch user, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEnabledPass = () => {
    setIsDisablePass(false);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };
  const handleDisabledPass = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsDisablePass(true);
      setPassword("");
      setConfirmPassword("");
    }, 100);
  };

  const handleEnabled = () => setIsDisable(false);

  const handleDisabled = () => {
    setIsDisable(true);
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setEmail(user?.email || "");
    setContactNumber(user?.contact || "");
    setProgram(user?.program || "");
    setCity(user?.city || "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (errorMessage !== "") {
      toast.error("Please enter a valid contact number.");
      setLoaderEdit(false);
      return;
    } else {
      setLoaderEdit(true);
      setFirstName(editFirstName);
      setLastName(editLastName);
      event.preventDefault();
      const userData = {
        first_name: editFirstName,
        last_name: editLastName,
        contact: contactNumber,
        program,
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
              response.error || ""
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
        toast.error(`Error updating profile: ${response.error}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoaderEdit(false);
      }
    }
  };
  const handlePasswordSubmit = async (event) => {
    setLoader(true);
    event.preventDefault();
    if (errorMessage) {
      toast.error("Please enter a valid contact number.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const data = {
      old_password: oldpassword,
      password: password,
      password2: confirmPassword,
    };

    try {
      const response = await changePassword(data);
      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setPassword(data);
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        setIsDisable(true);
        handleDisabledPass();
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error[0]);
      } else {
        toast.error(`Error updating password: ${error.message}`);
      }
    } finally {
      setLoader(false);
    }
  };
  // if (loader) {
  //   return <CircularProgress />;
  // }

  const getFirstWord = (name) => (name ? name[0] : "");

  // const validatePassword = (password) => {
  //   const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]*$/;
  //   return passwordRegex.test(password);
  // };

  const handleConfirmChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    // if (validatePassword(value)) {
    // } else {
    //   console.log("Invalid characters in password");
    // }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    // if (validatePassword(value)) {
    // } else {
    //   console.log("Invalid characters in password");
    // }
  };

  const formatContactInput = (value, caretPos) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    let formattedValue = numericValue
      .slice(0, 11)
      .replace(/(\d{4})(\d{1,7})?/, "$1-$2"); // Format as XXXX-XXXXXXX
    if (numericValue.length <= 4) {
      formattedValue = numericValue;
    }

    return { formattedValue, caretPos };
  };

  const validateContactNumber = (value) => {
    const contactPattern = /^[0-9]{4}-[0-9]{7}$/;
    const invalidPrefix = /^0000-/;

    if (invalidPrefix.test(value)) {
      setErrorMessage("Contact number cannot start with 0000.");
    } else if (!contactPattern.test(value)) {
      setErrorMessage("Please enter a valid contact number.");
    } else {
      setErrorMessage("");
    }
  };

  // Handle input change and validation
  const handleInputChange = (e) => {
    const input = e.target;
    const caretPos = input.selectionStart; // Get current caret position
    const { formattedValue } = formatContactInput(input.value, caretPos);

    setContactNumber(formattedValue); // Set formatted value
    validateContactNumber(formattedValue); // Validate input
  };

  const handleInput = (e) => {
    const input = e.target;
    const caretPos = input.selectionStart;
    const { formattedValue } = formatContactInput(input.value, caretPos);
    const oldValue = contactNumber;

    // Check if the user is deleting right before the hyphen and adjust the cursor
    if (
      oldValue.length > formattedValue.length &&
      oldValue.charAt(caretPos - 1) === "-"
    ) {
      input.setSelectionRange(caretPos - 1, caretPos - 1); // Move the caret back
    }
  };

  return (
    <>
      {/* {loader ? (
        <div className="flex h-screen justify-center items-center">
          <CircularProgress />
        </div>
      ) : ( */}
      <div
        className={`flex-1 transition-transform pt-28 max-md:pt-44 max-lg:pt-44 font-inter ${
          isSidebarOpen
            ? "translate-x-64 pr-4 pl-20"
            : "translate-x-0 pl-10 pr-4"
        }`}
        style={{
          paddingBottom: "20px",
          width: isSidebarOpen ? "83%" : "100%",
        }}
      >
        <div
          className={`lg:pt-12 pb-8 lg:pl-12 lg:pr-12 rounded-xl bg-surface-100 w-full  ${
            !isDisabledPass && "h-full"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:px-8 px-4 lg:h-48 h-50">
            <div className="flex flex-col lg:flex-row w-full justify-center items-center lg:justify-start">
              <div className="ml-2 mb-1 mt-4 relative block w-48 h-48 rounded-full bg-blue-300 border-0 ">
                <p className="flex uppercase font-extrabold h-full text-5xl text-surface-100 justify-center items-center">
                  {getFirstWord(user?.first_name)}
                </p>
              </div>

              <div className="flex lg:flex-col flex-row lg:w-[50%] w-[100%] lg:ml-8 lg:justify-center lg:items-center mt-4">
                <div className="flex flex-col w-full mb-8">
                  <h2 className=" text-sm text-dark-400 cursor-default">
                    Name
                  </h2>
                  <p className="font-medium text-xl capitalize cursor-default">{`${firstName} ${lastName}`}</p>
                </div>
                {isStudent && (
                  <div className="flex flex-col w-full cursor-default">
                    <h2 className=" text-sm text-dark-400">Registration ID</h2>
                    <p className="font-medium text-xl uppercase">
                      {registrationID}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex lg:flex-col flex-row lg:w-[20%] lg:justify-center justify-around gap-4 items-center">
              <button
                onClick={handleEnabled}
                className={`${
                  !isDisabled
                    ? "bg-blue-200 cursor-not-allowed"
                    : "bg-blue-300 cursor-pointer"
                } flex hidden w-full h-14 items-center justify-center rounded-lg py-1.5 font-semibold leading-6 text-base text-surface-100 shadow-sm outline-blue-300 focus:outline-blue-300 focus-visible:outline mb-4`}
              >
                Edit profile
              </button>
              <button
                onClick={handleEnabledPass}
                className="flex w-full h-14 items-center justify-center rounded-lg bg-blue-300 py-1.5 font-semibold leading-6 text-base text-surface-100 shadow-sm outline-blue-300 focus:outline-blue-300 focus-visible:outline mb-4"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="lg:px-16 px-4 pt-8 pb-0 mt-4 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-bold block leading-6 cursor-default">
                Basic Info
              </h2>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="w-full mb-4 sm:mb-0 lg:w-[50%] md:w-[50%]">
                  <label htmlFor="first-name">First Name</label>
                  <div className="mt-2 sm:pr-4">
                    <div className="relative flex items-center">
                      <FaUser className="absolute left-3  text-dark-600 mt-2" />
                      <input
                        id="first-name"
                        disabled={isDisabled}
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        name="first-name"
                        type="text"
                        placeholder="Enter your first name"
                        className={`${
                          !isDisabled && " ring-blue-300 ring-2"
                        } block w-full capitalize outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-[50%] md:w-[50%]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="last-name">Last Name</label>
                  </div>
                  <div className="relative flex items-center mt-2">
                    <FaUser className="absolute left-3 text-dark-600 mt-2 " />
                    <input
                      id="last-name"
                      disabled={isDisabled}
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      name="last-name"
                      type="text"
                      placeholder="Enter your last name"
                      className={`${
                        !isDisabled && " ring-blue-300 ring-2"
                      } block w-full capitalize outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                <div className="mb-4 sm:mb-0 w-full lg:w-[50%] md:w-[50%]">
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
                      className={`${
                        !isDisabled && " text-dark-400"
                      } block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6`}
                    />
                  </div>
                </div>
                <div className="lg:w-[50%] w-full md:w-[50%]">
                  <label htmlFor="contact">Contact Number</label>
                  <div className="relative flex items-center mt-2">
                    <FaPhoneAlt className="absolute left-3 text-dark-600 mt-2" />
                    <input
                      id="contact"
                      disabled={isDisabled}
                      value={contactNumber}
                      placeholder="XXXX-XXXXXXX"
                      inputMode="numeric"
                      type="tel"
                      pattern="[0-9]{4}-[0-9]{7}"
                      name="contact"
                      onChange={handleInputChange}
                      onInput={handleInput}
                      className={`${
                        !isDisabled && "ring-blue-300 ring-2"
                      } block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6`}
                    />
                  </div>
                  {/* Error message */}
                  {errorMessage && (
                    <p className="text-mix-200 text-[12px] mt-1">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-row flex-col lg:w-[100%]">
                {isStudent && (
                  <div className="mb-4 sm:mb-0 w-full lg:w-[50%] md:w-[50%]">
                    <label htmlFor="program">Program</label>
                    <div className="relative flex items-center mt-2 sm:pr-4">
                      <FaBookOpen className="absolute left-3 text-dark-600 mt-2 " />
                      <input
                        id="program"
                        disabled
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        name="program"
                        type="text"
                        className={`${
                          !isDisabled && " text-dark-400"
                        } block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>
                )}
                <div className="lg:w-[50%] w-full md:w-[50%]">
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
                      className={`${
                        !isDisabled && " text-dark-400"
                      } block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6`}
                    />
                  </div>
                </div>
              </div>
              {!isDisabled && (
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
                    className="bg-blue-300 text-surface-100 rounded-md px-4 py-2 border border-blue-300  flex items-center gap-2 justify-center"
                  >
                    {loaderEdit && (
                      <CircularProgress
                        size={20}
                        style={{ color: "#ffffff" }}
                        className="m-[2px]"
                      />
                    )}{" "}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
            {!isDisabledPass && (
              <form
                ref={formRef}
                onSubmit={handlePasswordSubmit}
                className="space-y-6 mt-8 pt-8 pb-0 rounded-xl bg-gray-100"
              >
                <h2 className="text-lg font-bold block leading-6">
                  Change Password
                </h2>
                <div className="flex sm:flex-row flex-col lg:w-[100%]">
                  <div className="mb-2 sm:mb-0 w-full ">
                    <label htmlFor="password">Current Password</label>
                    <div className="relative flex items-center mt-2">
                      <FaUnlock className="absolute left-3 text-dark-600 mt-2" />
                      <input
                        id="old-password"
                        value={oldpassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        name="old-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-8 pt-2 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]"
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
                </div>

                <div className="flex sm:flex-row flex-col lg:w-[100%]">
                  <div className="mb-4 sm:mb-0 w-full lg:w-[50%] md:w-[50%]">
                    <label htmlFor="password">New Password</label>
                    <div className="relative flex items-center mt-2 sm:pr-4">
                      <FaUnlock className="absolute left-3 text-dark-600 mt-2" />
                      <input
                        id="password"
                        value={password}
                        onChange={handleChange}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-8 pt-2 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]"
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
                  <div className="w-full lg:w-[50%] md:w-[50%]">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="relative flex items-center mt-2">
                      <FaUnlock className="absolute left-3 text-dark-600 mt-2" />
                      <input
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={handleConfirmChange}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 text-blue-500 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 pl-10 sm:text-sm sm:leading-6"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-8 pt-2 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]"
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
                    className="bg-blue-300 text-surface-100 rounded-md px-4 py-2 border border-blue-300 flex items-center gap-2 justify-center"
                  >
                    {loader && (
                      <CircularProgress
                        size={20}
                        style={{ color: "#ffffff" }}
                        className="m-[2px]"
                      />
                    )}{" "}
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
}

export default Profile;
