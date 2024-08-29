import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";
import DevelopmentTable from "./DevelopmentTable";
import { getStudentByStatus, getUserByProgramID } from "@/api/route";
import { CircularProgress } from "@mui/material";
import useClickOutside from "@/providers/useClickOutside";

const UserManagement = ({ heading, program, loadingProgram }) => {
  const { isSidebarOpen } = useSidebar();
  const [selectedOption, setSelectedOption] = useState("student");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [programID, setPorgramID] = useState(null);
  const [userByProgramID, setUserByProgramID] = useState([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  // Use the custom hook for the dropdown
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // useEffect(() => {
  //   if (programID) {
  //     const fetchUsers = async () => {
  //       setLoading(true);
  //       try {
  //         const response = await getUserByProgramID(programID, selectedOption);
  //         if (response.data?.status_code === 200) {
  //           setUserByProgramID(response.data?.data || []);
  //         } else if (response.data?.status_code === 404) {
  //           console.log("No users found for this program");
  //           setLoading(false);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching users:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     // fetchUsers();
  //   }
  // }, [programID, selectedOption]);

  useEffect(() => {
    if (programID) {
      handleStudentByStatus();
    }
  }, [programID, selectedOption, selectedStatus, statusUpdated]);

  const handleStudentByStatus = async () => {
    setLoading(true);
    try {
      const response = await getStudentByStatus(
        programID,
        selectedOption,
        selectedStatus
      );
      setUserByProgramID(response.data?.data || []);
      console.log("res", response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleToggleSection = (section, id) => {
    setUserByProgramID([]);
    setPorgramID(id);
    setOpenSection(section);
  };

  const toggleOpen = () => {
    setIsOpen(true);
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

  const options = ["student", "instructor"];

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        paddingBottom: "24px",
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
      <div className="bg-surface-100 p-6 rounded-xl h-full space-y-4">
        <div>
          <p className="text-xl font-bold">{heading}</p>
        </div>
        <div className="w-full flex  items-center gap-4">
          <div className="flex grow">
            <input
              type="text"
              placeholder="Search program by names"
              className="p-3 border border-[#92A7BE] rounded-lg outline-none w-full"
            />
          </div>
          <div>
            <button
              onClick={toggleOpen}
              className="flex justify-between z-50 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            >
              {selectedOption || options[0]}
              <span className="">
                <IoIosArrowDown />
              </span>
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute capitalize z-50 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
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
        <div className="my-5 space-y-3">
          {loadingProgram ? (
            <div className="w-full h-full flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : program && program.length > 0 ? (
            program.map((program) => (
              <div
                className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col "
                key={program.id}
              >
                <div
                  className=" flex justify-between items-center "
                  onClick={() => handleToggleSection(program.name, program.id)}
                >
                  <p className="text-[17px] font-semibold font-exo">
                    {program.name}
                  </p>
                  <div className="flex items-center gap-2 ">
                    {openSection === program.name && (
                      <div className="z-20">
                        <button
                          onClick={toggleStatusOpen}
                          className="flex justify-between z-30 items-center min-w-[200px] text-[#92A7BE] hover:text-[#0e1721] px-4 py-2 text-sm text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                        >
                          {selectedStatus || status[0]}
                          <span className="">
                            <IoIosArrowDown />
                          </span>
                        </button>

                        {statusOpen && (
                          <div
                            // ref={dropdownRef}
                            className="absolute capitalize z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out"
                          >
                            {status.map((option, index) => (
                              <div
                                key={index}
                                onClick={() => handleStatusSelect(option)}
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
                    )}

                    <span className="">
                      <IoIosArrowDown />
                    </span>
                  </div>
                </div>
                <div
                  className={`transition-container ${
                    openSection === program.name
                      ? "max-height-full"
                      : "max-height-0"
                  }`}
                >
                  {openSection === program.name && (
                    <div className="mt-2">
                      {
                        <DevelopmentTable
                          loading={loading}
                          selectedStatus={selectedStatus}
                          selectedOption={selectedOption}
                          userByProgramID={userByProgramID}
                          setStatusUpdated={setStatusUpdated}
                          statusUpdated={statusUpdated}
                        />
                      }
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-dark-300 text-center">No programs found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
