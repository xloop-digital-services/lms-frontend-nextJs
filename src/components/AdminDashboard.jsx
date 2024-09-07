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
  getApplicationsTotalNumber,
  getCityStatistics,
  listAllBatches,
  totalUsersCount,
} from "@/api/route";
import { CircularProgress } from "@mui/material";

const AdminDashboard = () => {
  const { isSidebarOpen } = useSidebar();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programId, setProgramId] = useState(null);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const [approvedRequest, setApprovedRequest] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [shortListRequest, setShortlisted] = useState(null);
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
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsProgramOpen(false));

  const handleTotalUsers = async () => {
    try {
      const response = await totalUsersCount();
      console.log("total Counts", response?.data?.data);
      setAllUsers(response?.data?.data?.all_users_length);
      setAllIntructors(response?.data?.data?.instructor_user_length)
      setAllStudents(response?.data?.data?.student_user_length)
      setAllActiveUsers(response?.data?.data?.active_users_length)
      setAllInActiveUsers(response?.data?.data?.inactive_users_length)
      setAllActiveInstructors(response?.data?.data?.active_instructor_length)
      setAllInActiveInstructors(response?.data?.data?.inactive_instructor_length)
      setAllActiveStudents(response?.data?.data?.active_student_length)
      setAllInActiveStudents(response?.data?.data?.inactive_student_length)
    } catch (error) {
      console.log("error fetching the total users", error);
    }
  };

  const handleListingAllBatches = async () => {
    try {
      const response = await listAllBatches();
      // console.log("batches", response?.data);
      setBatches(response?.data);
      setLoading(false);
    } catch (error) {
      console.log("error while fetching the batches", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleListingAllBatches();
    handleGetAllPrograms();
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
        // console.log("ab aya error");
      }
    } catch (err) {
      setLoading(false);
      console.error("error while fetching the programs", err);
    }
  };

  useEffect(() => {
    if (allPrograms && allPrograms.length > 0) {
      setSelectedProgram(allPrograms[0].name);
      setProgramId(allPrograms[0].id);
      setIsProgramSelected(true); // Set the first program's name as default
    }
  }, [allPrograms]);

  const toggleProgramOpen = () => {
    setIsProgramOpen((prev) => !prev);
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
        const response = await getApplicationsTotalNumber(programId);
        // console.log("numbers", response.data);
        setApprovedRequest(response?.data?.data.approved);
        setPendingRequest(response?.data?.data.pending);
        setShortlisted(response?.data?.data.short_listed);
        setLoading(false);
      } catch (error) {
        console.log("error while fetching number of applications", error);
        setLoading(false);
      }
    };
    setLoading(true)
    handlePieChatData();
  }, [selectedProgram, programId, isProgramSelected]);

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

  const toggleOpen = () => {
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedStatus(option);
    setIsOpen(false);
    setIsSelected(true);
  };

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        // paddingBottom: "20px",
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="text-[#07224D] flex flex-col gap-5">
            <div className="flex gap-5">
              {" "}
              {/* Adding a unique key */}
              <div className="bg-[#ffffff] min-w-[32%] flex justify-between p-5 rounded-xl">
                <div className="flex flex-col text-sm h-full justify-center items-center">
                  Total Users
                  <span className="text-xl font-semibold font-exo text-[#32324D]">
                    {allUsers}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col text-[12px] justify-center items-center">
                    Active Users
                    <span className="text-base font-semibold font-exo text-[#32324D]">
                      {allActiveUsers}
                    </span>
                  </div>
                  <div className="flex flex-col text-[12px] justify-center items-center">
                    Inactive Users
                    <span className="text-base font-semibold font-exo text-[#32324D]">
                      {allInActiveUsers}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#ffffff] min-w-[32%] flex justify-between p-5 rounded-xl">
                <div className="flex flex-col text-sm h-full justify-center items-center">
                  Total Students
                  <span className="text-xl font-semibold font-exo text-[#32324D]">
                    {allStudents}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col text-[12px] justify-center items-center">
                    Active Students
                    <span className="text-base font-semibold font-exo text-[#32324D]">
                      {allActiveStudents}
                    </span>
                  </div>
                  <div className="flex flex-col text-[12px] justify-center items-center">
                    Inactive Students
                    <span className="text-base font-semibold font-exo text-[#32324D]">
                      {allInActiveStudents}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#ffffff] min-w-[32%] flex justify-between p-5 rounded-xl">
                <div className="flex flex-col text-sm h-full justify-center items-center">
                  Total Instructors
                  <span className="text-xl font-semibold font-exo text-[#32324D]">
                    {allInstructors}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col text-[12px] justify-center items-center">
                    Active Instructors
                    <span className="text-base font-semibold font-exo text-[#32324D]">
                      {allActiveInstructors}
                    </span>
                  </div>
                  <div className="flex flex-col text-[12px] justify-center items-center">
                    Inactive Instructors
                    <span className="text-base font-semibold font-exo text-[#32324D]">
                      {allInActiveInstructors}
                    </span>
                  </div>
                </div>
              </div>
            </div>


        <div className="flex gap-5 xmd:flex-row flex-col">
          <div className="bg-[#ffffff] xmd:w-[65.5%] w-full overflow-x-auto scrollbar-webkit p-5 rounded-xl  h-[450px]">
            <div className="border border-dark-300 rounded-xl p-3 h-full w-full">
              <div className="font-bold font-exo text-[#32324D] text-lg pb-2">
                Capacity in Different Cities
              </div>
              <div>
                <BarChart barData={barData} />
              </div>
            </div>
          </div>
          <div className="bg-[#ffffff] min-w-[32%] p-4 rounded-xl  h-[450px]">
            <div className="flex w-full justify-between items-center">
            <div className="font-bold font-exo text-[#32324D] text-lg">
              Applications Status
            </div>
            <div className="">
              <div>
                <button
                  onClick={toggleProgramOpen}
                  className={`${
                    !isProgramSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between mt-1 items-center  w-[200px] gap-1 hover:text-[#0e1721] px-4 xlg:py-3 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedProgram}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isProgramOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-30 mt-1 w-[200px] max-h-[200px] overflow-auto scrollbar-webkit  bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                  >
                    {allPrograms && allPrograms.length > 0 ? (
                      allPrograms.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleProgramSelect(option)}
                          className="p-2 cursor-pointer"
                        >
                          <div className="px-4 py-2 hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg">
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
            </div>
            </div>
            <div>
              {loading ? (
                <div className="flex h-full mt-4 justify-center items-center">
                  <CircularProgress size={20} />
                </div>
              ) : (
                <div>
                  <PieChart
                    approved={approvedRequest}
                    pending={pendingRequest}
                    shortlisted={shortListRequest}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] rounded-xl p-5">
          <div>
            <h1 className="font-bold font-exo text-[#32324D] text-lg ">
              Batch Details
            </h1>
            <div className="w-full flex items-center gap-4 mt-2">
              <div className="flex grow">
                <input
                  type="text"
                  placeholder="Search program by names"
                  className="p-3 text-sm border border-[#92A7BE] rounded-lg outline-none w-full"
                />
              </div>
              <div>
                <button
                  onClick={toggleOpen}
                  className={` ${
                    !isSelected ? " text-[#92A7BE]" : "text-[#424b55]"
                  } flex justify-between text-sm z-50 items-center w-full gap-1 md:w-[200px] hover:text-[#0e1721] px-4 py-3 text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                >
                  {selectedStatus || options[0]}
                  <span className="">
                    <IoIosArrowDown />
                  </span>
                </button>

                {isOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute capitalize z-50 w-fit md:w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
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
          </div>
          <BatchTable batches={batches} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
