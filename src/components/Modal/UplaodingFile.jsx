import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  uploadAssignment,
  uploadExam,
  uploadProject,
  uploadQuiz,
} from "@/api/route";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { handleFileUploadToS3 } from "../ApplicationForm";

const UploadingFile = ({
  field,
  heading,
  setUploadFile,
  assignmentID,
  setUpdateStatus,
}) => {
  const [comment, setComment] = useState("");
  const [fileUploaded, setFileUploaded] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [loader, setLoader] = useState(false);

  const supportedFormats = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".txt",
    ".zip",
  ];
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const handleBrowse = (event) => {
    const selectedFile = event.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileSelection(droppedFile);
    setIsDragOver(false);
  };

  const handleFileSelection = (file) => {
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (supportedFormats.includes(`.${fileExtension}`)) {
        setFile(file);
        setFileUploaded(file.name);
        setError("");
      } else {
        setError("This file format is not supported.");
        setFileUploaded(null);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleUpload = async (type) => {
    setLoader(true);

    if (file === null) {
      toast.warn("File is not selected");
      setLoader(false);
      return;
    }

    try {
      const s3Data = await handleFileUploadToS3(file, type);
      //console.log("S3 Data:", s3Data);

      const formData = new FormData();
      formData.append(`submitted_file`, s3Data);
      formData.append("comments", comment);
      formData.append(type, assignmentID);

      const uploadFunctionMap = {
        quiz: uploadQuiz,
        exam: uploadExam,
        project: uploadProject,
        assignment: uploadAssignment,
      };

      const uploadFunction = uploadFunctionMap[type];

      if (!uploadFunction) {
        throw new Error("Invalid upload type");
      }

      const response = await uploadFunction(formData);
      if (response.status === 201) {
        toast.success(`${capitalizeFirstLetter(type)} has been submitted`);
        setComment("");
        setLoader(false);
        setUploadFile(false);
        setUpdateStatus(true);
      }
    } catch (error) {
      //console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
      setLoader(false);
      setUploadFile(false);
    }
  };

  const handleUploadExam = async () => {
    await handleUpload("exam");
  };

  const handleUploadAssignment = async () => {
    await handleUpload("assignment");
  };

  const handleUploadQuiz = async () => {
    await handleUpload("quiz");
  };

  const handleUploadProject = async () => {
    await handleUpload("project");
  };

  const handleUploadation = () => {
    if (field === "quiz") {
      handleUploadQuiz();
    }
    if (field === "assignment") {
      handleUploadAssignment();
    }
    if (field === "project") {
      handleUploadProject();
    }
    if (field === "exam") {
      handleUploadExam();
    }
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="w-[550px] z-[1000] mx-auto my-20">
        <div style={{ backgroundColor: "#EBF6FF" }} className="p-5 rounded-xl">
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
              className="text-start px-2 py-[10px]"
            >
              Upload {heading}
            </h1>
            <button className="px-2" onClick={() => setUploadFile(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div
            className={`bg-surface-100 p-6 rounded-xl space-y-5`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div
              className={`${
                isDragOver ? "bg-blue-100" : ""
              } bg-[#EBF6FF] space-y-1 flex flex-col justify-center items-center p-4 border border-dashed border-blue-300 rounded-lg`}
            >
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                className="hidden"
                onChange={handleBrowse}
              />
              <button
                className="border border-blue-300 p-3 text-[15px] rounded-lg hover:bg-blue-100 hover:text-blue-300"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Upload File
              </button>
              <p className="text-[13px]">
                Drag & drop files or{" "}
                <span
                  className="text-blue-300 hover:cursor-pointer"
                  title="select from local"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Browse
                </span>
              </p>
              <p className="text-[#92A7BE] text-[12px]">
                Supported formats: pdf, doc, docx, ppt, pptx, txt, zip
              </p>
              {fileUploaded && (
                <p className="text-[#1ab725] text-[13px] mt-2 border border-[#1ab7245f] p-1 px-4 rounded-lg">
                  {fileUploaded} selected
                </p>
              )}
              {error && (
                <p className="text-[#ff4c4c] text-[13px] mt-2 border border-[#ff4c4c5f] p-1 px-4 rounded-lg">
                  {error}
                </p>
              )}
            </div>
            <div className="space-y-2 text-[15px]">
              <p className="">Comment</p>
              <input
                type="text"
                className="border border-dark-300 outline-none p-3 rounded-lg w-full"
                placeholder="Regarding assignment or note"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-center items-center">
              <button
                type="submit"
                onClick={handleUploadation}
                className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                {loader ? (
                  <CircularProgress size={20} style={{ color: "white" }} />
                ) : (
                  <span> Upload </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadingFile;
