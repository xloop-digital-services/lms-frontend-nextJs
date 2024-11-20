import React, { useEffect, useRef, useState } from "react";
import image from "../../../public/assets/img/images.png";
import { IoClose } from "react-icons/io5";
import { PiListPlusFill } from "react-icons/pi";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";
import useClickOutside from "@/providers/useClickOutside";
import { resendApprovalMail, userSelectionByAdmin } from "@/api/route";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { downloadFile } from "@/app/courses/course/[courseId]/page";
import { FaRepeat } from "react-icons/fa6";
const UserModal = ({
  selectedOption,
  setModal,
  firstName,
  lastName,
  dob,
  city,
  contact,
  email,
  status,
  approvedStatus,
  location,
  program,
  resume,
  skill,
  experience,
  id,
  setStatusUpdated,
  statusUpdated,
}) => {
  const modalRef = useRef(null);
  const [enableApprovalButton, setEnableApprovalButton] = useState(false);
  const [approvalByLocation, setAprrovalByLocation] = useState(false);
  const [approvalByskill, setApprovalBySkill] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [programID, setPorgramID] = useState(null);
  const [locationId, setLocationId] = useState([]);
  const [studentLocationId, setStudentLocationId] = useState(null);
  const [skillID, setSkillID] = useState([]);
  const [loading, setLoading] = useState(false);
  let data = null;
  console.log("location", location);

  // Use the custom hook for the modal
  const handleEnableApprove = (id) => {
    setPorgramID(id);
    setEnableApprovalButton(true);
  };
  const handleSkillSelection = (id) => {
    setSkillID((prevSkillIDs) => {
      if (prevSkillIDs.includes(id)) {
        // If already selected, remove it
        return prevSkillIDs.filter((skillID) => skillID !== id);
      } else {
        // If not selected, add it
        return [...prevSkillIDs, id];
      }
    });
    setApprovalBySkill(true);
  };
  // //console.log("skills id", skillID);
  const handleLocationSelect = (id, isChecked) => {
    if (selectedOption === "student") {
      if (isChecked) {
        setStudentLocationId(id);
      } else {
        setStudentLocationId(null);
      }
    } else {
      setLocationId((prevLocationIDs) => {
        if (prevLocationIDs.includes(id)) {
          return prevLocationIDs.filter((locationID) => locationID !== id);
        } else {
          return [...prevLocationIDs, id];
        }
      });
    }
    setAprrovalByLocation(true);
  };

  useEffect(() => {
    if (selectedOption === "student") {
      if (!studentLocationId) {
        setAprrovalByLocation(false);
      }
    } else if (locationId.length === 0) {
      setAprrovalByLocation(false);
    }

    if (skillID.length === 0) {
      setApprovalBySkill(false);
    }
    // //console.log("ye chal gaya", approvalByLocation);
  }, [locationId, skillID, studentLocationId]);

  const handleUserSelection = async (status) => {
    setLoading(true);
    if (status === "approved") {
      if (selectedOption === "student") {
        data = {
          application_status: status,
          program_id: programID,
          location_id: studentLocationId,
        };
      } else {
        data = {
          application_status: status,
          skills_id: skillID,
          locations_id: locationId,
        };
      }
    } else {
      data = {
        application_status: status,
      };
    }
    try {
      const response = await userSelectionByAdmin(id, data);
      //console.log("response while selecting", response.data);
      if (response.status === 200) {
        toast.success(`User has been ${status}!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setStatusUpdated(!statusUpdated);
        setLoading(false);
        setModal(false);
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //console.log("error while selecting", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useClickOutside(modalRef, () => setModal(false));

  const handleRepeatApproval = async () => {
    const data = {
      email: email,
    };
    try {
      setLoading(true);
      const response = await resendApprovalMail(data);
      toast.success(response.data.message);
    } catch (error) {
      // console.log(error, "error while repeat verify");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center cursor-default">
      <div className="lg:w-[60%] md:w-[80%] w-[95%] z-[1000] mx-auto my-20 relative font-inter">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100 bg-opacity-30 z-[1100]">
            <CircularProgress size={30} />
          </div>
        )}
        <div style={{ backgroundColor: "#EBF6FF" }} className="p-5 rounded-xl">
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#07224D",
              }}
              className="text-start text-blue-500 font-exo px-2 py-[10px]"
            >
              User Information
            </h1>
            <button className="px-2" onClick={() => setModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div
            className={`bg-surface-100 p-6 rounded-xl flex flex-col justify-start space-y-5 font-inter`}
          >
            {/* <div className=" flex justify-center items-center w-full">
              <Image src={image} className="w-[30%]" />
            </div> */}
            <div>
              <h1 className="text-2xl text-center">
                {firstName} {lastName}
              </h1>
              <p className="text-sm text-dark-400 text-center">{email}</p>
            </div>
            <div className="absolute top-[60px] right-[50px]">
              <p className="text-sm text-dark-400 text-center pb-1 border-b border-dark-300">
                Status
              </p>
              <div className=" py-2 whitespace-nowrap flex w-full justify-start text-sm text-surface-100 dark:text-gray-200 ">
                <p
                  className={`${
                    status === "pending"
                      ? "bg-mix-500"
                      : status === "short_listed"
                      ? " bg-blue-300"
                      : approvedStatus === "verified"
                      ? "bg-mix-300"
                      : "bg-mix-200  "
                  }  w-[120px] text-center px-4 py-2 rounded-lg capitalize`}
                >
                  {status === "approved"
                    ? approvedStatus
                    : status === "short_listed"
                    ? "shortlisted"
                    : status}
                </p>
              </div>
            </div>
            <div className="w-full h-[2px] bg-dark-200"></div>
            <div className="md:px-[40px] px-[20px] text-base">
              <div className="flex justify-evenly gap-6 w-full">
                <table className="w-[60%] border-collapse">
                  <tbody>
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">DOB</td>
                      <td className="text-center py-2">{dob || "-"}</td>
                    </tr>
                    {/* <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">Area</td>
                      <td className="text-center py-2">{location.name}</td>
                    </tr> */}
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">City</td>
                      <td className="text-center py-2">{city || "-"}</td>
                    </tr>
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">
                        Contact
                      </td>
                      <td className="text-center py-2">{contact || "-"}</td>
                    </tr>
                    {/* <tr className="">
                      <td className="text-dark-400 text-center py-2">
                        Education
                      </td>
                      <td className="text-center py-2">BS(CS)</td>
                    </tr> */}
                    {selectedOption === "instructor" && (
                      <>
                        <tr className="border-b border-[#d7e4ee]">
                          <td className="text-dark-400 text-center py-2">
                            Experience
                          </td>
                          <td className="text-center py-2 px-4">
                            {experience + " Year" || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-dark-400 text-center py-2">
                            Resume
                          </td>
                          <td className="text-center py-2 px-4">
                            {resume &&
                            resume !== "undefined/undefined" &&
                            resume !== "null" ? (
                              <button
                                onClick={() => downloadFile(resume)}
                                // href={resume}
                                // target="_blank"
                                // rel="noopener noreferrer"
                                className=" hover:text-blue-300 hover:underline"
                              >
                                {resume.split("/").pop()}{" "}
                                {/* Display only the filename */}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <div className="flex gap-6 items-start w-full">
                  <div className="space-y-2 w-[70%]">
                    <p className="text-sm text-dark-400 pb-1 border-b border-dark-300">
                      {selectedOption === "student"
                        ? status === "approved"
                          ? "Selected Program"
                          : "Areas of Interest"
                        : "Skill Sets"}
                    </p>
                    <div className="space-y-2 ">
                      {selectedOption === "student" ? (
                        program && program.length > 0 ? (
                          // Display Program Logic
                          program.map((prog, index) => (
                            <div key={index} className="flex gap-2">
                              <label
                                htmlFor={`radio-${index}`}
                                className={`flex items-center group cursor-pointer`}
                              >
                                {status === "approved" ? (
                                  <span className="list-disc text-gray-700 ml-2">
                                    •
                                  </span>
                                ) : (
                                  <input
                                    id={`radio-${index}`}
                                    type="radio"
                                    name="programSelection"
                                    onChange={() =>
                                      handleEnableApprove(prog.id)
                                    }
                                    className="border-gray-200 mt-1 rounded text-blue-600 focus:ring-blue-500"
                                  />
                                )}
                                <span className="ml-2">{prog.name}</span>{" "}
                                {/* Program Name */}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p>No programs available.</p>
                        )
                      ) : skill && skill.length > 0 ? (
                        // Display Skills Logic
                        skill.map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <label
                              htmlFor={`checkbox-${index}`}
                              className={`flex items-center cursor-pointer`}
                            >
                              {status === "approved" ? (
                                <span className="list-disc text-gray-700 ml-2">
                                  •
                                </span>
                              ) : (
                                <input
                                  id={`radio-${index}`}
                                  type="radio"
                                  name="programSelection"
                                  onChange={() =>
                                    handleSkillSelection(skill.id)
                                  }
                                  className="border-gray-200 mt-1 rounded text-blue-600 focus:ring-blue-500"
                                />
                              )}
                              <span className="ml-2">{skill.name}</span>{" "}
                              {/* Clicking on this selects the input */}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>No skills available.</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 w-[70%]">
                    <p className="text-sm text-dark-400 pb-1 border-b border-dark-300">
                      Locations
                    </p>
                    {location &&
                      location.length > 0 &&
                      location.map((prog, index) => (
                        <div key={index} className="flex gap-2">
                          <label
                            htmlFor={`input-${index}`}
                            className={` ${
                              status === "approved" && "list-disc"
                            } flex items-center cursor-pointer`} // Add cursor-pointer here for better UX
                          >
                            {status === "approved" ? (
                              <span className="list-disc text-gray-700 ml-2">
                                •
                              </span>
                            ) : (
                              <input
                                id={`input-${index}`}
                                type={
                                  selectedOption === "student"
                                    ? "radio"
                                    : "checkbox"
                                }
                                name="locationSelection" // Same name for all radio buttons
                                onChange={(e) =>
                                  handleLocationSelect(
                                    prog.id,
                                    e.target.checked
                                  )
                                } // Function to handle selection
                                className={`${
                                  status === "approved" ? "hidden" : "flex"
                                } border-gray-200 rounded mt-1 text-blue-600 focus:ring-blue-500`}
                              />
                            )}
                            <span className="ml-2">{prog.name}</span>{" "}
                            {/* Clicking on this will now select the input */}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div
                className={`${
                  status === "approved" && approvedStatus === "verified"
                    ? "hidden"
                    : " flex"
                } flex-row w-full justify-evenly pt-6`}
              >
                <div>
                  <div
                    className={` ${
                      status === "short_listed" ||
                      approvedStatus === "unverified"
                        ? "hidden"
                        : " flex"
                    } group relative justify-center items-center text-blue-300 text-sm font-bold`}
                  >
                    <div
                      className={`shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300`}
                      onClick={() => {
                        setSelectedStatus("short_listed");
                        handleUserSelection("short_listed");
                      }}
                    >
                      <PiListPlusFill size={23} className="fill-zinc-600" />
                      <span className="text-[0px] group-hover:text-sm duration-300">
                        Shortlist
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    approvedStatus === "unverified"
                      ? "hidden"
                      : " group relative flex justify-center items-center text-mix-200 text-sm font-bold"
                  }
                >
                  <div
                    className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300"
                    onClick={() => {
                      setSelectedStatus("removed");
                      handleUserSelection("removed");
                    }}
                  >
                    <IoMdCloseCircle size={24} className="fill-zinc-600" />
                    <span className="text-[0px] group-hover:text-sm duration-300">
                      Reject
                    </span>
                  </div>
                </div>
                {approvedStatus !== "unverified" && (
                  <button
                    className={`group relative flex justify-center items-center ${
                      (enableApprovalButton || approvalByskill) &&
                      approvalByLocation
                        ? "text-mix-300 cursor-pointer"
                        : "text-[#23e1ab] cursor-not-allowed"
                    } text-sm font-bold`}
                    disabled={
                      !(enableApprovalButton || approvalByskill) ||
                      !approvalByLocation
                    }
                    onClick={() => {
                      setSelectedStatus("approved");
                      handleUserSelection("approved");
                    }}
                  >
                    <div className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full duration-300">
                      <FaCheckCircle size={20} className="fill-zinc-600" />
                      <span className="text-[0px] group-hover:text-sm duration-300">
                        Approve
                      </span>
                    </div>
                  </button>
                )}
              </div>
              {approvedStatus === "unverified" && (
                <button
                  className={`group relative flex justify-center items-center w-full text-mix-300 cursor-pointer text-sm font-bold`}
                  onClick={() => {
                    handleRepeatApproval();
                  }}
                >
                  <div className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full duration-300">
                    <FaRepeat size={20} className="fill-zinc-600" />
                    <span className="text-[0px] group-hover:text-sm duration-300">
                      Resend Approval
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserModal;
