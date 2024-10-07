"use client";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useRef, useState } from "react";
import BatchTable from "@/components/BatchTable";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";
import {
  getAllPrograms,
  getAllSkills,
  getApplicationsTotalNumber,
  getCityStatistics,
  listAllBatches,
  totalUsersCount,
} from "@/api/route";
import { CircularProgress } from "@mui/material";
import Link from "next/link";

const AdminDashboard = () => {
  const { isSidebarOpen } = useSidebar();
  const [batches, setBatches] = useState([]);
  const [updateBatch, setUpdateBatch] = useState(false);
  const [loadingBatch, setloadingBatch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programId, setProgramId] = useState(null);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillId, setSkillId] = useState(null);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isSkillSelected, setIsSkillSelected] = useState(false);
  const [verfiedRequest, setverfiedRequest] = useState(null);
  const [unverifiedRequest, setUnverifiedRequest] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [shortListRequest, setShortlisted] = useState(null);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [selectedUser, setSelectedUser] = useState("Select user");
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const options = ["Show All", "Active", "Inactive"];
  const [barData, setBarData] = useState([]);
  const [allUsers, setAllUsers] = useState(0);
  const [allStudents, setAllStudents] = useState(0);
  const [allInstructors, setAllIntructors] = useState(0);
  const [allActiveUsers, setAllActiveUsers] = useState(0);
  const [allActiveStudents, setAllActiveStudents] = useState(0);
  const [allActiveInstructors, setAllActiveInstructors] = useState(0);
  const [allInActiveUsers, setAllInActiveUsers] = useState(0);
  const [allInActiveStudents, setAllInActiveStudents] = useState(0);
  const [allInActiveInstructors, setAllInActiveInstructors] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [filterValue, setFilterValue] = useState(false);
  const [filterStatus, setFilterStatus] = useState(false);

  const dropdownRef = useRef(null);
  const statusDown = useRef(null);
  const userDown = useRef(null);

  useClickOutside(statusDown, () => setIsOpen(false));

  useClickOutside(
    dropdownRef,
    () => setIsProgramOpen(false),
    () => setIsSkillOpen(false)
  );
  useClickOutside(userDown, () => setIsUserOpen(false));

  // Apply filtering whenever search term or dropdown status changes
  useEffect(() => {
    // Set the initial status to "Show All" when the page loads
    if (!selectedStatus) {
      setSelectedStatus("Show All");
    }

    const handleFilter = () => {
      let matchesSearchTerm = false;
      let matchesStatus = false;

      if (searchTerm.length === 0 && selectedStatus === "Show All") {
        // If both filters are empty, show all batches
        setFilteredBatches(batches);
        setIsFilter(false);
      } else {
        if (searchTerm.length > 0 || selectedStatus) {
          const filteredData = batches.filter((batch) => {
            const searchTermMatches = batch.batch
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());

            const statusMatches =
              selectedStatus === "Show All" ||
              (selectedStatus === "Active" && batch.status === 1) ||
              (selectedStatus === "Inactive" && batch.status === 0);

            matchesSearchTerm = matchesSearchTerm || searchTermMatches;
            matchesStatus = matchesStatus || statusMatches;

            // Only return batches that match both the search term and status
            return searchTermMatches && statusMatches;
          });

          // If filtered data exists, show it; otherwise, set it to empty
          setFilteredBatches(filteredData);
          setIsFilter(filteredData.length > 0);
        }
      }

      setFilterValue(matchesSearchTerm);
      setFilterStatus(matchesStatus);
      // If no results match the filters, set these accordingly
    };

    // Trigger filtering when search term, status, or batches change
    handleFilter();
  }, [searchTerm, selectedStatus, batches]);

  const handleTotalUsers = async () => {
    try {
      const response = await totalUsersCount();
      console.log("total Counts", response?.data?.data);
      setAllUsers(response?.data?.data?.all_users_length);
      setAllIntructors(response?.data?.data?.instructor_user_length);
      setAllStudents(response?.data?.data?.student_user_length);
      setAllActiveUsers(response?.data?.data?.active_users_length);
      setAllInActiveUsers(response?.data?.data?.inactive_users_length);
      setAllActiveInstructors(response?.data?.data?.active_instructor_length);
      setAllInActiveInstructors(
        response?.data?.data?.inactive_instructor_length
      );
      setAllActiveStudents(response?.data?.data?.active_student_length);
      setAllInActiveStudents(response?.data?.data?.inactive_student_length);
    } catch (error) {
      console.log("error fetching the total users", error);
    }
  };

  const handleListingAllBatches = async () => {
    try {
      const response = await listAllBatches();
      // console.log("batches", response?.data);
      setBatches(response?.data);
      setloadingBatch(false);
    } catch (error) {
      console.log("error while fetching the batches", error);
      setloadingBatch(false);
    }
  };

  useEffect(() => {
    handleListingAllBatches();
  }, [updateBatch]);

  useEffect(() => {
    handleListingAllBatches();
    handleGetAllPrograms();
    handleGetAllSkills();
    handleBarChartData();
    handleTotalUsers();
  }, []);

  const handleGetAllPrograms = async () => {
    // setLoading(true)
    try {
      const response = await getAllPrograms();
      if (response?.data?.status_code === 200) {
        setAllPrograms(response?.data?.data || []);
        setLoading(false);
      }
      if (response?.data?.status_code === 404) {
        setLoading(false);
        toast.error(response?.data?.message);
        // console.log("ab aya error");
      }
    } catch (err) {
      setLoading(false);
      console.error("error while fetching the programs", err);
    }
  };

  const handleGetAllSkills = async () => {
    try {
      const response = await getAllSkills();
      console.log("fetching skills", response.data);
      setAllSkills(response?.data);
      setLoading(false);
    } catch (error) {
      console.log("error fetching the list of skills");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allPrograms && allPrograms.length > 0) {
      setSelectedProgram(allPrograms[0].name);
      setProgramId(allPrograms[0].id);
      setIsProgramSelected(true); // Set the first program's name as default
    }
    if (allSkills && allSkills.length > 0) {
      setSelectedSkill(allSkills[0].name);
      setSkillId(allSkills[0].id);
      setIsSkillSelected(true);
    }
  }, [allPrograms, allSkills]);

  const toggleProgramOpen = () => {
    setIsProgramOpen((prev) => !prev);
  };
  const toggleSkillOpen = () => {
    setIsSkillOpen((prev) => !prev);
  };

  const handleSkillSelect = (option) => {
    setSelectedSkill(option.name);
    setSkillId(option.id);
    setIsSkillSelected(true);
    setIsSkillOpen(false);
  };

  const handleProgramSelect = (option) => {
    setSelectedProgram(option.name);
    setProgramId(option.id);
    setIsProgramSelected(true);
    setIsProgramOpen(false);
  };

  useEffect(() => {
    const handlePieChatData = async () => {
      try {
        if (selectedUser.toLowerCase() === "student") {
          const response = await getApplicationsTotalNumber(
            programId,
            selectedUser.toLowerCase()
          );
          setverfiedRequest(response?.data?.data.verified);
          setUnverifiedRequest(response?.data?.data.unverified);
          setPendingRequest(response?.data?.data.pending);
          setShortlisted(response?.data?.data.short_listed);
        } else if (selectedUser.toLowerCase() === "instructor") {
          const response = await getApplicationsTotalNumber(
            skillId,
            selectedUser.toLowerCase()
          );
          setverfiedRequest(response?.data?.data.verified);
          setUnverifiedRequest(response?.data?.data.unverified);
          setPendingRequest(response?.data?.data.pending);
          setShortlisted(response?.data?.data.short_listed);
        }
        // console.log("numbers", response.data);

        setLoading(false);
      } catch (error) {
        console.log("error while fetching number of applications", error);
        setLoading(false);
      }
    };
    if (selectedProgram && selectedUser.toLowerCase()) {
      setLoading(true);
      handlePieChatData();
    }
  }, [
    selectedProgram,
    programId,
    selectedSkill,
    skillId,
    isUserSelected,
    // selectedUser.toLowerCase(),
    selectedUser,
  ]);

  const handleBarChartData = async () => {
    try {
      const response = await getCityStatistics();
      // console.log('bar chart', response?.data?.data)
      setBarData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      console.log("error while fetching the bar data", error);
      setLoading(false);
    }
  };

  const toggleUsers = () => {
    setIsUserOpen(true);
  };

  const handleUserSelect = (option) => {
    setSelectedUser(option);
    setIsUserOpen(false);
    setIsUserSelected(true);
  };

  const toggleOpen = () => {
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedStatus(option);
    setIsOpen(false);
    setIsSelected(true);
  };

  const userOptions = ["Student", "Instructor"];

  return (
    <div
      className={`flex-1 transition-transform pt-[100px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 ml-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "81%" : "100%",
      }}
    >
      <div className="text-[#07224D] flex flex-col gap-5">
        {/* <h2 className=" font-exo text-3xl font-bold">Admin Dashboard</h2> */}
        <div className="flex gap-5 flex-wrap xmd:flex-nowrap">
          <Link href="/user-management/users" className="w-full xmd:w-1/3">
            <div className="bg-[#ffffff] flex justify-between items-center px-5 py-4 rounded-xl cursor-pointer border-2 border-surface-100 hover:border-blue-300 duration-300">
              <div className="flex flex-col text-sm h-full justify-center items-center">
                Total Users
                <span className="text-xl font-semibold font-exo text-[#022567]">
                  {allUsers}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col text-[12px] justify-center items-center">
                  Active Users
                  <span className="text-base font-semibold font-exo text-[#022567]">
                    {allActiveUsers}
                  </span>
                </div>
                <div className="flex flex-col text-[12px] justify-center items-center">
                  Inactive Users
                  <span className="text-base font-semibold font-exo text-[#022567]">
                    {allInActiveUsers}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-[#ffffff] w-full xmd:w-1/3 flex justify-between items-center px-5 py-4 rounded-xl cursor-pointer border-2 border-surface-100 hover:border-blue-300 duration-300">
            <div className="flex flex-col text-sm h-full justify-center items-center">
              Total Students
              <span className="text-xl font-semibold font-exo text-[#022567]">
                {allStudents}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col text-[12px] justify-center items-center">
                Active Students
                <span className="text-base font-semibold font-exo text-[#022567]">
                  {allActiveStudents}
                </span>
              </div>
              <div className="flex flex-col text-[12px] justify-center items-center">
                Inactive Students
                <span className="text-base font-semibold font-exo text-[#022567]">
                  {allInActiveStudents}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#ffffff] w-full xmd:w-1/3 flex justify-between items-center px-5 py-4 rounded-xl cursor-pointer border-2 border-surface-100 hover:border-blue-300 duration-300">
            <div className="flex flex-col text-sm h-full justify-center items-center">
              Total Instructors
              <span className="text-xl font-semibold font-exo text-[#022567]">
                {allInstructors}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col text-[12px] justify-center items-center">
                Active Instructors
                <span className="text-base font-semibold font-exo text-[#022567]">
                  {allActiveInstructors}
                </span>
              </div>
              <div className="flex flex-col text-[12px] justify-center items-center">
                Inactive Instructors
                <span className="text-base font-semibold font-exo text-[#022567]">
                  {allInActiveInstructors}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 xmd:flex-row flex-col">
          <div className="bg-[#ffffff] xmd:w-[66.5%] w-full overflow-x-auto scrollbar-webkit p-5 rounded-xl  h-[450px]">
            <div className="border border-dark-300 rounded-xl p-3 h-full w-full">
              <div className="font-bold font-exo text-[#022567] text-lg pb-2">
                Capacity in Different Cities
              </div>
              <div>
                <BarChart barData={barData} />
              </div>
            </div>
          </div>
          <div className="bg-[#ffffff] min-w-[32%] p-4 rounded-xl  h-[450px]">
            <div className="flex w-full xmd:flex-col justify-between xmd:items-start items-center">
              <div className="font-bold font-exo text-[#022567] text-lg">
                Applications Status Overview
              </div>
              <div className="flex gap-2  justify-between items-center">
                <div className="relative">
                  <button
                    onClick={toggleUsers}
                    className={`${
                      !isUserSelected ? "text-[#92A7BE]" : "text-[#424b55]"
                    } flex justify-between mt-1 items-center xl:max-w-[200px] md:max-w-[170px] w-[240px]  gap-1 hover:text-[#0e1721] px-4 xlg:py-3  py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                  >
                    {selectedUser || userOptions[0]}
                    <span
                      className={`${
                        isUserOpen ? "rotate-180 duration-300" : "duration-300"
                      }`}
                    >
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isUserOpen && (
                    <div
                      ref={userDown}
                      className="absolute capitalize z-50 xl:max-w-[200px] md:max-w-[170px] w-[240px]  mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                    >
                      {userOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleUserSelect(option)}
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
                {selectedUser.toLowerCase() === "student" ? (
                  <div className={`${!isUserSelected && "hidden"} relative`}>
                    <button
                      onClick={toggleProgramOpen}
                      className={`${
                        !isProgramSelected ? "text-[#92A7BE]" : "text-[#424b55]"
                      } flex justify-between items-center w-full px-4 xlg:py-3  py-2 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                      style={{
                        // maxWidth: "220px", // Set the maximum width of the button
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <span className="xl:max-w-[190px] xmd:max-w-[100px] w-[200px] truncate">
                        {selectedProgram}
                      </span>
                      <span
                        className={`${
                          isProgramOpen
                            ? "rotate-180 duration-300"
                            : "duration-300"
                        } pl-1`}
                      >
                        <IoIosArrowDown />
                      </span>
                    </button>

                    {isProgramOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 mt-1  w-full  max-h-[240px] overflow-y-auto scrollbar-webkit  bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                        style={{
                          // maxWidth: "220px", // Set the maximum width of the button
                          whiteSpace: "nowrap",
                          // overflow: "hidden",
                          // textOverflow: "ellipsis",
                        }}
                      >
                        {allPrograms && allPrograms.length > 0 ? (
                          allPrograms.map((option, index) => (
                            <div
                              key={index}
                              onClick={() => handleProgramSelect(option)}
                              className="p-2 cursor-pointer"
                              title={option.name}
                            >
                              <div className="px-4 py-2 hover:bg-[#03a3d838] truncate hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                                {option.name}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[12px] text-dark-400 text-center p-1">
                            No Program found
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`${!isUserSelected && "hidden"} relative`}>
                    <button
                      onClick={toggleSkillOpen}
                      className={`${
                        !isSkillSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                      } flex justify-between mt-1 items-center w-full gap-1 hover:text-[#0e1721] px-4 xlg:py-3 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                    >
                      <span className="xl:max-w-[190px] xmd:max-w-[100px] w-[200px] truncate">
                        {selectedSkill}
                      </span>
                      <span className="">
                        <IoIosArrowDown />
                      </span>
                    </button>

                    {isSkillOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 mt-1 w-full max-h-[240px] overflow-y-auto scrollbar-webkit  bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                      >
                        {allSkills && allSkills.length > 0 ? (
                          allSkills.map((option) => (
                            <div
                              key={option.id}
                              onClick={() => handleSkillSelect(option)}
                              className="p-2 cursor-pointer"
                              title={option.name}
                            >
                              <div className="px-4 py-2 hover:bg-[#03a3d838] truncate hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                                {option.name}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[12px] text-dark-400 text-center p-1">
                            No Skill found
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              {loading ? (
                <div className="flex h-full mt-4 justify-center items-center">
                  <CircularProgress size={20} />
                </div>
              ) : selectedProgram &&
                selectedSkill &&
                selectedUser &&
                isUserSelected ? (
                verfiedRequest === 0 &&
                unverifiedRequest === 0 &&
                pendingRequest === 0 &&
                shortListRequest === 0 ? (
                  <div className="flex justify-center items-center text-dark-400 text-sm h-full mt-4">
                    No applications found
                  </div>
                ) : (
                  <div>
                    <PieChart
                      verified={verfiedRequest}
                      unverified={unverifiedRequest}
                      pending={pendingRequest}
                      shortlisted={shortListRequest}
                    />
                  </div>
                )
              ) : (
                <div className="flex justify-center items-center text-dark-400 text-sm h-full mt-4">
                  Select the user and the program to see the results
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[rgb(255,255,255)] rounded-xl p-5 pb-0 xmd:max-h-[260px] h-[240px] ">
          <div className="flex nsm:items-center nsm:flex-row flex-col ">
            <h1 className="font-bold font-exo  text-[#022567] text-lg sm:w-[200px] w-[180px]  xlg:w-full">
              <Link href="/batch" className="w-fit">
                Batch Details
              </Link>
            </h1>
            <div className="w-full flex items-center gap-4 ">
              <div className="flex-grow">
                {" "}
                {/* Ensure the container is growable */}
                <input
                  type="text"
                  placeholder="Search batch by names"
                  className="px-3 py-2 text-sm border border-[#92A7BE] rounded-lg outline-none w-full" // w-full ensures full width
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <button
                  onClick={toggleOpen}
                  className={` ${
                    !isSelected && !options[0]
                      ? " text-[#92A7BE]"
                      : "text-[#424b55]"
                  } flex justify-between text-sm gap-1 z-50 items-center w-full md:w-[200px] hover:text-[#0e1721] px-4 py-2 text-left bg-white border border-[#92A7BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedStatus || options[0]}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isOpen && (
                  <div
                    ref={statusDown}
                    className="absolute capitalize z-50 w-full md:w-[200px] max-h-[150px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {options.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="p-1 cursor-pointer"
                      >
                        <div className="px-4 py-1 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
                          {option}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xmd:max-h-[160px] max-h-[355px] mt-3 overflow-y-auto overflow-x-hidden scrollbar-webkit">
            {loadingBatch ? (
              <div className="flex justify-center items-center w-full h-full p-5">
                <CircularProgress size={20} />
              </div>
            ) : filteredBatches.length === 0 ? (
              <p className="text-center text-dark-300 pt-6">No batch found</p>
            ) : isFilter ? (
              <BatchTable
                batches={filteredBatches}
                loading={loadingBatch}
                setLoading={setloadingBatch}
                updateBatch={updateBatch}
                setUpdateBatch={setUpdateBatch}
              />
            ) : (
              <BatchTable
                batches={batches}
                loading={loadingBatch}
                setLoading={setloadingBatch}
                updateBatch={updateBatch}
                setUpdateBatch={setUpdateBatch}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
