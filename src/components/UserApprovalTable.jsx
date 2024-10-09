import React, { useEffect, useState } from "react";
import ApprovalUserModal from "./Modal/ApprovalUserModal";
// import { FaEye } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { TiArrowForward } from "react-icons/ti";
// import Link from "next/link";
const UserApprovalTable = ({
  users,
  loadingUsers,
  selectedOption,
  applications,
  locations,
  message,
}) => {
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userID, setUserID] = useState("");

  const handleModal = (user, userApplication) => {
    setUserID(userApplication.id);
    setSelectedUser(user);
    setModal(true);
  };
  const getUserApplication = (userEmail) => {
    // console.log('userEmail', userEmail)
    // console.log('users',users)
    return users.find((app) => app.email === userEmail) || {};
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-dark-300 rounded-lg divide-y divide-dark-200">
              <div className="overflow-hidden">
                <div className="relative max-h-[500px] overflow-y-auto scrollbar-webkit">
                  <table className="min-w-full divide-y divide-dark-200">
                    <thead className="bg-[#ffff] text-[#022567]  sticky top-0 z-10 shadow-sm shadow-dark-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 rounded-lg text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                        >
                          {selectedOption} Name
                        </th>
                        {/* <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                    >
                      DOB
                    </th> */}
                        <th
                          scope="col"
                          className=" py-4 px-6 text-start text-xs font-medium text-gray-500 uppercase w-[22%]"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                        >
                          City
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                        >
                          Contact No.
                        </th>
                        {/* <th
                        scope="col"
                        className="px-14 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[15%]"
                      >
                        Status
                      </th> */}
                        <th
                          scope="col"
                          className="px-6 py-4 rounded-lg text-center text-xs font-medium text-gray-500 uppercase w-[10%]"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-200">
                      {loadingUsers ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-400"
                          >
                            <CircularProgress size={20} />
                          </td>
                        </tr>
                      ) : message ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-400"
                          >
                            {message}
                          </td>
                        </tr>
                      ) : applications && users && locations ? (
                        applications.map((user, index) => {
                          const userApplication = getUserApplication(
                            user.email
                          );
                          return (
                            <tr key={index}>
                              <td className="px-6 whitespace-nowrap text-sm text-gray-800">
                                <div className="flex items-center gap-3">
                                  <div className="data">
                                    <p className="font-normal text-sm text-dark-900 capitalize">
                                      {user?.first_name} {user?.last_name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                                {user?.email || "-"}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                                {user?.city || "-"}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                                {user?.contact || "-"}
                              </td>
                              {/* <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                            16 years
                          </td> */}
                              {/* <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
                              <div className="whitespace-nowrap flex w-full justify-start text-sm text-surface-100">
                                <p
                                  className={`${
                                    user?.application_status === "pending"
                                      ? "bg-[#DDF8EE] text-blue-300 border border-blue-300"
                                      : "bg-[#18A07A]"
                                  } w-[120px] text-center px-4 py-2 rounded-lg capitalize`}
                                >
                                  {user?.application_status || "-"}
                                </p>
                              </div>
                            </td> */}
                              <td className="px-6 py-4 whitespace-nowrap w-full text-sm flex items-center justify-center gap-3">
                                {/* <div
                              className="flex items-center justify-center  group text-blue-300"
                              title="info"
                            >
                              {/* <Link href={`/user-management/users/${approvedProgramID}`}> *
                              <FaEye
                                size={23}
                                className="group-hover:text-[#3c8ca7]"
                              />
                              {/* </Link> *
                            </div> */}
                                <div
                                  className="flex items-center justify-center group text-blue-300"
                                  title="Assign classes"
                                  onClick={() =>
                                    handleModal(user, userApplication)
                                  }
                                >
                                  Assign a class
                                  <TiArrowForward
                                    size={23}
                                    className="pl-1 group-hover:text-[#3c8ca7]"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-4 text-dark-400"
                          >
                            No data found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {modal && selectedUser && (
          <ApprovalUserModal
            selectedOption={selectedOption}
            setModal={setModal}
            modal={modal}
            firstName={selectedUser.first_name}
            lastName={selectedUser.last_name}
            email={selectedUser.email}
            resume={selectedUser.resume}
            status={selectedUser.application_status}
            id={userID}
          />
        )}
      </div>
    </>
  );
};
export default UserApprovalTable;
