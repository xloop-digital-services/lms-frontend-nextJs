import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";
import DevelopmentTable from "./DevelopmentTable";
import {
  getUserByStatus,
  getUserByProgramID,
  getApplicationsTotalNumber,
} from "@/api/route";
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
  const [approvedRequest, setApprovedRequest] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [shortListRequest, setShortlisted] = useState(null);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    if (programID) {
      const handleUserByStatus = async () => {
        setLoading(true);
        try {
          const response = await getUserByStatus(
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
      handleUserByStatus();
    }
  }, [programID, selectedOption, selectedStatus, statusUpdated]);

  useEffect(() => {
    const handleApplicationsNumber = async () => {
      try {
        const response = await getApplicationsTotalNumber(programID);
        console.log("numbers", response.data);
        setApprovedRequest(response?.data?.data.approved);
        setPendingRequest(response?.data?.data.pending);
        setShortlisted(response?.data?.data.short_listed);
        // console.log('short:',response?.data?.data.short_listed)
      } catch (error) {
        console.log("error while fetching number of applications", error);
      }
    };
    handleApplicationsNumber();
  }, [selectedStatus, programID]);

  const handleToggleSection = (section, id) => {
    setUserByProgramID([]);
    setPorgramID(id);
    setOpenSection(section);
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

  const options = ["student", "instructor"];

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        paddingBottom: "24px",
        width: isSidebarOpen ? "84%" : "100%",
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
          <div className="flex grow">
            <input
              type="text"
              placeholder="Search program by names"
              className="p-3 sm:text-base text-sm border border-[#92A7BE] rounded-lg outline-none w-full"
            />
          </div>
          <div>
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
        <div
          className="my-5 space-y-3 overflow-auto  scrollbar-webkit"
          style={{
            flexGrow: 1, // Allow this section to grow and take up remaining space
          }}
        >
          {loadingProgram ? (
            <div className="w-full h-full flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : program && program.length > 0 ? (
            program.map((program) => (
              <div
                className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col"
                key={program.id}
              >
                <div
                  className="flex nsm:flex-row flex-col space-y-2 justify-between items-center"
                  onClick={() => handleToggleSection(program.name, program.id)}
                >
                  <div className=" flex gap-3 text-[17px] font-semibold font-exo">
                    {program.name}
                    <div className="mt-1 text-[12px] text-blue-300 font-bold " title={`number of ${selectedStatus} applications`} >
                      {openSection === program.name &&
                        (selectedStatus === "pending" ? (
                          <p>( {pendingRequest} )</p>
                        ) : selectedStatus === "approved" ? (
                          <p>( {approvedRequest} )</p>
                        ) : (
                          <p>( {shortListRequest} )</p>
                        ))
                        // <div className="flex gap-2 mt-1 text-[12px] text-[#404850] font-normal">
                        //   <p>approved: {approvedRequest}</p>
                        //   <p>pending: {pendingRequest}</p>
                        //   <p>shortlisted: {shortListRequest}</p>
                        // </div>
                      }
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                          <div className="absolute capitalize z-40 min-w-[200px] mt-1 bg-surface-100 border border-dark-200 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
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
