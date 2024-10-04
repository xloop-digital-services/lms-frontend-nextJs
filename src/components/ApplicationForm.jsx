"use client";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../public/assets/img/logo.png";
import bg from "../../public/assets/img/bg.jpg";
import cityAreas from "../../public/data/cityAreas.json";
import Image from "next/image";
import useClickOutside from "@/providers/useClickOutside";
import { IoIosArrowDown } from "react-icons/io";
import {
  getAllPrograms,
  getAllSkills,
  listAllLocations,
  submitApplication,
} from "@/api/route";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ApplicationForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("Select your city");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [cityShortName, setCityShortName] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [locationName, setLocationName] = useState([]);
  const [locationId, setLocationId] = useState([]);
  const [locationCode, setLocationCode] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [currentYear, setCurrentYear] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState(null);
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [programId, setProgramId] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [isSkillSelected, setIsSkillSelected] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [skillId, setSkillId] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [programError, setPorgramError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");

  const handleFirstName = (e) => {
    const name = e.target.value;

    // Regular expression to allow only alphabets (a-z, A-Z)
    const alphabetPattern = /^[a-zA-Z]*$/;

    // Check if the name contains only alphabets
    if (!alphabetPattern.test(name)) {
      setNameError("Name can only contain alphabets.");
    } else {
      setFirstName(name);
      setNameError(""); // Clear the error if the input is valid
    }
  };

  const handleLastName = (e) => {
    const name = e.target.value;

    // Regular expression to allow only alphabets (a-z, A-Z)
    const alphabetPattern = /^[a-zA-Z]*$/;

    // Check if the name contains only alphabets
    if (!alphabetPattern.test(name)) {
      setNameError("Name can only contain alphabets.");
    } else {
      setLastName(name);
      setNameError(""); // Clear the error if the input is valid
    }
  };

  const formatContactInput = (value, caretPos) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    let formattedValue = value;

    if (numericValue.startsWith("92") && numericValue.length <= 12) {
      // If it starts with +92, format as +92XXXXXXXXXX
      formattedValue = `+92${numericValue.slice(2).slice(0, 10)}`; // Keep only 10 digits after +92
    } else if (numericValue.startsWith("0")) {
      // If it starts with 0, format as 0XXX-XXXXXXX
      formattedValue = numericValue
        .slice(0, 11) // Limit to 11 digits total
        .replace(/(\d{4})(\d{1,7})/, "$1-$2"); // Format as 0XXX-XXXXXXX
    } else {
      formattedValue = numericValue.slice(0, 11); // Just return the first 11 digits for other cases
    }

    return { formattedValue, caretPos };
  };

  // Validate the contact number input
  const validateContactNumber = (value) => {
    // Ensure valid format: +92XXXXXXXXXX or 0XXX-XXXXXXX
    const contactPattern = /^(?:\+92[0-9]{10}|0[0-9]{3}-[0-9]{7})$/; // Match +92XXXXXXXXXX or 0XXX-XXXXXXX
    const invalidPrefix = /^0000/; // Prevent numbers starting with 0000

    if (invalidPrefix.test(value)) {
      setErrorMessage("Contact number cannot start with 0000.");
    } else if (!contactPattern.test(value)) {
      // No need to check startsWith here; the regex handles the format
      setErrorMessage("Please enter a valid contact number.");
    } else {
      setErrorMessage(""); // Clear error if the input is valid
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

  const cityDown = useRef(null);
  useClickOutside(cityDown, () => {
    setIsCityOpen(false);
    setIsLocationOpen(false);
    setIsProgramOpen(false);
    setIsSkillOpen(false);
  });

  const toggleProgramOpen = () => {
    setIsProgramOpen(!isProgramOpen);
  };

  const handleProgramSelect = (program) => {
    if (!selectedProgram.includes(program.name)) {
      setSelectedProgram([...selectedProgram, program.name]);
      setProgramId([...programId, program.id]);
    } else {
      // If program is already selected, remove it
      setSelectedProgram(
        selectedProgram.filter((selected) => selected !== program.name)
      );
      setProgramId(programId.filter((selected) => selected !== program.id));
    }
    // setIsProgramOpen(false);
    setIsProgramSelected(true);
  };
  const toggleSkillOpen = () => {
    setIsSkillOpen(!isSkillOpen);
  };

  const handleSkillSelect = (program) => {
    if (!selectedSkill.includes(program.name)) {
      setSelectedSkill([...selectedSkill, program.name]);
      setSkillId([...skillId, program.id]);
    } else {
      // If program is already selected, remove it
      setSelectedSkill(
        selectedSkill.filter((selected) => selected !== program.name)
      );
      setSkillId(skillId.filter((selected) => selected !== program.id));
    }
    // setIsSkillOpen(false);
    setIsSkillSelected(true);
  };
  const toggleCityOpen = () => {
    setIsCityOpen(!isCityOpen);
  };
  const handleCitySelect = (option) => {
    setSelectedCity(option.name);
    setCityShortName(option.shortName);
    setIsCityOpen(false);
    setIsCitySelected(true);
    // setAllLocations(option.areas);
  };
  const toggleLocationOpen = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const handleLocationSelect = (program) => {
    if (!locationName.includes(program.name)) {
      setLocationName([...locationName, program.name]);
      setLocationId([...locationId, program.id]);
    } else {
      // If program is already selected, remove it
      setLocationName(
        locationName.filter((selected) => selected !== program.name)
      );
      setLocationId(locationId.filter((selected) => selected !== program.id));
    }
    // setLocationCode(program.shortName);
    // setIsLocationOpen(false);
    setIsLocationSelected(true);
  };

  useEffect(() => {
    setCityOptions(cityAreas);

    const year = new Date().getFullYear();
    setCurrentYear(parseInt(year));
  }, []);

  useEffect(() => {
    const handleListLocation = async () => {
      try {
        const response = await listAllLocations();
        setAllLocations(response.data);
        // console.log("all locations", response);
      } catch (error) {
        console.log(error);
      }
    };
    handleListLocation();
  }, [isCitySelected]);

  useEffect(() => {
    const handleListingPrograms = async () => {
      try {
        const response = await getAllPrograms();
        setAllPrograms(response.data.data);
        // console.log("programs", response.data.data);
      } catch (error) {
        console.log("program error", error);
      }
    };

    handleListingPrograms();
  }, [isProgramOpen]);

  useEffect(() => {
    const handleListingSkills = async () => {
      try {
        const response = await getAllSkills();
        // console.log("skills", response.data);
        setAllSkills(response.data);
      } catch (error) {
        console.log("skills error", error);
      }
    };

    handleListingSkills();
  }, [isSkillOpen]);

  const supportedFormats = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".txt",
    ".zip",
  ];

  const handleBrowse = (event) => {
    const selectedFile = event.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (file) => {
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (supportedFormats.includes(`.${fileExtension}`)) {
        console.log("file name", file.name);
        setFile(file);
        setFileUploaded(file.name);
      } else {
        toast.error("This file format is not supported.");
        setFileUploaded(null);
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    // Adjust age if the current month or day is earlier in the year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 14) {
      setError("Age must be greater than 14 years");
    } else {
      setError("");
    }

    setBirthDate(e.target.value);
  };
  const handleApplicationCreation = async () => {
    setLoadingSubmit(true);

    if (!selectedRole) {
      toast.error("Please select your role");
      setLoadingSubmit(false);
      return;
    }

    if (errorMessage !== "") {
      toast.error("Please enter a valid contact number.");
      setLoadingSubmit(false); // Set loader to false
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !contactNumber ||
      !selectedCity ||
      !birthDate ||
      (!experience && selectedRole !== "student") ||
      !locationId
    ) {
      toast.error("Please properly fill out all the fields");
      setLoadingSubmit(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("contact", contactNumber);
      formData.append("city", selectedCity);
      formData.append("city_abb", cityShortName);
      formData.append("group_name", selectedRole);
      formData.append("year", currentYear);
      formData.append("date_of_birth", birthDate);

      locationId.forEach((id) => {
        formData.append("location", id);
      });

      if (selectedRole !== "instructor") {
        programId.forEach((id) => {
          formData.append("program", id);
        });
      }
      if (selectedRole !== "student") {
        formData.append("years_of_experience", parseInt(experience));
        formData.append("resume", file);
        skillId.forEach((id) => {
          formData.append("required_skills", id);
        });
      }
      const response = await submitApplication(formData);
      router.push("/application/submitted");
      console.log("submit", response);
    } catch (error) {
      console.log("Error in submitting", error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.email[0]);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center p-4 gap-7 bg-gradient-to-t from-blue-600 ">
      <Image src={logo} className="lg:w-[250px] w-[200px]" />
      <div className="bg-surface-100 rounded-xl xsm:p-4 flex flex-col space-y-4 xl:w-[70%] sm:w-[80%] w-[95%] max-h-screen overflow-y-auto scrollbar-webkit ">
        {loadingSubmit && (
          <div className="absolute inset-0 w-full p-2 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div>
          <p className="text-center font-exo text-2xl font-semibold py-2">
            Registration Form
          </p>
        </div>
        <div className="flex gap-6 lg:flex-row flex-col justify-evenly font-inter">
          <div className="flex flex-col xl:w-full lg:max-w-[700px] w-full space-y-4 px-4">
            <div className="space-y-2 text-[15px] w-full">
              <p>Email</p>
              <input
                type="email"
                className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-[15px] w-full">
              <p>First Name</p>
              <input
                type="text"
                className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                placeholder="Enter your first name"
                value={firstName}
                onChange={handleFirstName}
                pattern="[a-zA-Z]"
                title="Please enter your correct name"
              />
            </div>
            <div className="space-y-2 text-[15px] w-full">
              <p>Last Name</p>
              <input
                type="text"
                className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                placeholder="Enter your last name"
                value={lastName}
                onChange={handleLastName}
                pattern="[a-zA-Z]"
                title="Please enter your correct name"
              />
            </div>
            <div className="space-y-1 text-[15px] w-full">
              <div className="space-y-2">
                <p>Contact</p>
                <input
                  className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                  placeholder="XXXX-XXXXXXX"
                  inputMode="numeric"
                  type="tel"
                  pattern="[0-9]{4}-[0-9]{7}"
                  name="contact"
                  value={contactNumber}
                  onChange={handleInputChange}
                  onInput={handleInput}
                />
              </div>
              {errorMessage && (
                <p className="text-mix-200 text-[12px] mt-1">{errorMessage}</p>
              )}
            </div>
            <div className="relative space-y-2 text-[15px] w-full">
              <p>City</p>
              <button
                onClick={toggleCityOpen}
                className={`${
                  !isCitySelected ? " text-[#92A7BE]" : "text-[#424B55]"
                } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
              >
                {selectedCity}
                <span className="">
                  <IoIosArrowDown />
                </span>
              </button>

              {isCityOpen && (
                <div
                  ref={cityDown}
                  className="absolute top-full left-0 z-10 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                >
                  {/* Filter the cityOptions based on available locations */}
                  {cityOptions
                    .filter((city) =>
                      allLocations.some(
                        (location) => location.city === city.name
                      )
                    )
                    .map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleCitySelect(option)}
                        className="p-2 cursor-pointer "
                      >
                        <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                          {option.name}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className=" relative space-y-2 text-[15px] w-full">
              <p>
                Location{" "}
                <span className="text-[12px] text-dark-400">(atleast 3)</span>
              </p>
              <div>
                <button
                  onClick={toggleLocationOpen}
                  className={`${
                    !isLocationSelected
                      ? " text-[#92A7BE] py-3"
                      : "text-[#424b55] py-2"
                  } flex justify-between items-center  w-full hover:text-[#0e1721] px-4 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {locationName.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {locationName.map((program, index) => (
                        <span
                          key={index}
                          className="bg-[#d0e9f888] px-2 py-1 text-blue-300 rounded"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Select your suitable locations"
                  )}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isLocationOpen &&
                selectedCity !== "Select your city" &&
                allLocations.length > 0 ? (
                  <div
                    ref={cityDown}
                    className="absolute  top-full left-0 z-10 w-full mt-2 lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {allLocations.map(
                      (option, index) =>
                        option.city === selectedCity && (
                          <div
                            key={index}
                            onClick={() => handleLocationSelect(option)}
                            className="p-2 cursor-pointer "
                          >
                            <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                              {option.name}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  isLocationOpen &&
                  !isCitySelected &&
                  selectedCity === "Select your city" && (
                    <div
                      ref={cityDown}
                      className="absolute  top-full left-0 z-10 w-full mt-2 lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      <p className="text-[12px] text-dark-400 text-center p-1">
                        Select your city first
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="space-y-2 text-[15px] w-full">
              <p>Location Code</p>
              <input
                className="border border-dark-300 outline-none p-3 rounded-lg w-full "
                value={cityShortName}
                readOnly
              />
            </div>
          </div>
          <div className="bg-gradient-to-t from-transparent via-dark-200 to-transparent h-full lg:flex hidden w-[2px] py-6"></div>

          <div className="flex flex-col w-full space-y-4 mt-4 px-4">
            <div className="flex xsm:flex-row flex-col xsm:gap-0 gap-4 w-full items-center  justify-center">
              <p className="lg:w-[150px] w-[60%] text-center">Register as: </p>
              <div className="flex lg:justify-evenly lg:gap-0 gap-10 xsm:justify-start justify-center items-start w-full">
                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="registerAs" // Same name for both radio buttons
                    value="student"
                    checked={selectedRole === "student"}
                    onChange={(e) => setSelectedRole(e.target.value)} // Capture selected value
                  />
                  <p>Student</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="registerAs" // Same name for both radio buttons
                    value="instructor"
                    checked={selectedRole === "instructor"}
                    onChange={(e) => setSelectedRole(e.target.value)} // Capture selected value
                  />
                  <p>Instructor</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-[15px] w-full lg:pt-10 pt-6">
              <p>Applying Year</p>
              <input
                className="border border-dark-300 outline-none p-3 rounded-lg w-full"
                value={currentYear} // Set value to current year
                readOnly // Make the field read-only, or remove if you want it editable
              />
            </div>
            <div className="space-y-2 text-[15px] w-full">
              <p>Date of Birth</p>
              <input
                type="date"
                className="border border-dark-300 text-[#424b55] outline-none px-3 py-3 my-2 rounded-lg w-full"
                placeholder="Select your date of birth"
                value={birthDate}
                onChange={handleDateChange}
              />
              {error && <p className="text-mix-200 text-[12px]">{error}</p>}
            </div>

            {selectedRole === "student" ? (
              <div className=" relative space-y-2 text-[15px] w-full">
                <p>
                  Programs{" "}
                  <span className="text-[12px] text-dark-400">(atleast 3)</span>{" "}
                </p>
                <button
                  onClick={toggleProgramOpen}
                  className={`${
                    selectedProgram.length === 0
                      ? "text-[#92A7BE] py-3 "
                      : "text-[#424b55] py-2"
                  } flex justify-between items-center w-full hover:text-[#0e1721] px-4 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedProgram.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.map((program, index) => (
                        <span
                          key={index}
                          className="bg-[#d0e9f888] px-2 py-1 text-blue-300 rounded"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Select your programs"
                  )}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isProgramOpen && (
                  <div
                    ref={cityDown}
                    className="absolute  top-full left-0 mt-2 z-10 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {allPrograms.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleProgramSelect(option)}
                        className="p-2 cursor-pointer"
                      >
                        <div
                          className={`px-4 py-1 ${
                            selectedProgram.includes(option.name)
                              ? "bg-[#03a3d838] text-[#03A1D8] font-semibold"
                              : ""
                          } hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg`}
                        >
                          {option.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedRole === "instructor" ? (
              <div>
                <div className=" relative space-y-2 text-[15px] w-full">
                  <p>
                    Skills{" "}
                    <span className="text-[12px] text-dark-400">
                      (atleast 3)
                    </span>
                  </p>
                  <button
                    onClick={toggleSkillOpen}
                    className={`${
                      !isSkillSelected
                        ? " text-[#92A7BE] py-3"
                        : "text-[#424b55] py-2"
                    } flex justify-between items-center w-full  hover:text-[#0e1721] px-4  text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                    {selectedSkill.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedSkill.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#d0e9f888] px-2 py-1 text-blue-300 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "Select your skills"
                    )}
                    <span className="">
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isSkillOpen && (
                    <div
                      ref={cityDown}
                      className="absolute  top-full left-0 z-10 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opaCity duration-300 ease-in-out"
                    >
                      {allSkills.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleSkillSelect(option)}
                          className="p-2 cursor-pointer "
                        >
                          <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                            {option.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="my-4 text-[15px] w-full">
                  <p>Years of Experience</p>
                  <input
                    type="number"
                    className="border border-dark-300 text-[#424b55] outline-none px-3 py-3 my-2 rounded-lg w-full"
                    placeholder="Your experience in years"
                    inputMode="numeric"
                    value={experience}
                    min={0}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div className="my-2 text-[15px] w-full ">
                  <p>Resume</p>
                  <input
                    required
                    type="file"
                    className="border border-dark-300 text-[#424b55] outline-none px-3 py-3 my-2 rounded-lg w-full"
                    placeholder="Upload your resume"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex w-full lg:py-0 pt-8 pb-4 justify-center items-center font-inter">
          <button
            type="submit"
            onClick={handleApplicationCreation}
            className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
          >
            {loadingSubmit && (
              <CircularProgress size={19} style={{ color: "#fffff" }} />
            )}{" "}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}