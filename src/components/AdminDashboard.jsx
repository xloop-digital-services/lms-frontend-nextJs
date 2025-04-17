"use client";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useRef, useState } from "react";
import BarChart from "@/components/BarChartProgram";
import PieChart from "@/components/PieChart";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";
import {
  DeleteBatch,
  getAllPrograms,
  getAllSkills,
  getApplicationsTotalNumber,
  getCityStatistics,
  getCourseByProgId,
  getCourseProgressByProgId,
  getProgramDetails,
  getProgramGraph,
  getProgramScores,
  getProgressForSession,
  listAllBatches,
  totalUsersCount,
} from "@/api/route";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";
import { FaMagnifyingGlass } from "react-icons/fa6";
import BatchUserModal from "./Modal/BatchUserModal";
import TopScoreTable from "./TopScoreTable";
import { FaList } from "react-icons/fa";
import TopScoreModal from "./Modal/TopScoreModal";
import BarChartCourse from "./BarChartCourse";
import Image from "next/image";
import users from '../../public/assets/img/users.png'
import students from '../../public/assets/img/students.png'
import instructor from '../../public/assets/img/instructor.png'

const AdminDashboard = () => {
  const { isSidebarOpen } = useSidebar();
  const [batches, setBatches] = useState([]);
  const [updateBatch, setUpdateBatch] = useState(false);
  const [loadingBatch, setloadingBatch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedBarProgram, setSelectedBarProgram] = useState("");
  const [selectedScoreProgram, setSelectedScoreProgram] = useState("");
  const [programId, setProgramId] = useState(null);
  const [barProgramId, setBarProgramId] = useState(null);
  const [scoreProgramId, setScoreProgramId] = useState(null);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isProgramSelected, setIsProgramSelected] = useState(false);
  const [isBarProgramOpen, setIsBarProgramOpen] = useState(false);
  const [isBarProgramSelected, setIsBarProgramSelected] = useState(false);
  const [isScoreProgramOpen, setIsScoreProgramOpen] = useState(false);
  const [isScoreProgramSelected, setIsScoreProgramSelected] = useState(false);
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
  const [loadingBar, setBarLoading] = useState(false);
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
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [programProgress, setProgramProgress] = useState([]);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [scores, setScores] = useState([]);
  const [openList, setOpenList] = useState(false);
  const [changeProgress, setChangeProgress] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [CourseProgress, setCourseProgress] = useState({});
  const [selectedBarCourse, setSelectedBarCourse] = useState();
  const [barCourseId, setBarCourseId] = useState(null);
  const [isBarCourseOpen, setIsBarCourseOpen] = useState(false);
  const [isBarCourseSelected, setIsBarCourseSelected] = useState(false);

  const dropdownRef = useRef(null);
  const dropButton = useRef(null);
  const barRef = useRef(null);
  const barButton = useRef(null);
  const scoreRef = useRef(null);
  const scoreButton = useRef(null);
  const statusDown = useRef(null);
  const statusButton = useRef(null);
  const userDown = useRef(null);
  const userButton = useRef(null);
  const skillDown = useRef(null);
  const skillButton = useRef(null);
  const courseButton = useRef(null);
  const courseDown = useRef(null);
  const barProgramRef = useRef(null);
  const barProgramBtnRef = useRef(null);

  const barCourseRef = useRef(null);
  const barCourseBtnRef = useRef(null);


  useClickOutside(statusDown, statusButton, () => setIsOpen(false));
  useClickOutside(dropdownRef, dropButton, () => setIsProgramOpen(false));
  useClickOutside(barRef, barButton, () => setIsBarProgramOpen(false));
  useClickOutside(courseDown, courseButton, () => setIsBarCourseOpen(false));
  useClickOutside(scoreRef, scoreButton, () => setIsScoreProgramOpen(false));
  useClickOutside(skillDown, skillButton, () => setIsSkillOpen(false));
  useClickOutside(userDown, userButton, () => setIsUserOpen(false));
  useClickOutside(barProgramRef, barProgramBtnRef, () => setIsBarProgramOpen(false));
  useClickOutside(barCourseRef, barCourseBtnRef, () => setIsBarCourseOpen(false));


  useEffect(() => {
    if (!selectedStatus) {
      setSelectedStatus("Show All");
    }

    const handleFilter = () => {
      let matchesSearchTerm = false;
      let matchesStatus = false;

      if (searchTerm.length === 0 && selectedStatus === "Show All") {
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

            return searchTermMatches && statusMatches;
          });

          setFilteredBatches(filteredData);
          setIsFilter(filteredData.length > 0);
        }
      }

      setFilterValue(matchesSearchTerm);
      setFilterStatus(matchesStatus);
    };

    handleFilter();
  }, [searchTerm, selectedStatus, batches]);

  const handleTotalUsers = async () => {
    try {
      const response = await totalUsersCount();
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
    }
  };

  const handleListingAllBatches = async () => {
    try {
      const response = await listAllBatches();
      // console.log("batches", response?.data);
      setBatches(response?.data);
      setloadingBatch(false);
    } catch (error) {
      // console.log("error while fetching the batches", error);
      setloadingBatch(false);
    }
  };

  // useEffect(() => {
  const handleBarChartForProgram = async () => {
    setBarLoading(true);
    try {
      const response = await getProgramGraph(barProgramId);
      if (response?.data) {
        setProgramProgress(response.data.data); // Adjust based on actual response structure
      } else {
        // console.error("Unexpected response format:", response);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setBarLoading(false);
    }
  };

  // }, [barProgramId]);


  const handleCourseByProgramId = async () => {
    try {
      const res = await getCourseByProgId(barProgramId);
      setCourseList(res.data.data);
      // console.log("course list", res.data.data);
    } catch (error) {
      // console.log("error in course", error);
    }
  };


  useEffect(() => {
    if (barProgramId) {
      handleCourseByProgramId();
      handleBarChartForProgram();
    }
  }, [barProgramId]);

  useEffect(() => {
    const handleCourseProgressBarChart = async () => {
      try {
        setBarLoading(true);
        const res = await getCourseProgressByProgId(barCourseId);
        // console.log("res", res);
        setCourseProgress(res?.data?.data);
        // console.log(barCourseId);
        // console.log("res.data.data", JSON.stringify(res.data.data, null, 2));
      } catch (error) {
        // console.log("error", error);
      } finally {
        setBarLoading(false);
      }
    };
    if (barCourseId && changeProgress == true) {
      handleCourseProgressBarChart();
    }
  }, [changeProgress, barCourseId]);

  useEffect(() => {
    const handleScores = async () => {
      try {
        setLoadingScore(true);
        const response = await getProgramScores(scoreProgramId);
        setScores(response.data.data);
      } catch (error) {
        // console.log("error", error);
      } finally {
        setLoadingScore(false);
      }
    };

    const handleModifiedScores = async () => {
      try {
        setLoadingScore(true);
        const response = await getProgramDetails(scoreProgramId);
        // console.log(response.data.data);
        setScores(response.data.data)
      } catch (error) {
        // console.log(error);
      } finally {
        setLoadingScore(false);
      }
    };

    if (scoreProgramId == 3) {
      handleModifiedScores();
    } else if (scoreProgramId) {
      handleScores();
    }
  }, [scoreProgramId]);

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
      // console.error("error while fetching the programs", err);
    }
  };

  const handleGetAllSkills = async () => {
    try {
      const response = await getAllSkills();
      // console.log("fetching skills", response.data);
      setAllSkills(response?.data);
      setLoading(false);
    } catch (error) {
      // console.log("error fetching the list of skills");
      setLoading(false);
    }
  };

  const toggleProgramOpen = () => {
    setIsProgramOpen((prev) => !prev);
  };
  const toggleBarProgramOpen = () => {
    setIsBarProgramOpen((prev) => !prev);
  };
  const toggleBarCourseOpen = () => {
    setIsBarCourseOpen((prev) => !prev);
  };
  const toggleScoreProgramOpen = () => {
    setIsScoreProgramOpen((prev) => !prev);
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
  const handleBarProgramSelect = (program) => {
    setSelectedBarProgram(program.name);
    setBarProgramId(program.id);
    setSelectedBarCourse("All Courses");
    setBarCourseId(null);
    setChangeProgress(false);
    setIsBarProgramOpen(false);
  };

  const handleBarCourseSelect = (course) => {
    setSelectedBarCourse(course === "All Courses" ? "All Courses" : course.name);
    setBarCourseId(course === "All Courses" ? null : course.id);
    setChangeProgress(course !== "All Courses");
    setIsBarCourseOpen(false);
  };

  const handleScoreProgramSelect = (option) => {
    setSelectedScoreProgram(option.name);
    setScoreProgramId(option.id);
    setIsScoreProgramSelected(true);
    setIsScoreProgramOpen(false);
  };

  const handleBarChartData = async () => {
    try {
      const response = await getCityStatistics();
      setBarData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedUser("Student");
    setIsUserSelected(true);
  }, []);

  useEffect(() => {
    if (allPrograms && allPrograms.length > 0) {
      setSelectedProgram(allPrograms[0].name);
      setSelectedBarProgram(allPrograms[0].name);
      setBarProgramId(allPrograms[0].id);
      setSelectedScoreProgram(allPrograms[0].name);
      setScoreProgramId(allPrograms[0].id);
      setProgramId(allPrograms[0].id);
      setIsProgramSelected(true);
      setIsBarProgramSelected(true);
      setIsScoreProgramSelected(true);
    }
    if (allSkills && allSkills.length > 0) {
      setSelectedSkill(allSkills[0].name);
      setSkillId(allSkills[0].id);
      setIsSkillSelected(true);
    }
  }, [allPrograms, allSkills]);

  useEffect(() => {
    if (changeProgress && courseList && courseList.length > 0) {
      setSelectedBarCourse(courseList[0].name);
      setBarCourseId(courseList[0].id);
      setIsBarCourseSelected(true);
    }
  }, [courseList, changeProgress]);
  useEffect(() => {
    const handleCourseByProgramId = async () => {
      try {
        const res = await getCourseByProgId(barProgramId);
        // console.log(barProgramId);
        const allOption = { id: null, name: "All Courses" };
        setCourseList([allOption, ...res?.data?.data]);
      } catch (error) {
        // console.log("error in course", error);
      }
    };

    if (barProgramId) {
      handleCourseByProgramId();
    }
  }, [barProgramId]);

  useEffect(() => {
    const handlePieChatData = async () => {
      try {
        let response;

        if (selectedUser.toLowerCase() === "student") {
          response = await getApplicationsTotalNumber(
            programId,
            selectedUser.toLowerCase()
          );
        } else if (selectedUser.toLowerCase() === "instructor") {
          response = await getApplicationsTotalNumber(
            skillId,
            selectedUser.toLowerCase()
          );
        }
        if (response) {
          setverfiedRequest(response?.data?.data.verified);
          setUnverifiedRequest(response?.data?.data.unverified);
          setPendingRequest(response?.data?.data.pending);
          setShortlisted(response?.data?.data.short_listed);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (selectedProgram && selectedUser.toLowerCase()) {
      setLoading(true);
      handlePieChatData();
    }
  }, [selectedProgram, programId, selectedSkill, skillId, selectedUser]);

  const toggleUsers = () => {
    setIsUserOpen((prev) => !prev);
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await DeleteBatch(selectedBatch);
      toast.success("Batch deleted successfully!");
      setUpdateBatch(!updateBatch);
      setConfirmDelete(false);
      setLoading(false);
    } catch (error) {
    }
  };

  const handleOpenList = () => {
    setOpenList(true);
  };

  const handleChangeProgressDetails = () => {
    setChangeProgress(!changeProgress);
  };


  return (
    <>
      <div
        className={`flex-1 transition-transform pt-[100px] space-y-4 max-md:pt-22 font-inter ${isSidebarOpen
          ? "translate-x-64 ml-20 "
          : "translate-x-0 xlg:pl-10 pl-4 pr-4"
          }`}
        style={{
          // paddingBottom: "20px",
          width: isSidebarOpen ? "81%" : "100%",
        }}
      >
        <div className="space-y-3 font-inter text-[rgb(7,34,77)]">
          <div className="flex flex-wrap gap-4 xmd:flex-nowrap">
            <div className="w-full xmd:w-1/3 bg-surface-100 rounded-t-xl rounded-b-md px-5 py-3 flex items-center border-b-8 border-b-[#0074EE]">
              <div className="bg-white rounded-lg p-1 flex flex-col gap-2 w-full">
                <div className="bg-[#ecf3fc] p-2 w-12 rounded-md">
                  <Image src={users} alt="instructors" className="w-8 h-8" />
                </div>
                <p className="mt-4 text-base text-[#07224D]">Active Users / Total Users</p>
                <p className="text-2xl font-bold text-[#022567] font-exo"> {allActiveUsers} / {allUsers}</p>
              </div>
            </div>

            <div className="w-full xmd:w-1/3 bg-surface-100 rounded-t-xl rounded-b-md px-5 py-3 flex items-center border-b-8 border-b-[#0074EE]">
              <div className="bg-white rounded-lg p-1 flex flex-col gap-2 w-full">
                <div className="bg-[#ecf3fc] p-2 w-12 rounded-md">
                  <Image src={instructor} alt="instructors" className="w-8 h-8" />
                </div>
                <p className="mt-4 text-base text-[#07224D]">Active Students/ Total Students</p>
                <p className="text-2xl font-bold text-[#022567] font-exo"> {allActiveStudents} / {allStudents}</p>
              </div>
            </div>

            <div className="w-full xmd:w-1/3 bg-surface-100 rounded-t-xl rounded-b-md px-5 py-3 flex items-center border-b-8 border-b-[#0074EE]">
              <div className="bg-white rounded-lg p-1 flex flex-col gap-2 w-full">
                <div className="bg-[#ecf3fc] p-2 w-12 rounded-md">
                  <Image src={students} alt="instructors" className="w-8 h-8" />
                </div>
                <p className="mt-4 text-base text-[#07224D]">Active Instructors/Total Instructors</p>
                <p className="text-2xl font-bold text-[#022567] font-exo"> {allActiveInstructors} / {allInstructors}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 xmd:flex-row flex-col">
            <div className="bg-surface-100 xmd:w-[66.5%] w-full overflow-x-auto scrollbar-webkit p-2 rounded-xl h-[420px] max-sm:h-[500px]">
              <div className="border border-dark-200 p-2 rounded-lg m-1">
                <div className="flex space-y-4 justify-between items-center mb-2 max-md:flex-col">
                  <div className="font-bold font-exo text-blue-500 text-lg">Progress
                  </div>
                  <div className="flex gap-4 max-md:flex-col items-center">
                    <div className="relative text-[15px] w-full" >
                      <button
                        onClick={toggleBarProgramOpen}
                        ref={barProgramBtnRef}
                        className="flex justify-between items-center w-[300px] px-4 py-2.5 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg hover:text-[#0e1721] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                      >
                        <span className="truncate capitalize">{selectedBarProgram || "Select Program"}</span>
                        <span className={`${isBarProgramOpen ? "rotate-180 duration-300" : "duration-300"}`}>
                          <IoIosArrowDown />
                        </span>
                      </button>

                      {isBarProgramOpen && (
                        <div ref={barProgramRef} className="absolute capitalize max-h-[182px] overflow-scroll z-50 w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out scrollbar-webkit">
                          <div className="cursor-pointer p-2">

                            {allPrograms.map((option, index) => (
                              <div
                                key={index}
                                onClick={() => handleBarProgramSelect(option)}
                                className="xlg:px-4 px-2 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg cursor-pointer"
                              >
                                {option.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedBarProgram && (
                      <div className="relative text-[15px] w-full" ref={barCourseRef}>
                        <button
                          ref={barCourseBtnRef}
                          onClick={toggleBarCourseOpen}
                          className="flex justify-between items-center w-[300px] px-4 py-2.5 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg hover:text-[#0e1721] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        >
                          <span className="truncate capitalize">{selectedBarCourse || "Select Course"}</span>
                          <span className={`${isBarCourseOpen ? "rotate-180 duration-300" : "duration-300"}`}>
                            <IoIosArrowDown />
                          </span>
                        </button>
                        {isBarCourseOpen && (
                          <div ref={barCourseRef} className="absolute capitalize z-50 max-h-[182px] overflow-scroll w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out scrollbar-webkit">
                            <div className="cursor-pointer p-2">
                              {courseList.map((course, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleBarCourseSelect(course)}
                                  className="xlg:px-4 px-2 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg cursor-pointer"
                                >
                                  {course.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {loadingBar ? (
                    <div className="flex justify-center items-center py-4 w-full h-[380px]">
                      <CircularProgress />
                    </div>
                  ) : selectedBarCourse === "All Courses" ? (
                    programProgress ? (
                      <BarChart barData={programProgress} />
                    ) : (
                      <div className="text-sm text-dark-400 flex justify-center items-center py-4 w-full h-[310px]">
                        <p>No Progress Found</p>
                      </div>
                    )
                  ) : CourseProgress && [
                    "classes_percentage",
                    "attendance_percentage",
                    "percentage_assignments",
                    "percentage_quizzes",
                    "percentage_projects",
                    "percentage_exams"
                  ].every((key) => CourseProgress[key] === 0) ? (
                    <div className="text-sm text-dark-400 flex justify-center items-center py-4 w-full h-[310px]">
                      <p>No Progress Found</p>
                    </div>
                  ) : (
                    <BarChartCourse barData={CourseProgress} />
                  )}

                </div>

              </div>
            </div>

            <div className="bg-surface-100 min-w-[32%] p-4 rounded-xl h-[420px] max-sm:h-[500px]">
              <div className="flex w-full xmd:flex-col ssm:flex-row flex-col justify-between xmd:items-start items-center">
                <h2 className="font-bold font-exo text-blue-500 text-lg">
                  Applications Status Overview
                </h2>
                <div className="flex gap-2  justify-between items-center w-full max-sm:flex-col">
                  <div className="relative w-full">
                    <button
                      ref={userButton}
                      onClick={toggleUsers}
                      className={`${!selectedUser ? "text-dark-500" : "text-[#424b55]"
                        } flex justify-between mt-1 items-center w-full gap-1 hover:text-[#0e1721] xlg:px-4 px-2 py-2 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                    >
                      {selectedUser || userOptions[0]}
                      <span
                        className={`${isUserOpen
                          ? "rotate-180 duration-300"
                          : "duration-300"
                          }`}
                      >
                        <IoIosArrowDown />
                      </span>
                    </button>

                    {isUserOpen && (
                      <div
                        ref={userDown}
                        className="absolute capitalize z-50 w-full mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                      >
                        {userOptions.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleUserSelect(option)}
                            className="p-2 cursor-pointer"
                          >
                            <div className="xlg:px-4 px-2 py-2 hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold rounded-lg">
                              {option}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedUser.toLowerCase() === "student" ? (
                    <div className={`${loading && "hidden"} relative w-full`}>
                      <button
                        ref={dropButton}
                        onClick={toggleProgramOpen}
                        className={`${!isProgramSelected
                          ? "text-dark-500"
                          : "text-[#424b55]"
                          } flex justify-between items-center w-full xlg:px-4 px-2    py-2 text-sm text-left bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                        style={{
                          // maxWidth: "220px", // Set the maximum width of the button
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span className=" xl:max-w-[190px] xlg:max-w-[120px] xmd:max-w-[60px] w-full truncate capitalize">
                          {selectedProgram}
                        </span>
                        <span
                          className={`${isProgramOpen
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
                                <div className="xlg:px-4 px-2 py-2 capitalize hover:bg-[#03a3d838] truncate hover:text-blue-300 hover:font-semibold rounded-lg">
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
                    <div className={`${loading && "hidden"} relative`}>
                      <button
                        ref={skillButton}
                        onClick={toggleSkillOpen}
                        className={`${!isSkillSelected ? " text-dark-500" : "text-[#424b55]"
                          } flex justify-between mt-1 items-center w-full gap-1 hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                      >
                        <span className="xl:max-w-[190px] xmd:max-w-[100px] w-[200px] truncate capitalize">
                          {selectedSkill}
                        </span>
                        <span
                          className={
                            isSkillOpen
                              ? "rotate-180 duration-300"
                              : "duration-300"
                          }
                        >
                          <IoIosArrowDown />
                        </span>
                      </button>

                      {isSkillOpen && (
                        <div
                          ref={skillDown}
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
                                <div className="xlg:px-4 px-2 py-2 capitalize hover:bg-[#03a3d838] truncate hover:text-blue-300 hover:font-semibold rounded-lg">
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
                  <div className="flex h-full mt-3 justify-center items-center">
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
          <div className="bg-[rgb(255,255,255)] rounded-xl px-5 py-4 pb-0 h-[230px]  xsm:mb-0 mb-4">
            <div className="flex nsm:items-center nsm:flex-row flex-col justify-between">
              <div className="">
                <h1 className="font-bold font-exo text-blue-500 text-lg sm:w-[200px] w-[180px] xlg:w-full">
                  Top Performers
                </h1>
              </div>
              <div className="flex gap-2 items-center max-sm:flex-col">
                <div>
                  <button
                    onClick={handleOpenList}
                    className="w-fit max-sm:w-full flex items-center gap-2 py-2 px-10 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    <span>View List</span>
                  </button>
                </div>
                <div>
                  <div className="relative space-y-2 text-[15px] w-full max-sm:w-full">
                    <button
                      ref={scoreButton}
                      onClick={toggleScoreProgramOpen}
                      className={`${!isScoreProgramSelected
                        ? " text-dark-500"
                        : "text-[#424b55]"
                        } flex justify-between items-center w-[300px] max-sm:w-full hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-surface-100 border  border-[#acc5e0] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
                    >
                      <span className="max-w-full truncate capitalize">
                        {selectedScoreProgram}
                      </span>
                      <span
                        className={`${isScoreProgramOpen
                          ? "rotate-180 duration-300"
                          : "duration-300"
                          }`}
                      >
                        <IoIosArrowDown />
                      </span>
                    </button>

                    {isScoreProgramOpen && (
                      <div
                        ref={scoreRef}
                        className="absolute z-20 w-full max-h-[120px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opaCity duration-300 ease-in-out"
                      >
                        {allPrograms.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleScoreProgramSelect(option)}
                            className="p-2 cursor-pointer"
                            title={option.name}
                          >
                            <div className="xlg:px-4 px-2 py-2 capitalize hover:bg-[#03a3d838] truncate hover:text-blue-300 hover:font-semibold rounded-lg">
                              {option.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <TopScoreTable
                scores={scores}
                loadingScore={loadingScore}
                showAll={openList}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {openInfoModal && (
          <BatchUserModal
            selectedBatch={selectedBatch}
            setOpenInfo={setOpenInfoModal}
          />
        )}
      </div>
      <div>
        {confirmDelete && (
          <DeleteConfirmationPopup
            setConfirmDelete={setConfirmDelete}
            handleDelete={handleDelete}
            field="batch"
          />
        )}
      </div>
      <div>
        {openList && (
          <TopScoreModal
            scores={scores}
            loadingScore={loadingScore}
            showAll={openList}
            setOpenList={setOpenList}
            title="program wise"
          />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
