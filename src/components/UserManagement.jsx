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

const UserManagement = ({ heading, program, loadingProgram }) => {
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

  const dropdownRef = useRef(null);
  const dropProgram = useRef(null);
  const dropStatus = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));
  useClickOutside(dropProgram, () => setIsProgramSectionOpen(false));
  useClickOutside(dropStatus, () => setStatusOpen(false));

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


          if (response.data.status_code === 200 && response.data.data.data.length > 0) {

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

            // console.log(response?.data?.data?.[0].?id)
            setLoadingUsers(false);
          }  else {
            setMessage("no data found");
            setLoadingUsers(false);
          }
          console.log("response from both idss", response.data);
        } catch (error) {
          console.log("error is occuring while both", error);
          // setMessage(response.data.message);
          setMessage("no data found");

          setLoadingUsers(false);
        }
      }
    };
    if (heading === "Verified Users") {
      handleApprovedUsers();
    }
  }, [approvedProgramID, selectedOption]);

  useEffect(() => {
    const handleGetAllSkills = async () => {
      setLoadingSkills(true);
      try {
        const response = await getAllSkills();
        // console.log("skills", response?.data);
        setSkills(response?.data);
        setLoadingSkills(false);
      } catch (error) {
        console.log("error in skills", error);
        setLoadingSkills(false);
      }
    };
    if (selectedOption.toLowerCase() !== "student") {
      handleGetAllSkills(); // Fetch skills only when selectedOption is not 'student'
    }
  }, [selectedOption.toLowerCase(), selectedOption]);

  useEffect(() => {
    // console.log("userUpdate", statusUpdated);
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
          console.log(error);
          if (error.response.status === 404) {
            setMessage("no data found");
          }
          setLoading(false);
        }
      };
      handleUserByStatus();
    }
  }, [programID, selectedOption, selectedStatus, statusUpdated]);

  useEffect(() => {
    const handleApplicationsNumber = async () => {
      try {
        const response = await getApplicationsTotalNumber(
          programID,
          selectedOption.toLowerCase()
        );
        // console.log("numbers", response.data);
        setApprovedRequest(response?.data?.data.approved);
        setverfiedRequest(response?.data?.data.verified);
        setUnverifiedRequest(response?.data?.data.unverified);
        setPendingRequest(response?.data?.data.pending);
        setShortlisted(response?.data?.data.short_listed);
        // console.log('short:',response?.data?.data.short_listed)
      } catch (error) {
        console.log("error while fetching number of applications", error);
      }
    };
    handleApplicationsNumber();
  }, [selectedStatus, programID, selectedOption, statusUpdated]);

  useEffect(() => {
    const handleCoursesByPrograms = async () => {
      setLoadingCourses(true);
      try {
        const response = await getCourseByProgId(programID);
        // console.log("courses res", response?.data?.data);
        setCourses(response?.data?.data.map((course) => course.name));
        setLoadingCourses(false);
      } catch (error) {
        console.log("Courses fetching error", error.response);
        setLoadingCourses(false);
      }
    };
    handleCoursesByPrograms();
  }, [programID]);

  // console.log('courses Name', courses)

  const handleToggleSection = (section, id) => {
   
    if (heading === "Applicants") {
      setPorgramID(id);
    } else {
      setapprovedProgramID(id);
    }
    if (selectedOption.toLowerCase() === "student") {
      setProgramSection(section);
      setIsProgramSectionOpen(true);
    } else {
      setSkillSection(section);
      setIsSkillSectionOpen(true);
    }
  };

  const handletoggleCourse = (courseName) => {
    setCourseName(courseName);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleStatusOpen = (e) => {
    e.stopPropagation();
    setStatusOpen(!statusOpen);
  };

  const handleStatusSelect = (option) => {
    setSelectedStatus(option);
    setStatusOpen(false);
  };

  const status = ["pending", "approved", "short_listed"];
  const statusDisplayMap = {
    pending: "Pending",
    approved: "Approved",
    short_listed: "Short Listed",
  };

  const options = ["Student", "Instructor"];

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        paddingBottom: "24px",
        width: isSidebarOpen ? "81%" : "100%",
        height: "100vh", // Set the height to full screen
        overflow: "hidden", // Hide any overflow from the parent container
      }}
    >
      <div
        className="bg-surface-100 p-6 rounded-xl space-y-4"
        style={{
          height: "100%", // Fill the remaining height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <p className="text-xl font-bold">{heading}</p>
        </div>
        <div className="w-full flex items-center gap-4">
          {/* <div className="flex grow">
            <input
              type="text"
              placeholder="Search program by names"
              className="p-3 sm:text-base text-sm border border-[#92A7BE] rounded-lg outline-none w-full"
            />
          </div> */}
          {/* <p><Se></Se></p> */}
          <div className="w-full flex justify-end items-start">
            <button
              onClick={toggleOpen}
              className="flex justify-between sm:text-base text-sm z-50 items-center w-full gap-1 md:w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-3 text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedOption || options[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute capitalize z-50 w-fit md:w-[200px] mt-14 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="p-2 cursor-pointer "
                  >
                    <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          className="my-5 space-y-3 max-h-screen overflow-auto  scrollbar-webkit"
          style={{
            flexGrow: 1, // Allow this section to grow and take up remaining space
          }}
        >
          {
            loadingProgram ? (
              <div className="w-full h-full flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : selectedOption.toLowerCase() === "student" ? (
              program && program.length > 0 ? (
                // Display Program Logic
                program.map((program) => (
                  <div
                    className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col"
                    key={program.id}
                  >
                    <div
                      className="flex nsm:flex-row flex-col space-y-2 justify-between items-center"
                      onClick={() =>
                        handleToggleSection(program.name, program.id)
                      }
                    >
                      <div className="flex gap-3 text-[17px] font-semibold font-exo">
                        {program.name}
                        <div
                          className="mt-1 text-[12px] text-blue-300 font-bold"
                          title={`number of ${selectedStatus} applications`}
                        >
                          {heading === "Applicants" &&
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
                            <div className="z-20">
                              <button
                                onClick={toggleStatusOpen}
                                className="flex justify-between z-30 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                              >
                                {/* {selectedStatus || status[0]} */}
                                {selectedStatus
                                  ? statusDisplayMap[selectedStatus]
                                  : statusDisplayMap[status[0]]}
                                <span className="">
                                  <IoIosArrowDown />
                                </span>
                              </button>

                              {statusOpen && (
                                <div
                                  ref={dropStatus}
                                  className="absolute  z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
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
                                          className="p-2 cursor-pointer"
                                        >
                                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
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

                        <span className="">
                          <IoIosArrowDown />
                        </span>
                      </div>
                    </div>
                    <div
                      className={`transition-container ${
                        isProgramSectionOpen && programSection === program.name
                          ? "max-height-full"
                          : "max-height-0"
                      }`}
                    >
                      {isProgramSectionOpen &&
                        programSection === program.name && (
                          <div className="mt-2">
                            {heading === "Applicants" ? (
                              <DevelopmentTable
                                loading={loading}
                                selectedStatus={selectedStatus}
                                selectedOption={selectedOption.toLowerCase()}
                                userByProgramID={userByProgramID}
                                message={message}
                                setStatusUpdated={setStatusUpdated}
                                statusUpdated={statusUpdated}
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
              <div className="text-dark-300 text-center">Loading skills...</div>
            ) : skills && skills.length > 0 ? (
              skills.map((skill) => (
                <div
                  className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col"
                  key={skill.id}
                >
                  <div
                    className="flex nsm:flex-row flex-col space-y-2 justify-between items-center"
                    onClick={() => handleToggleSection(skill.name, skill.id)}
                  >
                    <div className="flex gap-3 text-[17px] font-semibold font-exo">
                      {skill.name}
                      <div
                        className="mt-1 text-[12px] text-blue-300 font-bold"
                        title={`number of ${selectedStatus} applications`}
                      >
                        {heading === "Applicants" &&
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
                          <div className="z-20">
                            <button
                              onClick={toggleStatusOpen}
                              className="flex justify-between z-30 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                            >
                              {/* {selectedStatus || status[0]} */}
                              {selectedStatus
                                ? statusDisplayMap[selectedStatus]
                                : statusDisplayMap[status[0]]}
                              <span className="">
                                <IoIosArrowDown />
                              </span>
                            </button>

                            {statusOpen && (
                              <div className="absolute capitalize z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
                                {Object.entries(statusDisplayMap).length > 0 ? (
                                  Object.entries(statusDisplayMap).map(
                                    ([key, value], index) => (
                                      <div
                                        key={index}
                                        onClick={() => handleStatusSelect(key)}
                                        className="p-2 cursor-pointer"
                                      >
                                        <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
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

                      <span className="">
                        <IoIosArrowDown />
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
                      <div className="mt-2">
                        {heading === "Applicants" ? (
                          <DevelopmentTable
                            loading={loading}
                            selectedStatus={selectedStatus}
                            selectedOption={selectedOption.toLowerCase()}
                            userByProgramID={userByProgramID}
                            setStatusUpdated={setStatusUpdated}
                            statusUpdated={statusUpdated}
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
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-dark-300 text-center">No skills found</div>
            )
            // : (
            //   program &&
            //   program.length > 0 &&
            //   program.map((program) => (
            //     <div
            //       className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col"
            //       key={program.id}
            //     >
            //       {/* Program Section */}
            //       <div
            //         className="flex flex-col space-y-2"
            //         onClick={() => handleToggleSection(program.name, program.id)}
            //       >
            //         <div className="flex gap-3 text-[17px] font-semibold font-exo">
            //           {program.name}
            //           {/* Number of Applications by Status */}
            //           {openSection === program.name && (
            //             <div
            //               className="mt-1 text-[12px] text-blue-300 font-bold"
            //               title={`Number of ${selectedStatus} applications`}
            //             >
            //               {selectedStatus === "pending" ? (
            //                 <p>({pendingRequest})</p>
            //               ) : selectedStatus === "approved" ? (
            //                 <p>({approvedRequest})</p>
            //               ) : (
            //                 <p>({shortListRequest})</p>
            //               )}
            //             </div>
            //           )}
            //         </div>
            //       </div>

            //       {/* Courses Section */}
            //       {openSection === program.name && (
            //         <div className="mt-4">
            //           {loadingCourses ? (
            //             <div className="w-full h-full flex items-center justify-center">
            //               <CircularProgress />
            //             </div>
            //           ) : courses && courses.length > 0 ? (
            //             courses.map((course, index) => (
            //               <div
            //                 className={`${selectedCourse === course ? 'border-blue-300' : 'border-dark-300'} border border-b-0  w-full p-4 rounded-lg cursor-pointer flex flex-col`}
            //                 key={index}
            //               >
            //                 <div
            //                   className="flex nsm:flex-row flex-col space-y-2 justify-between items-center"
            //                   onClick={() => handletoggleCourse(course)}
            //                 >
            //                   <div className={`${selectedCourse === course && 'text-blue-300'} flex gap-3 text-[17px] font-semibold font-exo`}>
            //                     {course}
            //                   </div>
            //                   {/* Status Dropdown Button */}
            //                   {selectedCourse === course && (
            //                     <div className=" gap-2">
            //                       <button
            //                         onClick={toggleStatusOpen}
            //                         className="flex justify-between z-30 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            //                       >
            //                         {selectedStatus || status[0]}
            //                         <span>
            //                           <IoIosArrowDown />
            //                         </span>
            //                       </button>

            //                       {/* Status Dropdown Options */}
            //                       {statusOpen && (
            //                         <div className="absolute capitalize z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
            //                           {status.map((option, index) => (
            //                             <div
            //                               key={index}
            //                               onClick={() =>
            //                                 handleStatusSelect(option)
            //                               }
            //                               className="p-2 cursor-pointer"
            //                             >
            //                               <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
            //                                 {option}
            //                               </div>
            //                             </div>
            //                           ))}
            //                         </div>
            //                       )}
            //                     </div>
            //                   )}
            //                 </div>

            //                 {/* Development Table Section */}
            //                 {selectedCourse === course && (
            //                   <div
            //                     className={`transition-container ${
            //                       selectedCourse === course
            //                         ? "max-height-full"
            //                         : "max-height-0"
            //                     }`}
            //                   >
            //                     <div className="mt-2">
            //                       <DevelopmentTable
            //                         loading={loading}
            //                         selectedStatus={selectedStatus}
            //                         selectedOption={selectedOption}
            //                         userByProgramID={userByProgramID}
            //                         setStatusUpdated={setStatusUpdated}
            //                         statusUpdated={statusUpdated}
            //                       />
            //                     </div>
            //                   </div>
            //                 )}
            //               </div>
            //             ))
            //           ) : (
            //             <div className="text-dark-300 text-center">
            //               No courses found
            //             </div>
            //           )}
            //         </div>
            //       )}
            //     </div>
            //   ))
            // )
          }
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
