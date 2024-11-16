import { batchInfo } from "@/api/route";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const BatchUserModal = ({ selectedBatch, setOpenInfo }) => {
  const [loading, setLoading] = useState(true);

  const [info, setInfo] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  useEffect(() => {
    const handleBatchInfo = async () => {
      try {
        const response = await batchInfo(selectedBatch);
        console.log("res", response);
        setInfo(response.data.data);
      } catch (error) {
        console.log("error", error);
        if (error.response.status === 404) {
          setIsEmpty(true);
        }
      } finally {
        setLoading(false);
      }
    };

    handleBatchInfo();
  }, [selectedBatch]);
  return (
    <div className="backDropOverlay h-screen flex justify-center items-center">
      <div className=" w-[600px] z-[1000] mx-auto my-20 overflow-auto scrollbar-webkit">
        <div
          style={{ backgroundColor: "#EBF6FF" }}
          className="xsm:p-5 p-2 m-2 rounded-xl"
        >
          <div className="flex justify-between">
            <h1
              style={{
                fontWeight: 700,
                fontSize: "17px",
                lineHeight: "24.2px",
                color: "#022567",
              }}
              className="text-center  px-2 xsm:py-[10px] pb-[5px] font-exo"
            >
              Class has been assigned to
            </h1>
            <button className="px-2" onClick={() => setOpenInfo(false)}>
              <IoClose size={21} />
            </button>
          </div>
          <div className="bg-surface-100 xsm:p-6 px-3 py-4 rounded-xl xsm:space-y-5 space-y-2 font-inter">
            {loading ? (
              <div className="flex justify-center items-center w-full py-4">
                {" "}
                <CircularProgress size={20} />
              </div>
            ) : (
              <div>
                {info.length > 0 ? (
                  <div>
                    <p className="font-bold text-lg pb-2">Student Names</p>{" "}
                    {/* Heading for the list */}
                    <ul className="list-decimal pl-4 max-h-[500px] overflow-auto scrollbar-webkit">
                      {info.map((student, index) => (
                        <li key={index} className="pl-2">
                          {student.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-4 text-dark-300 text-sm">No data found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchUserModal;
