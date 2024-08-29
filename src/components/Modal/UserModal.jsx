import React, { useEffect, useRef, useState } from "react";
import image from "../../../public/assets/img/images.png";
import { IoClose } from "react-icons/io5";
import { PiListPlusFill } from "react-icons/pi";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";
import useClickOutside from "@/providers/useClickOutside";
import { userSelectionByAdmin } from "@/api/route";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const UserModal = ({
  setModal,
  firstName,
  lastName,
  city,
  contact,
  email,
  status,
  program,
  id,
  setStatusUpdated,
  statusUpdated,
}) => {
  const modalRef = useRef(null);
  const [enableApprovalButton, setEnableApprovalButton] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [programID, setPorgramID] = useState(null);
  const [loading, setLoading] = useState(false);
  let data = null;

  // Use the custom hook for the modal

  const handleEnableApprove = (id) => {
    setPorgramID(id);
    setEnableApprovalButton(true);
  };

  const handleUserSelection = async () => {
    setLoading(true);
    if (selectedStatus === "approved") {
      data = {
        application_status: selectedStatus,
        program_id: programID,
      };
    } else {
      data = {
        application_status: selectedStatus,
      };
    }
    try {
      const response = await userSelectionByAdmin(id, data);
      console.log("response while selecting", response.data);
      if (response.status === 200) {
        toast.success(`User has been ${selectedStatus}!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setLoading(false);
        setModal(false);
        setStatusUpdated(!statusUpdated);
      }
    } catch (error) {
      toast.error(error.response.data.message , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("error while selecting", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!(selectedStatus === "")) {
      handleUserSelection();
    }
  }, [selectedStatus]);
  useClickOutside(modalRef, () => setModal(false));

  return (
    <div className="backDropOverlay min-h-screen flex  items-center">
      <div className="min-w-[70%]  z-[1000] mx-auto my-20 relative">
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
              className="text-start  px-2 py-[10px]"
            >
              User Information
            </h1>

            <button className="px-2" onClick={() => setModal(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div
            className={`bg-surface-100 p-6 rounded-xl flex flex-col justify-start space-y-5 `}
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

            <div className="w-full h-[2px] bg-dark-200"></div>
            <div className="px-[40px] text-base">
              <div className="md:flex justify-evenly">
                <table className="w-[40%] border-collapse">
                  <tbody>
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">Age</td>
                      <td className="text-center py-2">16 years</td>
                    </tr>
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">Area</td>
                      <td className="text-center py-2">Gulberg</td>
                    </tr>
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">City</td>
                      <td className="text-center py-2">{city}</td>
                    </tr>
                    <tr className="border-b border-[#d7e4ee]">
                      <td className="text-dark-400 text-center py-2">
                        Contact
                      </td>
                      <td className="text-center py-2">{contact}</td>
                    </tr>
                    <tr className="">
                      <td className="text-dark-400 text-center py-2">
                        Education
                      </td>
                      <td className="text-center py-2">BS(CS)</td>
                    </tr>
                  </tbody>
                </table>
                <div className="space-y-5">
                  <div className="space-y-2 ">
                    <p className="text-sm text-dark-400">
                      {status === "approved"
                        ? "Selected Program"
                        : "Areas of Interest"}
                    </p>
                    <div className="">
                      {program &&
                        program.length > 0 &&
                        program.map((prog, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className={`${
                                status === "approved" ? "hidden" : " flex"
                              } items-center h-5`}
                            >
                              <input
                                id={`radio-${index}`}
                                type="radio"
                                name="programSelection" // Same name attribute for all radio buttons
                                // value={prog.name} // Store the value of the selected program
                                onChange={() => handleEnableApprove(prog.id)} // Call a function to handle the selection
                                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                              />
                              {/* <label
                                htmlFor={`radio-${index}`}
                                className="sr-only"
                              >
                                Select {prog.name}
                              </label> */}
                            </div>
                            <p>{prog.name}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-dark-400">Status</p>
                    <div className=" py-2 whitespace-nowrap flex w-full justify-start text-sm text-surface-100 dark:text-gray-200 ">
                      <p
                        className={`${
                          status === "pending"
                            ? "bg-[#DDF8EE] text-blue-300 border border-blue-300"
                            : "bg-[#18A07A]"
                        }  w-[120px] text-center px-4 py-2 rounded-lg capitalize`}
                      >
                        {status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`${
                  status === "approved" ? "hidden" : " flex"
                } flex-row w-full justify-evenly pt-6`}
              >
                <div>
                  <div
                    className={` ${
                      status === "short_listed" ? "hidden" : " flex"
                    } group relative justify-center items-center text-[#03A1D8] text-sm font-bold`}
                  >
                    <div
                      className={`shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300`}
                      onClick={() => setSelectedStatus("short_listed")}
                    >
                      <PiListPlusFill size={23} className="fill-zinc-600" />
                      <span className="text-[0px] group-hover:text-sm duration-300">
                        Shortlist
                      </span>
                    </div>
                  </div>
                </div>
                <div className="group relative flex justify-center items-center text-[#D84848] text-sm font-bold">
                  <div
                    className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full cursor-pointer duration-300"
                    onClick={() => setSelectedStatus("removed")}
                  >
                    <IoMdCloseCircle size={24} className="fill-zinc-600" />
                    <span className="text-[0px] group-hover:text-sm duration-300">
                      Reject
                    </span>
                  </div>
                </div>
                <div
                  className={`group relative flex justify-center items-center ${
                    enableApprovalButton
                      ? "text-[#18A07A] cursor-pointer"
                      : "text-[#23e1ab] cursor-not-allowed"
                  } text-sm font-bold`}
                >
                  <div
                    className="shadow-md flex items-center group-hover:gap-2 p-3 rounded-full duration-300"
                    onClick={() => setSelectedStatus("approved")}
                  >
                    <FaCheckCircle size={20} className="fill-zinc-600" />
                    <span className="text-[0px] group-hover:text-sm duration-300">
                      Approve
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
