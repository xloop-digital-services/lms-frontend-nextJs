"use client";
import { useSidebar } from "@/providers/useSidebar";
import React, { useEffect, useRef, useState } from "react";
import BatchTable from "@/components/BatchTable";
import BarChart from "@/components/BarChartProgram";
import BarChartCourse from "@/components/BarChartCourse";
import PieChart from "@/components/PieChart";
import TopScoreTable from "@/components/TopScoreTable";
import TopScoreModal from "./Modal/TopScoreModal";
import DeleteConfirmationPopup from "./Modal/DeleteConfirmationPopUp";
import BatchUserModal from "./Modal/BatchUserModal";
import {
  DeleteBatch,
  getAllPrograms,
  getAllSkills,
  getApplicationsTotalNumber,
  getProgramGraph,
  getCourseByProgId,
  getCourseProgressByProgId,
  getProgramScores,
  getProgramDetails,
  listAllBatches,
  totalUsersCount,
} from "@/api/route";
import useClickOutside from "@/providers/useClickOutside";
import { CircularProgress } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { FaList } from "react-icons/fa";

const AdminDashboard = () => {
  const { isSidebarOpen } = useSidebar();

  // === Top‑cards & batch list ===
  const [allUsers, setAllUsers] = useState(0);
  const [allActiveUsers, setAllActiveUsers] = useState(0);
  const [allStudents, setAllStudents] = useState(0);
  const [allActiveStudents, setAllActiveStudents] = useState(0);
  const [allInstructors, setAllInstructors] = useState(0);
  const [allActiveInstructors, setAllActiveInstructors] = useState(0);

  const [batches, setBatches] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(true);
  const [updateBatch, setUpdateBatch] = useState(false);

  // === Programs & Courses (Progress) ===
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedBarProgram, setSelectedBarProgram] = useState("Select Program");
  const [barProgramId, setBarProgramId] = useState(null);
  const [isBarProgramOpen, setIsBarProgramOpen] = useState(false);
  const [programProgress, setProgramProgress] = useState([]);
  const [loadingBar, setLoadingBar] = useState(false);

  const [courseList, setCourseList] = useState([]);
  const [selectedBarCourse, setSelectedBarCourse] = useState("All Courses");
  const [barCourseId, setBarCourseId] = useState(null);
  const [isBarCourseOpen, setIsBarCourseOpen] = useState(false);
  const [courseProgress, setCourseProgress] = useState({});

  function getBarSize(width) {
    if (width < 640)   return 30;  // mobile
    if (width < 1024)  return 50;  // tablet
    return 70;                     // desktop
  }
  function getBarGap(width) {
    if (width < 640)   return "10%";
    if (width < 1024)  return "15%";
    return "20%";
  }

  useEffect(() => {
    const onResize = () => {
      setBarSize(getBarSize(window.innerWidth));
      setBarGap(getBarGap(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


   // 1) Responsive barSize & barGap
   const [barSize, setBarSize] = useState(getBarSize(window.innerWidth));
   const [barGap, setBarGap]   = useState(getBarGap(window.innerWidth));

  // === Applications (Pie) ===
  const [allSkills, setAllSkills] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Student");
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Select Program");
  const [programId, setProgramId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState("Select Skill");
  const [skillId, setSkillId] = useState(null);
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [pieLoading, setPieLoading] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState(0);
  const [unverifiedRequest, setUnverifiedRequest] = useState(0);
  const [pendingRequest, setPendingRequest] = useState(0);
  const [shortlistedRequest, setShortlistedRequest] = useState(0);

  // === Top Performers ===
  const [scores, setScores] = useState([]);
  const [loadingScore, setLoadingScore] = useState(false);
  const [selectedScoreProgram, setSelectedScoreProgram] = useState("Select Program");
  const [scoreProgramId, setScoreProgramId] = useState(null);
  const [isScoreProgramOpen, setIsScoreProgramOpen] = useState(false);
  const [openList, setOpenList] = useState(false);

  // === Delete & Info Modals ===
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);

  // === Refs for click‑outside ===
  const barRef = useRef(null),
    barButton = useRef(null),
    courseRef = useRef(null),
    courseButton = useRef(null),
    userRef = useRef(null),
    userButton = useRef(null),
    progRef = useRef(null),
    progButton = useRef(null),
    skillRef = useRef(null),
    skillButton = useRef(null),
    scoreRef = useRef(null),
    scoreButton = useRef(null);

  useClickOutside(barRef, barButton, () => setIsBarProgramOpen(false));
  useClickOutside(courseRef, courseButton, () => setIsBarCourseOpen(false));
  useClickOutside(userRef, userButton, () => setIsUserOpen(false));
  useClickOutside(progRef, progButton, () => setIsProgramOpen(false));
  useClickOutside(skillRef, skillButton, () => setIsSkillOpen(false));
  useClickOutside(scoreRef, scoreButton, () => setIsScoreProgramOpen(false));

  // === Fetch totals & batches on mount ===
  useEffect(() => {
    totalUsersCount()
      .then(res => {
        const d = res.data.data;
        setAllUsers(d.all_users_length);
        setAllActiveUsers(d.active_users_length);
        setAllStudents(d.student_user_length);
        setAllActiveStudents(d.active_student_length);
        setAllInstructors(d.instructor_user_length);
        setAllActiveInstructors(d.active_instructor_length);
      });
    listAllBatches()
      .then(res => setBatches(res.data))
      .finally(() => setLoadingBatch(false));
  }, [updateBatch]);

  // === Fetch programs & skills on mount ===
  useEffect(() => {
    getAllPrograms().then(res => {
      setAllPrograms(res.data.data || []);
      if (res.data.data.length) {
        const first = res.data.data[0];
        setSelectedBarProgram(first.name);
        setBarProgramId(first.id);
        setSelectedProgram(first.name);
        setProgramId(first.id);
        setSelectedScoreProgram(first.name);
        setScoreProgramId(first.id);
      }
    });
    getAllSkills().then(res => {
      setAllSkills(res.data || []);
      if (res.data.length) {
        setSelectedSkill(res.data[0].name);
        setSkillId(res.data[0].id);
      }
    });
  }, []);

  // === Fetch program progress & its courses ===
  useEffect(() => {
    if (!barProgramId) return;
    setLoadingBar(true);
    getProgramGraph(barProgramId)
      .then(res => setProgramProgress(res.data.data))
      .catch(console.error);
    getCourseByProgId(barProgramId)
      .then(res => {
        setCourseList(res.data.data);
        setSelectedBarCourse("All Courses");
        setBarCourseId(null);
      })
      .catch(console.error)
      .finally(() => setLoadingBar(false));
  }, [barProgramId]);

  // === Fetch course progress ===
  useEffect(() => {
    if (!barCourseId) return;
    setLoadingBar(true);
    getCourseProgressByProgId(barCourseId)
      .then(res => setCourseProgress(res.data.data))
      .catch(console.error)
      .finally(() => setLoadingBar(false));
  }, [barCourseId]);

  // === Fetch pie chart data ===
  useEffect(() => {
    if (!selectedUser) return;
    setPieLoading(true);
    const fn =
      selectedUser === "Student"
        ? getApplicationsTotalNumber(programId, "student")
        : getApplicationsTotalNumber(skillId, "instructor");
    fn
      .then(res => {
        const d = res.data.data;
        setVerifiedRequest(d.verified);
        setUnverifiedRequest(d.unverified);
        setPendingRequest(d.pending);
        setShortlistedRequest(d.short_listed);
      })
      .catch(console.error)
      .finally(() => setPieLoading(false));
  }, [selectedUser, programId, skillId]);

  // === Fetch top‑scores ===
  useEffect(() => {
    if (!scoreProgramId) return;
    setLoadingScore(true);
    const fn =
      scoreProgramId === 3
        ? getProgramDetails(scoreProgramId)
        : getProgramScores(scoreProgramId);
    fn
      .then(res => setScores(res.data.data))
      .catch(console.error)
      .finally(() => setLoadingScore(false));
  }, [scoreProgramId]);

  // === Handlers ===
  const toggleBarProgramOpen = () => setIsBarProgramOpen(p => !p);
  const handleBarProgramSelect = opt => {
    setSelectedBarProgram(opt.name);
    setBarProgramId(opt.id);
    setIsBarProgramOpen(false);
  };

  const toggleBarCourseOpen = () => setIsBarCourseOpen(p => !p);
  const handleBarCourseSelect = opt => {
    setSelectedBarCourse(opt.name);
    setBarCourseId(opt.id);
    setIsBarCourseOpen(false);
  };

  const toggleUsers = () => setIsUserOpen(p => !p);
  const handleUserSelect = opt => {
    setSelectedUser(opt);
    setIsUserOpen(false);
  };

  const toggleProgramOpen = () => setIsProgramOpen(p => !p);
  const handleProgramSelect = opt => {
    setSelectedProgram(opt.name);
    setProgramId(opt.id);
    setIsProgramOpen(false);
  };

  const toggleSkillOpen = () => setIsSkillOpen(p => !p);
  const handleSkillSelect = opt => {
    setSelectedSkill(opt.name);
    setSkillId(opt.id);
    setIsSkillOpen(false);
  };

  const toggleScoreProgramOpen = () => setIsScoreProgramOpen(p => !p);
  const handleScoreProgramSelect = opt => {
    setSelectedScoreProgram(opt.name);
    setScoreProgramId(opt.id);
    setIsScoreProgramOpen(false);
  };

  const handleDelete = () => {
    DeleteBatch(selectedBatch).then(() => {
      setUpdateBatch(u => !u);
      setConfirmDelete(false);
    });
  };

  return (
    <>
      <div
        className={`flex-1 pt-[100px] transition-transform ${isSidebarOpen ? "translate-x-64 ml-20" : "translate-x-0 pl-4 pr-4"
          }`}
        style={{ width: isSidebarOpen ? "81%" : "100%" }}
      >
        <div className="space-y-4 font-inter text-[#07224D]">
          {/* Top cards */}
          <div className="flex flex-wrap gap-4 xmd:flex-nowrap">
            {/* Users */}
            <div className="w-full xmd:w-1/3 bg-surface-100 border-2 border-surface-100 hover:border-blue-300 rounded-xl px-5 py-4 flex items-center border-b-[8px] border-b-[#0074EE]">
              <div className="bg-surface-100 rounded-lg p-4 flex flex-col gap-4 w-full">
                <img src="/assets/img/user-icon.jpg" alt="users" className="w-8 h-8" />
                <p className="text-gray-500 text-lg">Total Users / Active Users</p>
                <p className="text-2xl font-bold">{allUsers} / {allActiveUsers}</p>
              </div>
            </div>
            {/* Students */}
            <div className="w-full xmd:w-1/3 bg-surface-100 border-2 border-surface-100 hover:border-blue-300 rounded-xl px-5 py-4 flex items-center border-b-[8px] border-b-[#0074EE]">
              <div className="bg-surface-100 rounded-lg p-4 flex flex-col gap-4 w-full">
                <img src="/assets/img/student-icon.jpg" alt="students" className="w-8 h-8" />
                <p className="text-gray-500 text-lg">Total Students / Active Students</p>
                <p className="text-2xl font-bold">{allStudents} / {allActiveStudents}</p>
              </div>
            </div>
            {/* Instructors */}
            <div className="w-full xmd:w-1/3 bg-surface-100 border-2 border-surface-100 hover:border-blue-300 rounded-xl px-5 py-4 flex items-center border-b-[8px] border-b-[#0074EE]">
              <div className="bg-surface-100 rounded-lg p-4 flex flex-col gap-4 w-full">
                <img src="/assets/img/instructor-icon.jpg" alt="instructors" className="w-8 h-8" />
                <p className="text-gray-500 text-lg">Total Instructors / Active Instructors</p>
                <p className="text-2xl font-bold">{allInstructors} / {allActiveInstructors}</p>
              </div>
            </div>
          </div>

          {/* Progress & Applications */}
          <div className="flex flex-col gap-4 xmd:flex-row">
            {/* Progress Card */}
            <div className="w-full md:w-2/3 bg-surface-100 p-4 md:p-6 rounded-xl h-auto md:h-[420px] overflow-auto">
              <div className="h-full border border-dark-300 rounded-xl p-4 md:p-6 flex flex-col">
                {/* Header with both dropdowns */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h3 className="text-blue-500 font-bold text-lg">Progress</h3>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Program Dropdown */}
                    <div className="relative w-full sm:w-64 md:w-80">
                      <button
                        ref={barButton}
                        onClick={toggleBarProgramOpen}
                        className="w-full flex justify-between items-center px-4 py-2 bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <span className="truncate capitalize">{selectedBarProgram}</span>
                        <IoIosArrowDown
                          className={isBarProgramOpen ? "rotate-180 transition" : "transition"}
                        />
                      </button>
                      {isBarProgramOpen && (
                        <div
                          ref={barRef}
                          className="absolute z-10 mt-1 w-full max-h-40 overflow-auto bg-surface-100 border border-dark-300 rounded-lg shadow-lg"
                        >
                          {allPrograms.map(opt => (
                            <div
                              key={opt.id}
                              onClick={() => handleBarProgramSelect(opt)}
                              className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                            >
                              {opt.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Course Dropdown */}
                    <div className="relative w-full sm:w-64 md:w-80">
                      <button
                        ref={courseButton}
                        onClick={toggleBarCourseOpen}
                        className="w-full flex justify-between items-center px-4 py-2 bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <span className="truncate capitalize">{selectedBarCourse}</span>
                        <IoIosArrowDown
                          className={isBarCourseOpen ? "rotate-180 transition" : "transition"}
                        />
                      </button>
                      {isBarCourseOpen && (
                        <div
                          ref={courseRef}
                          className="absolute z-10 mt-1 w-full max-h-40 overflow-auto bg-surface-100 border border-dark-300 rounded-lg shadow-lg"
                        >
                          <div
                            onClick={() => handleBarCourseSelect({ id: null, name: "All Courses" })}
                            className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                          >
                            All Courses
                          </div>
                          {courseList.map(opt => (
                            <div
                              key={opt.id}
                              onClick={() => handleBarCourseSelect(opt)}
                              className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                            >
                              {opt.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="flex-grow overflow-hidden">
                  <div className="h-full w-full scrollbar-webkit overflow-x-auto">
                    <div className="h-full">
                      {loadingBar ? (
                        <div className="flex justify-center items-center h-full">
                          <CircularProgress />
                        </div>
                      ) : barCourseId ? (
                        <BarChartCourse
                          barData={courseProgress}
                          barSize={barSize}
                          barCategoryGap="15%"
                          color="#FF0000"
                        />
                      ) : (
                        <BarChart
                          barData={programProgress}
                          barSize={barSize}
                          barCategoryGap="15%"
                          color="#FF0000"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications Status */}
            <div className="w-full xmd:w-[32%] bg-surface-100 p-4 rounded-xl h-[420px]">
              <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-blue-500 font-bold text-lg">
                    Applications Status Overview
                  </h3>
                </div>
                <div className="flex gap-2">
                  {/* User type */}
                  <div className="relative w-full">
                    <button
                      ref={userButton}
                      onClick={toggleUsers}
                      className="flex justify-between items-center w-full px-4 py-2 bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      {selectedUser}
                      <IoIosArrowDown
                        className={isUserOpen ? "rotate-180 transition" : "transition"}
                      />
                    </button>
                    {isUserOpen && (
                      <div
                        ref={userRef}
                        className="absolute z-10 mt-1 w-full bg-surface-100 border border-dark-300 rounded-lg shadow-lg"
                      >
                        {["Student", "Instructor"].map(opt => (
                          <div
                            key={opt}
                            onClick={() => handleUserSelect(opt)}
                            className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Program/Skill */}
                  <div className="relative w-full">
                    {selectedUser === "Student" ? (
                      <button
                        ref={progButton}
                        onClick={toggleProgramOpen}
                        className="flex justify-between items-center w-full px-4 py-2 bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        {selectedProgram}
                        <IoIosArrowDown
                          className={isProgramOpen ? "rotate-180 transition" : "transition"}
                        />
                      </button>
                    ) : (
                      <button
                        ref={skillButton}
                        onClick={toggleSkillOpen}
                        className="flex justify-between items-center w-full px-4 py-2 bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        {selectedSkill}
                        <IoIosArrowDown
                          className={isSkillOpen ? "rotate-180 transition" : "transition"}
                        />
                      </button>
                    )}
                    {isProgramOpen && (
                      <div
                        ref={progRef}
                        className="absolute z-10 mt-1 w-full bg-surface-100 border border-dark-300 rounded-lg shadow-lg"
                      >
                        {allPrograms.map(opt => (
                          <div
                            key={opt.id}
                            onClick={() => handleProgramSelect(opt)}
                            className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                          >
                            {opt.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {isSkillOpen && (
                      <div
                        ref={skillRef}
                        className="absolute z-10 mt-1 w-full bg-surface-100 border border-dark-300 rounded-lg shadow-lg"
                      >
                        {allSkills.map(opt => (
                          <div
                            key={opt.id}
                            onClick={() => handleSkillSelect(opt)}
                            className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                          >
                            {opt.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  {pieLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <CircularProgress size={20} />
                    </div>
                  ) : (
                    <PieChart
                      verified={verifiedRequest}
                      unverified={unverifiedRequest}
                      pending={pendingRequest}
                      shortlisted={shortlistedRequest}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-surface-100 rounded-xl px-5 py-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-blue-500 font-bold text-lg">Top Performers</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setOpenList(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-300 hover:bg-blue-400 rounded-lg text-white"
                >
                  <FaList /> Show All List
                </button>
                <div className="relative">
                  <button
                    ref={scoreButton}
                    onClick={toggleScoreProgramOpen}
                    className="flex justify-between items-center w-[300px] px-4 py-2 bg-surface-100 border border-[#acc5e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {selectedScoreProgram}
                    <IoIosArrowDown
                      className={isScoreProgramOpen ? "rotate-180 transition" : "transition"}
                    />
                  </button>
                  {isScoreProgramOpen && (
                    <div
                      ref={scoreRef}
                      className="absolute z-10 mt-1 w-full bg-surface-100 border border-dark-300 rounded-lg shadow-lg"
                    >
                      {allPrograms.map(opt => (
                        <div
                          key={opt.id}
                          onClick={() => handleScoreProgramSelect(opt)}
                          className="px-4 py-2 capitalize hover:bg-[#03a3d838] hover:text-blue-300 hover:font-semibold cursor-pointer"
                        >
                          {opt.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <TopScoreTable scores={scores} loadingScore={loadingScore} showAll={openList} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {openInfoModal && (
        <BatchUserModal selectedBatch={selectedBatch} setOpenInfo={setOpenInfoModal} />
      )}
      {confirmDelete && (
        <DeleteConfirmationPopup
          setConfirmDelete={setConfirmDelete}
          handleDelete={handleDelete}
          field="batch"
        />
      )}
      {openList && (
        <TopScoreModal scores={scores} loadingScore={loadingScore} showAll={openList} setOpenList={setOpenList} />
      )}
    </>
  );
};

export default AdminDashboard;
