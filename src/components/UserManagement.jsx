import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";
import DevelopmentTable from "./DevelopmentTable";
import {
  getUserByStatus,
  getApplicationsTotalNumber,
  getCourseByProgId,
  getAllSkills,
  getUserDataByProgramIdnSkillId,
} from "@/api/route";
import { CircularProgress } from "@mui/material";
import useClickOutside from "@/providers/useClickOutside";
import UserApprovalTable from "./UserApprovalTable";
import { toast } from "react-toastify";
import ApprovalUserModal from "./Modal/ApprovalUserModal";
import UserModal from "./Modal/UserModal";
import { FaArrowLeft } from "react-icons/fa";

const UserManagement = ({ heading, program, loadingProgram, goBack }) => {
  const { isSidebarOpen } = useSidebar();
  const [selectedOption, setSelectedOption] = useState("Student");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [programSection, setProgramSection] = useState(null);
  const [skillSection, setSkillSection] = useState(null);

  const [isProgramSectionOpen, setIsProgramSectionOpen] = useState(false);
  const [isSkillSectionOpen, setIsSkillSectionOpen] = useState(false);
  const [programID, setPorgramID] = useState(null);
  const [userByProgramID, setUserByProgramID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvedRequest, setApprovedRequest] = useState(null);
  const [verifiedRequest, setverfiedRequest] = useState(null);
  const [unverifiedRequest, setUnverifiedRequest] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [shortListRequest, setShortlisted] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setCourseName] = useState("");
  const [approvedProgramID, setapprovedProgramID] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [applications, setApplications] = useState([]);
  const [locations, setLocations] = useState([]);
  const [userPrograms, setUserPrograms] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userID, setUserID] = useState("");
  const [modal, setModal] = useState(false);

  const dropdownRef = useRef(null);
  const dropButton = useRef(null);
  const dropProgram = useRef(null);
  const dropStatus = useRef(null);
  const statusButton = useRef(null);
  useClickOutside(dropdownRef, dropButton, () => setIsOpen(false));
  useClickOutside(dropProgram, () => setIsProgramSectionOpen(false));
  useClickOutside(dropStatus, statusButton, () => setStatusOpen(false));

  useEffect(() => {
    const handleApprovedUsers = async () => {
      setMessage("");
      setUsers([]);
      setApplications([]);
      setLocations([]);
      setCount(0);
      if (approvedProgramID !== null) {
        try {
          setLoadingUsers(true);
          const response = await getUserDataByProgramIdnSkillId(
            approvedProgramID,
            selectedOption.toLowerCase()
          );

          if (
            response.data.status_code === 200 &&
            response.data.data.data.length > 0
          ) {
            setApplications(
              response?.data?.data.data.map((data) => data.application)
            );
            setLocations(
              response?.data?.data.data.map((data) => data.location)
            );
            setUserSkills(response?.data?.data.data.map((data) => data.skills));
            setUserPrograms(
              response?.data?.data.data.map((data) => data.program)
            );
            setUsers(response?.data?.data.data.map((data) => data.user));
            setCount(response?.data?.data.count);
          } else {
            setMessage("no data found");
          }
        } catch (error) {
          setMessage("no data found");
        } finally {
          setLoadingUsers(false);
        }
      }
    };
    if (heading === "Verified Users") {
      handleApprovedUsers();
    }
  }, [approvedProgramID, selectedOption, heading]);

  useEffect(() => {
    const handleGetAllSkills = async () => {
      setLoadingSkills(true);
      try {
        const response = await getAllSkills();
        // //console.log("skills", response?.data);
        setSkills(response?.data);
        setLoadingSkills(false);
      } catch (error) {
        //console.log("error in skills", error);
        setLoadingSkills(false);
      }
    };
    if (selectedOption.toLowerCase() !== "student") {
      handleGetAllSkills(); // Fetch skills only when selectedOption is not 'student'
    }
  }, [selectedOption]);

  useEffect(() => {
    // //console.log("userUpdate", statusUpdated);
    setMessage("");
    setUserByProgramID([]);
    if (programID) {
      setLoading(true);
      const handleUserByStatus = async () => {
        try {
          const response = await getUserByStatus(
            programID,
            selectedOption.toLowerCase(),
            selectedStatus
          );
          setUserByProgramID(response?.data?.data);
          setLoading(false);
        } catch (error) {
          //console.log(error);
          if (error.response.status === 404) {
            setMessage("no data found");
          }
          setLoading(false);
        }
      };

      handleUserByStatus();
    }
  }, [programID, selectedStatus, selectedOption, statusUpdated]);

  useEffect(() => {
    const handleApplicationsNumber = async () => {
      setApprovedRequest(null);
      setverfiedRequest(null);
      setUnverifiedRequest(null);
      setPendingRequest(null);
      setShortlisted(null);
      try {
        const response = await getApplicationsTotalNumber(
          programID,
          selectedOption.toLowerCase()
        );
        // //console.log("numbers", response.data);
        setApprovedRequest(response?.data?.data.approved);
        setverfiedRequest(response?.data?.data.verified);
        setUnverifiedRequest(response?.data?.data.unverified);
        setPendingRequest(response?.data?.data.pending);
        setShortlisted(response?.data?.data.short_listed);
        // //console.log('short:',response?.data?.data.short_listed)
      } catch (error) {
        //console.log("error while fetching number of applications", error);
      }
    };
    if (programID && selectedOption) {
      handleApplicationsNumber();
    }
  }, [programID, selectedOption, statusUpdated]);

  const handleToggleSection = (section, id) => {
    // Assign ProgramID or approvedProgramID based on heading
    if (heading === "Applicants") {
      setPorgramID(id);
    } else {
      setapprovedProgramID(id);
    }

    // Logic for "student" (Programs section)
    if (selectedOption.toLowerCase() === "student") {
      if (programSection === section && isProgramSectionOpen) {
        // Close program section if it's already open
        setIsProgramSectionOpen(false);
        setProgramSection(null);
      } else {
        // Open the program section
        setProgramSection(section);
        setIsProgramSectionOpen(true);
      }
    }

    // Logic for "instructor" (Skills section)
    else {
      if (skillSection === section && isSkillSectionOpen) {
        // Close skill section if it's already open
        setIsSkillSectionOpen(false);
        setSkillSection(null);
      } else {
        // Open the skill section
        setSkillSection(section);
        setIsSkillSectionOpen(true);
      }
    }
  };

  const handletoggleCourse = (courseName) => {
    setCourseName(courseName);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setIsProgramSectionOpen(false);
    setProgramSection(null);
    setSkillSection(null);
    setIsSkillSectionOpen(false);
  };

  const toggleStatusOpen = (e) => {
    e.stopPropagation();
    setStatusOpen((prev) => !prev);
  };

  const handleStatusSelect = (option) => {
    setSelectedStatus(option);
    setStatusOpen(false);
  };

  const status = ["pending", "approved", "short_listed"];
  const statusDisplayMap = {
    pending: "Pending",
    approved: "Approved",
    short_listed: "Shortlisted",
  };

  const options = ["Student", "Instructor"];

  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-22 font-inter ${
          isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 sm:px-5 px-4"
        }`}
        style={{
          paddingBottom: "24px",
          width: isSidebarOpen ? "81%" : "100%",
          height: "100vh", // Set the height to full screen
          overflow: "hidden", // Hide any overflow from the parent container
        }}
      >
        <div
          className="bg-surface-100 rounded-xl space-y-4"
          style={{
            height: "100%", // Fill the remaining height
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="w-full flex items-center justify-between mb-4 p-6 pb-0">
            <div className="flex">
              <div
                className="text-dark-400 flex gap-2 items-center cursor-pointer hover:text-blue-300 mr-4"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
                {/* <p>Back</p> */}
              </div>
              <p className="text-xl font-bold text-blue-500">{heading}</p>
            </div>
            <div className="relative  ">
              <button
                ref={dropButton}
                onClick={toggleOpen}
                className="flex justify-between sm:text-base text-sm z-50 items-center xsm:w-[200px] w-full gap-1 md:w-[200px] text-dark-500 hover:text-[#0e1721] px-4 py-3 text-left bg-white border  border-dark-500 rounded-lg  focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-300 ease-in-out"
              >
                {selectedOption || options[0]}
                <span
                  className={`${
                    isOpen ? "rotate-180 duration-300" : "duration-300"
                  }`}
                >
                  <IoIosArrowDown />
                </span>
              </button>

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute capitalize z-50 p-2 w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                >
                  {options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className=" cursor-pointer "
                    >
                      <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                        {option}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="my-5  max-h-screen overflow-auto  scrollbar-webkit">
            <div
              className=" space-y-3 p-6 pt-0"
              style={{
                flexGrow: 1, // Allow this section to grow and take up remaining space
              }}
            >
              {loadingProgram ? (
                <div className="w-full h-full flex items-center justify-center">
                  <CircularProgress />
                </div>
              ) : selectedOption.toLowerCase() === "student" ? (
                program && program.length > 0 ? (
                  // Display Program Logic
                  program.map((program) => (
                    <div
                      className="border border-dark-300 w-full  px-4 rounded-lg cursor-pointer flex flex-col "
                      key={program.id}
                    >
                      <div
                        className={`${
                          isProgramSectionOpen &&
                          programSection === program.name
                            ? "flex xsm:flex-row flex-col "
                            : "flex justify-between"
                        }  space-y-2  items-center`}
                      >
                        <div
                          className={`${
                            isProgramSectionOpen &&
                            programSection === program.name
                              ? "py-0 pt-4"
                              : "py-4"
                          } flex gap-3 text-[17px] text-blue-500 capitalize font-semibold font-exo w-full`}
                          onClick={() =>
                            handleToggleSection(program.name, program.id)
                          }
                        >
                          {program.name}
                          <div
                            className="mt-1 text-[12px] text-blue-300 font-bold"
                            title={`number of ${selectedStatus} applications`}
                          >
                            {(loading || loadingUsers) &&
                            programSection === program.name ? (
                              <div>
                                <CircularProgress size={12} />
                              </div>
                            ) : heading === "Applicants" &&
                              isProgramSectionOpen &&
                              programSection === program.name ? (
                              selectedStatus === "pending" ? (
                                <p>( {pendingRequest} )</p>
                              ) : selectedStatus === "approved" ? (
                                <p className="tracking-wide flex gap-2">
                                  <span>( {approvedRequest} )</span>
                                  <span>
                                    (verified: {verifiedRequest}, unverified:{" "}
                                    {unverifiedRequest})
                                  </span>
                                </p>
                              ) : (
                                <p>( {shortListRequest} )</p>
                              )
                            ) : (
                              isProgramSectionOpen &&
                              programSection === program.name && (
                                <p>( {count} )</p>
                              )
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {heading === "Applicants" &&
                            isProgramSectionOpen &&
                            programSection === program.name && (
                              <div className="relative z-20">
                                <button
                                  ref={statusButton}
                                  onClick={toggleStatusOpen}
                                  className="flex justify-between z-30 items-center nsm:w-[200px] xsm:w-full w-[200px] gap-1 text-dark-500 hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border border-dark-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-300 ease-in-out"
                                >
                                  {/* {selectedStatus || status[0]} */}
                                  {selectedStatus
                                    ? statusDisplayMap[selectedStatus]
                                    : statusDisplayMap[status[0]]}
                                  <span
                                    className={`${
                                      statusOpen
                                        ? "rotate-180 duration-300"
                                        : "duration-300"
                                    }`}
                                  >
                                    <IoIosArrowDown />
                                  </span>
                                </button>

                                {statusOpen && (
                                  <div
                                    ref={dropStatus}
                                    className="absolute z-40 p-2  w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                                  >
                                    {Object.entries(statusDisplayMap).length >
                                    0 ? (
                                      Object.entries(statusDisplayMap).map(
                                        ([key, value], index) => (
                                          <div
                                            key={index}
                                            onClick={() =>
                                              handleStatusSelect(key)
                                            }
                                            className="cursor-pointer"
                                          >
                                            <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                                              {value}{" "}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <div>No status available</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                          <span
                            className={`${
                              isProgramSectionOpen &&
                              programSection === program.name
                                ? "rotate-180 duration-300"
                                : "duration-300"
                            }`}
                          >
                            <IoIosArrowDown onClick={handleToggleSection} />
                          </span>
                        </div>
                      </div>
                      <div
                        className={`transition-container ${
                          isProgramSectionOpen &&
                          programSection === program.name
                            ? "max-height-full"
                            : "max-height-0"
                        }`}
                      >
                        {isProgramSectionOpen &&
                          programSection === program.name && (
                            <div className="pb-4 pt-2">
                              {heading === "Applicants" ? (
                                <DevelopmentTable
                                  loading={loading}
                                  selectedStatus={selectedStatus}
                                  selectedOption={selectedOption.toLowerCase()}
                                  userByProgramID={userByProgramID}
                                  message={message}
                                  setStatusUpdated={setStatusUpdated}
                                  statusUpdated={statusUpdated}
                                  setModal={setModal}
                                  setSelectedUser={setSelectedUser}
                                />
                              ) : (
                                <UserApprovalTable
                                  loadingUsers={loadingUsers}
                                  selectedOption={selectedOption.toLowerCase()}
                                  applications={applications}
                                  locations={locations}
                                  userPrograms={userPrograms}
                                  userSkills={userSkills}
                                  users={users}
                                  message={message}
                                  count={count}
                                  approvedProgramID={approvedProgramID}
                                  setSelectedUser={setSelectedUser}
                                  setUserID={setUserID}
                                  setModal={setModal}
                                />
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-dark-300 text-center">
                    No programs found
                  </div>
                )
              ) : // Display Skills Logic
              loadingSkills ? (
                <div className="w-full h-full flex items-center justify-center">
                  <CircularProgress />
                </div>
              ) : skills && skills.length > 0 ? (
                skills.map((skill) => (
                  <div
                    className="border border-dark-300 w-full px-4 rounded-lg cursor-pointer flex flex-col"
                    key={skill.id}
                  >
                    <div className="flex nsm:flex-row flex-col space-y-2 justify-between items-center">
                      <div
                        className="flex gap-3 text-blue-500 text-[17px] p-4 font-semibold font-exo w-full capitalize"
                        onClick={() =>
                          handleToggleSection(skill.name, skill.id)
                        }
                      >
                        {skill.name}
                        <div
                          className="mt-1 text-[12px] text-blue-300 font-bold"
                          title={`number of ${selectedStatus} applications`}
                        >
                          {(loading || loadingUsers) &&
                          skillSection === skill.name ? (
                            <div>
                              <CircularProgress size={12} />
                            </div>
                          ) : heading === "Applicants" &&
                            isSkillSectionOpen &&
                            skillSection === skill.name ? (
                            selectedStatus === "pending" ? (
                              <p>( {pendingRequest} )</p>
                            ) : selectedStatus === "approved" ? (
                              <p className="tracking-wide flex gap-2">
                                <span>( {approvedRequest} )</span>
                                <span>
                                  (verified: {verifiedRequest}, unverified:{" "}
                                  {unverifiedRequest})
                                </span>
                              </p>
                            ) : (
                              <p>( {shortListRequest} )</p>
                            )
                          ) : (
                            isSkillSectionOpen &&
                            skillSection === skill.name && <p>( {count} )</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {heading === "Applicants" &&
                          isSkillSectionOpen &&
                          skillSection === skill.name && (
                            <div className="relative z-20">
                              <button
                                ref={statusButton}
                                onClick={toggleStatusOpen}
                                className="flex justify-between z-30 items-center w-[200px] text-dark-500 hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border border-dark-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 transition duration-300 ease-in-out"
                              >
                                {/* {selectedStatus || status[0]} */}
                                {selectedStatus
                                  ? statusDisplayMap[selectedStatus]
                                  : statusDisplayMap[status[0]]}
                                <span
                                  className={`${
                                    statusOpen
                                      ? "rotate-180 duration-300"
                                      : "duration-300"
                                  }`}
                                >
                                  <IoIosArrowDown />
                                </span>
                              </button>

                              {statusOpen && (
                                <div
                                  ref={dropStatus}
                                  className="absolute capitalize p-2 z-40 w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                                >
                                  {Object.entries(statusDisplayMap).length >
                                  0 ? (
                                    Object.entries(statusDisplayMap).map(
                                      ([key, value], index) => (
                                        <div
                                          key={index}
                                          onClick={() =>
                                            handleStatusSelect(key)
                                          }
                                          className=" cursor-pointer"
                                        >
                                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                                            {value}{" "}
                                          </div>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div>No status available</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                        <span
                          className={`${
                            isSkillSectionOpen && skillSection === skill.name
                              ? "rotate-180 duration-300"
                              : "duration-300"
                          }`}
                        >
                          <IoIosArrowDown onClick={handleToggleSection} />
                        </span>
                      </div>
                    </div>
                    <div
                      className={`transition-container ${
                        isSkillSectionOpen && skillSection === skill.name
                          ? "max-height-full"
                          : "max-height-0"
                      }`}
                    >
                      {isSkillSectionOpen && skillSection === skill.name && (
                        <div className="pb-4">
                          {heading === "Applicants" ? (
                            <DevelopmentTable
                              loading={loading}
                              selectedStatus={selectedStatus}
                              selectedOption={selectedOption.toLowerCase()}
                              userByProgramID={userByProgramID}
                              setStatusUpdated={setStatusUpdated}
                              statusUpdated={statusUpdated}
                              setModal={setModal}
                              setSelectedUser={setSelectedUser}
                            />
                          ) : (
                            <UserApprovalTable
                              loadingUsers={loadingUsers}
                              selectedOption={selectedOption.toLowerCase()}
                              applications={applications}
                              locations={locations}
                              userPrograms={userPrograms}
                              userSkills={userSkills}
                              users={users}
                              message={message}
                              count={count}
                              approvedProgramID={approvedProgramID}
                              setSelectedUser={setSelectedUser}
                              setUserID={setUserID}
                              setModal={setModal}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-dark-300 text-center">No skills found</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        {heading === "Verified Users"
          ? modal &&
            selectedUser && (
              <ApprovalUserModal
                selectedOption={selectedOption.toLowerCase()}
                setModal={setModal}
                firstName={selectedUser.first_name}
                lastName={selectedUser.last_name}
                email={selectedUser.email}
                resume={selectedUser.resume}
                status={selectedUser.application_status}
                id={userID}
              />
            )
          : modal &&
            selectedUser && (
              <UserModal
                selectedOption={selectedOption.toLowerCase()}
                setModal={setModal}
                modal={modal}
                firstName={selectedUser.first_name}
                lastName={selectedUser.last_name}
                dob={selectedUser.date_of_birth}
                city={selectedUser.city || "-"}
                email={selectedUser.email}
                contact={selectedUser.contact || "-"}
                status={selectedUser.application_status}
                approvedStatus={selectedUser.account_status}
                location={selectedUser.location}
                program={selectedUser.program}
                experience={selectedUser.years_of_experience}
                resume={selectedUser.resume}
                skill={selectedUser.skill}
                id={selectedUser.id}
                setStatusUpdated={setStatusUpdated}
                statusUpdated={statusUpdated}
              />
            )}
      </div>
    </>
  );
};

export default UserManagement;
