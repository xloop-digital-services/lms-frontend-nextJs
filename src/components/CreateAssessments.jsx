"use client";
import React from "react";

export default function CreateAssessments(
  assessmentData,
  setAssessmentData,
  handleAssignmentCreation
) {
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setAssessmentData((prevData) => ({
        ...prevData,
        file: selectedFile,
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = e.target;
    setAssessmentData((prevData)=>({
        ...prevData,
        [name]:value
    }))
  };

  return (
    <>
      <form>
        <div>
          <label className="text-md">Assignment Question</label>
          <input
            type="text"
            className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <label className="text-md">Assignment description</label>
          <textarea
            type="text"
            rows="4" 
            className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset p-2 sm:text-sm sm:leading-6"     
            // value={courseData.name}
            // onChange={(e) =>
            //   setCourseData({ ...courseData, name: e.target.value })
            // }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="text-md">Due Date</label>
          <input
            type="datetime-local"
            className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
            // value={courseData.name}
            // onChange={(e) =>
            //   setCourseData({ ...courseData, name: e.target.value })
            // }
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-md">Upload Assignment</label>
          <input
            type="file"
            className="block w-full outline-dark-300 focus:outline-blue-300 font-sans rounded-md border-0 mt-2 py-1.5 placeholder-dark-300 shadow-sm ring-1 ring-inset focus:ring-inset h-12 p-2 sm:text-sm sm:leading-6"
            // value={courseData.name}
            // onChange={(e) =>
            //   setCourseData({ ...courseData, name: e.target.value })
            // }

            // value={dueDate}
            onClick={handleFileUpload}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          onClick={handleAssignmentCreation}
          className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-dark-100 bg-blue-300 hover:bg-[#3272b6] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
        >
          Create Assignment
        </button>
      </form>
    </>
  );
}
