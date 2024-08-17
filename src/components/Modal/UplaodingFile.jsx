import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { uploadAssignment, uploadExam, uploadProject, uploadQuiz } from "@/api/route";
import { toast } from "react-toastify";


const UploadingFile = ({ field, setUploadFile, assignmentID }) => {

  const [comment, setComment] = useState('')
  const [fileUploaded, setFileUploaded] = useState(null); 
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const supportedFormats = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".zip"];

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
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (supportedFormats.includes(`.${fileExtension}`)) {
        setFile(file)
        setFileUploaded(file.name);
        setError(''); // Clear any previous error
      } else {
        setError('This file format is not supported.');
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

  const handleUploadQuiz = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("quiz_submitted_file", file);
      formData.append('comments', comment)
      formData.append('quiz', assignmentID)
      try {
        const response = await uploadQuiz(formData);
        console.log('file uploaded', response)
        if(response.status === 201){
          toast.success('Quiz has been submitted')
          setComment('')
          setUploadFile(false)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        console.log('error is occuring:', error)
      }
    }
  }

  const handleUploadExam = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("exam_submitted_file", file);
      formData.append('comments', comment)
      formData.append('exam', assignmentID)
      try {
        const response = await uploadExam(formData);
        console.log('file uploaded', response)
        if(response.status === 201){
          toast.success('Exam has been submitted')
          setComment('')
          setUploadFile(false)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        console.log('error is occuring:', error)
      }
    }
  }

  const handleUploadProject = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("project_submitted_file", file);
      formData.append('comments', comment)
      formData.append('project', assignmentID)
      try {
        const response = await uploadProject(formData);
        console.log('file uploaded', response)
        if(response.status === 201){
          toast.success('Project has been submitted')
          setComment('')
          setUploadFile(false)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        console.log('error is occuring:', error)
      }
    }
  }

  const handleUploadAssignment = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("submitted_file", file);
      formData.append('comments', comment)
      formData.append('assignment', assignmentID)
      try {
        const response = await uploadAssignment(formData);
        console.log('file uploaded', response)
        if(response.status === 201){
          toast.success('Assignment has been submitted')
          setComment('')
          setUploadFile(false)
        }
      } catch (error) {
        toast.error(error.response.data.message)
        console.log('error is occuring:', error)
      }
    }
  };

  const handleUploadation = () => {
    if(field === 'Quiz'){
      handleUploadQuiz()
    }
    if(field === 'Assignment'){
      handleUploadAssignment()
    }
    if(field === 'Project'){
      handleUploadProject()
    }
    if(field === 'Exam'){
      handleUploadExam()
    }
  }


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
                color: "#07224D",
              }}
              className="text-start  px-2 py-[10px]"
            >
              Upload {field}
            </h1>
            <button className="px-2" onClick={() => setUploadFile(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div
            className={`bg-surface-100 p-6 rounded-xl space-y-5 `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div 
            className={`${isDragOver ? 'bg-blue-100' : ''} bg-[#EBF6FF] space-y-1 flex flex-col justify-center items-center p-4 border border-dashed border-blue-300 rounded-lg`}
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
                placeholder="regarding assignment or note"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full justify-center items-center">
              <button
                type="submit"
                onClick={handleUploadation}
                className="w-fit flex justify-center py-3 px-12 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadingFile;
