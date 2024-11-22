"use client";
import { batchInfo } from "@/api/route";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";

const BatchUserModal = ({ selectedBatch, setOpenInfo }) => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const handleBatchInfo = async () => {
      try {
        const response = await batchInfo(selectedBatch);
        setInfo(response.data.data || []);
        setIsEmpty(response.data.data?.length === 0);
      } catch (error) {
        if (error.response?.status === 404) {
          setIsEmpty(true);
        }
      } finally {
        setLoading(false);
      }
    };

    handleBatchInfo();
  }, [selectedBatch]);

  const downloadPDF = () => {
    const worksheetData = [
      ["Student ID", "Student Name"], // Header row
      ...info.map((student) => [student.registration_id, student.name]), // Data rows
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const fileName = `Students_in_${selectedBatch}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className="w-[600px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        <div
          style={{ backgroundColor: "#EBF6FF" }}
          className="xsm:p-5 p-2 m-2 rounded-xl"
        >
          <div className="flex justify-between ">
            <div className="flex w-full justify-between items-center">
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: "17px",
                  lineHeight: "24.2px",
                  color: "#022567",
                }}
                className="text-center px-2 xsm:py-[10px] pb-[5px] font-exo"
              >
                Students in {selectedBatch}
              </h1>
              {info.length > 0 && (
                <div className="flex justify-end">
                  <button
                    className="bg-text-500 text-white px-4 py-2 rounded"
                    onClick={downloadPDF}
                    title="Download information"
                  >
                    <FaDownload className="text-blue-500" />
                  </button>
                </div>
              )}
            </div>
            <button className="px-2" onClick={() => setOpenInfo(false)}>
              <IoClose size={21} />
            </button>
          </div>

          <div className="bg-surface-100 xsm:p-6 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter h-[600px] overflow-y-scroll scrollbar-webkit">
            {loading ? (
              <div className="flex justify-center items-center w-full py-4">
                <CircularProgress size={20} />
              </div>
            ) : isEmpty ? (
              <div className="text-center text-sm text-dark-400 py-4">
                No students found
              </div>
            ) : (
              <div>
                <table className="min-w-full divide-y divide-dark-300">
                  <thead className="bg-surface-100 text-blue-500 top-0 z-10 shadow-sm shadow-dark-200">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-[15%]">
                        Student Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 overflow-y-scroll scrollbar-webkit">
                    {info.map((student, index) => (
                      <tr key={index}>
                        <td className="px-6 py-3 text-center whitespace-nowrap text-sm text-gray-800">
                          {student.registration_id}
                        </td>
                        <td className="px-6 py-3 text-center whitespace-nowrap text-sm text-gray-800 ">
                          {student.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchUserModal;
