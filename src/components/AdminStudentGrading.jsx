"use client";
import {
  allStudentsCoursePerformance,
  getAttendanceBySessionId,
  getInstructorSessionsbyCourseId,
  listAllBatches,
  listSessionByCourseId,
} from "@/api/route";
import { useAuth } from "@/providers/AuthContext";
import { Try, Upload } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import useClickOutside from "@/providers/useClickOutside";
import { FaDownload, FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";
import TopScoreModal from "./Modal/TopScoreModal";
import { saveAs } from 'file-saver';

const AdminStudentGrading = ({ courseId }) => {
  const { userData } = useAuth();
  const [attendance, setAttendance] = useState([]);

  const [getAttendance, setGetAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [loader, setLoader] = useState(false);
  const [instructorSessions, setInstructorSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminSessions, setAdminSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [id, setId] = useState();
  const group = userData?.Group;
  const isAdmin = userData?.Group === "admin";
  const isInstructor = userData?.Group === "instructor";
  const userId = userData?.user_data?.id;
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");
  const sessionButton = useRef(null);
  const sessionDropdown = useRef(null);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [studentPerformance, setStudentPerformance] = useState();
  const [loadingScore, setLoadingScore] = useState(false);


  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useClickOutside(sessionDropdown, sessionButton, () =>
    setIsSessionOpen(false)
  );
  const toggleSessionOpen = () => {
    setIsSessionOpen(!isSessionOpen);
  };
  const handleSessionSelect = (session) => {
    setSelectedSession(session.session_name);
    if (isAdmin) {
      setSelectedSessionId(session.id);
    } else {
      setSelectedSessionId(session.session_id);
    }
    setIsSessionOpen(false);
  };
  const handleBatchSelection = (e) => {
    //console.log("chal rahi he", e.target.value);
    setSelectedBatchId(e.target.value);
  };

  async function fetchSessions() {
    setLoading(true);
    try {
      const response = await getInstructorSessionsbyCourseId(
        userId,
        group,
        courseId
      );
      if (response.status === 200) {
        setInstructorSessions(response.data);
      } else {
        //console.error("Failed to fetch sessions, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAttendanceAdmin() {
    setLoading(true);
    try {
      const response = await getAttendanceBySessionId(selectedSessionId);
      if (response.status === 200) {
        // //console.log("attendence in students", response.data.data.students);
        setAttendance(response.data.data.students);
      } else {
        //console.error("Failed to fetch attendance, status:", response.status);
      }
    } catch (error) {
      //console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCoursePerformance() {
    setLoadingScore(true);
    try {
      const response = await allStudentsCoursePerformance(courseId, selectedSessionId);
      if (response.status === 200) {
        setStudentPerformance(response?.data?.data);
        // console.log(response?.data?.data);
      } else {
      }
    } catch (error) {
    } finally {
      setLoadingScore(false);
    }
  }

  const fetchAllSessions = async () => {
    try {
      const response = await listSessionByCourseId(courseId);
      // //console.log('admin sessions', response.data )
      setAdminSessions(response.data.data);
    } catch (error) {
      //console.log("fetching sessions", error);
    }
  };

  useEffect(() => {
    const getBatch = async () => {
      try {
        const response = await listAllBatches();
        setLoadingBatch(true);
        const batchOptionsArray = response?.data.map((batch) => batch.batch);
        setBatches(batchOptionsArray);
      } catch (error) {
        // console.log("error while fetching the batches", error);
        if (error.message === "Network Error") {
          toast.error(error.message, "Check your internet connection");
        }
      } finally {
        setLoadingBatch(false);
      }
    };
    getBatch();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchAttendanceAdmin();
    }
    if (isInstructor) {
      fetchSessions();
    } else {
      fetchAllSessions();
      fetchCoursePerformance();
    }
  }, [selectedSessionId]);

  const generateTemplate = () => {
    const workbook = XLSX.utils.book_new();

    const sheets = {
      Assignments: [['Title', 'Total Marks', 'Due Date']],
      Quizzes: [['Title', 'Total Marks', 'Date']],
      Exams: [['Title', 'Total Marks', 'Date']],
      Projects: [['Title', 'Total Marks', 'Submission Date']],
    };

    Object.entries(sheets).forEach(([sheetName, data]) => {
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const wbout = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });

    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xff;
    }

    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, 'grading-template.xlsx');
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full gap-2">
        <div className="relative space-y-2 text-[15px] w-full mb-2">
          <p className="text-blue-500 font-semibold">Select Session</p>
          <button
            ref={sessionButton}
            onClick={toggleSessionOpen}
            className={`${!selectedSession ? "text-[#92A7BE]" : "text-[#424B55]"
              } flex justify-between items-center w-full hover:text-[#0E1721] px-4 py-3 text-sm text-left bg-surface-100 border border-[#ACC5E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out`}
          >
            {selectedSession || "Select a session"}
            <span
              className={
                isSessionOpen ? "rotate-180 duration-300" : "duration-300"
              }
            >
              <IoIosArrowDown />
            </span>
          </button>{" "}
          {isSessionOpen && (
            <div
              ref={sessionDropdown}
              className="absolute top-full left-0 z-20 w-full lg:max-h-[170px] max-h-[150px] overflow-auto scrollbar-webkit bg-surface-100 border border-dark-300 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
            >
              {Array.isArray(instructorSessions.data) &&
                instructorSessions.data.length > 0 ? (
                instructorSessions.data.map((session, index) => (
                  <div
                    key={index}
                    onClick={() => handleSessionSelect(session)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg"
                  >
                    {session?.session_name}
                  </div>
                ))
              ) : adminSessions && adminSessions.length > 0 ? (
                adminSessions.map((session, index) => (
                  <div
                    key={index}
                    onClick={() => handleSessionSelect(session)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#03a3d838] hover:text-[#03A1D8] hover:font-semibold rounded-lg"
                  >
                    {session?.session_name}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No sessions available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {
        selectedSessionId &&
        <div className="flex max-md:flex-col my-2 items-end justify-end">
          <div className="mr-2">
            <button
              onClick={() => setOpenPerformanceModal(true)}
              title="View student performance report"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-300 rounded-md border border-dark-300 px-2 py-1"
            >
              {/* <FaDownload /> */}
              View overall course progress
            </button>

          </div>
          {/* <div className="relative inline-block" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              title="Download student performance report"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-300 rounded-md border border-dark-300 px-2 py-1"
            >
              <FaUpload />
              Import
            </button>
            {showMenu && (
              <div className="absolute left-[-6.8rem] mt-2 w-48 bg-surface-100 border border-dark-300 rounded shadow-md z-50">

                <button
                  onClick={generateTemplate}
                  className="w-full text-left px-4 py-2 hover:bg-dark-100"
                >
                  Download template
                </button>
                <button
                  // onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 hover:bg-dark-100"
                >
                  Upload Excel
                </button>
              </div>
            )}
          </div> */}
        </div>
      }
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden rounded-lg">
              <div className="relative max-h-[54vh] overflow-y-auto scrollbar-webkit">
                <table className="min-w-full divide-y divide-dark-300 dark:divide-gray-700">
                  <thead className="bg-surface-100 text-blue-500 sticky top-0 z-10 shadow-sm shadow-dark-200">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student ID
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 dark:divide-gray-700 overflow-y-scroll scrollbar-webkit">
                    {loading ? (
                      <tr>
                        <td colSpan="10" className="py-4 text-center">
                          <div className="flex justify-center items-center w-full">
                            <CircularProgress size={22} />
                          </div>
                        </td>
                      </tr>
                    ) : attendance && attendance.length > 0 ? (
                      [...attendance]
                        .sort((a, b) => {
                          const nameA = (a.user || a.name || "").toLowerCase();
                          const nameB = (b.user || b.name || "").toLowerCase();
                          return nameA.localeCompare(nameB);
                        })
                        .map((att, index) => {
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                                {att.registration_id}
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 hover:text-blue-300">
                                <Link
                                  href={`/students/course/${courseId}/student/${selectedSessionId}/${att.registration_id}/`}
                                >
                                  {att.user || att.name}
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-sm text-dark-300 py-4"
                        >
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {openPerformanceModal && (
          <TopScoreModal
            scores={studentPerformance}
            loadingScore={loadingScore}
            showAll={true}
            setOpenList={setOpenPerformanceModal}
            title='course wise'
          />
        )}

      </div>
    </div>



  );
};

export default AdminStudentGrading;
