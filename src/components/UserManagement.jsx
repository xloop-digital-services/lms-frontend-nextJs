import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/providers/useSidebar";

const UserManagement = ({heading, table}) => {
  const { isSidebarOpen } = useSidebar();
  const [selectedOption, setSelectedOption] = useState("Student");
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const options = ["Student", "Instructor"];

  return (
    <div
      className={`flex-1 transition-transform pt-[110px] space-y-4 max-md:pt-32 font-inter ${
        isSidebarOpen ? "translate-x-64 pl-20 " : "translate-x-0 pl-10 pr-4"
      }`}
      style={{
        width: isSidebarOpen ? "84%" : "100%",
      }}
    >
        <div className="bg-surface-100 p-6 rounded-xl h-[85vh] space-y-4">
      <div>
        <p className="text-xl font-bold">{heading}</p>
      </div>
      <div className="w-full flex justify-between items-center gap-4">
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
            className="flex justify-between items-center w-[150px] text-[#92A7BE] group-hover:text-[#0e1721] px-4 py-4 text-sm text-left bg-white border  border-[#92A7BE] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
          >
            {selectedOption || options[0]}
            <span className="">
              <IoIosArrowDown />
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
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
      {selectedOption === "Student" ? (
        <div className="my-5 space-y-3">
          <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
            <div
              className=" flex justify-between items-center "
              onClick={() => handleToggleSection("UI UX Design")}
            >
              <p className="text-[17px] font-semibold font-exo">UI UX Design</p>
              <span className="">
                <IoIosArrowDown />
              </span>
            </div>
            <div
              className={`transition-container ${
                openSection === "UI UX Design"
                  ? "max-height-full"
                  : "max-height-0"
              }`}
            >
              {openSection === "UI UX Design" && (
                <div className="mt-2">
                  {/* <StudentMarksTable field={openSection} /> */}
                </div>
              )}
            </div>
          </div>

          <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
            <div
              className=" flex justify-between items-center "
              onClick={() => handleToggleSection("Assignment")}
            >
              <p className="text-[17px] font-semibold font-exo">Assignment</p>
              <span className="">
                <IoIosArrowDown />
              </span>
            </div>
            <div
              className={`transition-container ${
                openSection === "Assignment"
                  ? "max-height-full"
                  : "max-height-0"
              }`}
            >
              {openSection === "Assignment" && (
                <div className="mt-2">
                  {/* <StudentMarksTable field={openSection} /> */}
                </div>
              )}
            </div>
          </div>

          <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
            <div
              className=" flex justify-between items-center "
              onClick={() => handleToggleSection("Project")}
            >
              <p className="text-[17px] font-semibold font-exo">Project</p>
              <span className="">
                <IoIosArrowDown />
              </span>
            </div>
            <div
              className={`transition-container ${
                openSection === "Project" ? "max-height-full" : "max-height-0"
              }`}
            >
              {openSection === "Project" && (
                <div className="mt-2">
                  {/* <StudentMarksTable field={openSection} /> */}
                </div>
              )}
            </div>
          </div>

          <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
            <div
              className=" flex justify-between items-center "
              onClick={() => handleToggleSection("Exam")}
            >
              <p className="text-[17px] font-semibold font-exo">Exam</p>
              <span className="">
                <IoIosArrowDown />
              </span>
            </div>
            <div
              className={`transition-container ${
                openSection === "Exam" ? "max-height-full" : "max-height-0"
              }`}
            >
              {openSection === "Exam" && (
                <div className="mt-2">
                  {/* <StudentMarksTable field={openSection} /> */}
                </div>
              )}
            </div>
          </div>
          <div className="border border-dark-300 w-full p-4 rounded-lg cursor-pointer flex flex-col ">
            <div
              className=" flex justify-between items-center "
              onClick={() => handleToggleSection("Development")}
            >
              <p className="text-[17px] font-semibold font-exo">Development</p>
              <span className="">
                <IoIosArrowDown />
              </span>
            </div>
            <div
              className={`transition-container ${
                openSection === "Development"
                  ? "max-height-full"
                  : "max-height-0"
              }`}
            >
              {openSection === "Development" && (
                <div className="mt-2">
                 {React.cloneElement(table, { selectedOption })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {React.cloneElement(table, { selectedOption })}
        </div>
      )}
      </div>
    </div>
  );
};

export default UserManagement;
