import React, { useEffect, useState } from "react";
import ApprovalUserModal from "./Modal/ApprovalUserModal";
import { FaEye } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { TiArrowForward } from "react-icons/ti";
import { getSuggestedSessionForStudent } from "@/api/route";
import Link from "next/link";

const UserApprovalTable = ({
  users,
  loadingUsers,
  selectedOption,
  applications,
  locations,
  userPrograms,
  userSkills,
  message,
  count,
  approvedProgramID,
}) => {
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [appLocationId, setAppLocationId] = useState("");
  const [userID, setUserID] = useState("");
  const [selectedStudentLocation, setSelectedStudentLocation] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocationId, setSelectedLocationID] = useState("");
  //   console.log(message);

  const handleModal = (user, userApplication, userLocation, program, skill) => {
    setSelectedStudentLocation(userLocation.name);
    setSelectedLocationID(userLocation.id);
    // if (selectedOption === "student") {
    //   setSelectedProgram(program.name);
    // }
    setUserID(userApplication.id);
    setSelectedUser(user);
    setModal(true);
  };

  const getUserApplication = (userEmail) => {
    console.log("userEmail", userEmail);
    return users.find((app) => app.email === userEmail) || {};
  };

  const getUserLocation = (userLocationId) => {
    const locationId = Array.isArray(userLocationId) ? userLocationId[0] : null;
    return locations.find((location) => location.id === locationId) || {};
  };

  //   const getUserProgram = (programid) => {
  //     if (selectedOption === "student") {
  //       const programId = Array.isArray(programid) ? programid[0] : null;
  //       return userPrograms.find((program) => program.id === programId);
  //     }
  //   };

  //   const handleGetSuggestedSessions = async () => {
  //     try {
  //       const response = await getSuggestedSessionForStudent(
  //         approvedProgramID,
  //         selectedLocationId
  //       );
  //       console.log("response of the suggested sessions", response.data);
  //     } catch (error) {
  //       console.log(error.response);
  //     }
  //   };
  //   useEffect(() => {
  //     if (selectedOption === "student") {
  //       handleGetSuggestedSessions();
  //     }
  //   }, [approvedProgramID, selectedLocationId]);

  //   const getUserSkills = (skillIds) => {
  //     if (selectedOption === "instructor") {
  //       // Ensure skillIds is treated as an array
  //       const idsArray = Array.isArray(skillIds) ? skillIds[0] : null;

  //       // Map over the skill IDs to find the corresponding skill objects from the userSkills array
  //       //   const matchedSkills = idsArray
  //       //     .map((id) => userSkills.find((skill) => skill.id === id))
  //       // Filter out any undefined values

  //       console.log("skilslllll jsakdsksjd", idsArray);
  //       console.log("skilslllll isdssssss", skillIds);

  //       return userSkills.find((skill) => skill.id === idsArray);
  //     }
  //     return [];
  //   };

  //   console.log("skilsllllllllllllllllllllllllllllll", selectedSkills);

  //   useEffect to call functions based on selectedOptionon]);

  return (
    <div className="flex flex-col h-full">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border border-dark-300 rounded-lg divide-y divide-dark-200">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-dark-200">
                <thead className="bg-dark-50 dark:bg-dark-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[18%]"
                    >
                      {selectedOption} Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                    >
                      DOB
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                    >
                      Area
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[14%]"
                    >
                      Education
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-start text-xs font-medium text-gray-500 uppercase w-[16%]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase w-[15%]"
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
                      const userApplication = getUserApplication(user.email);
                      const userLocation = getUserLocation(user.location);
                      //   const userProgram = getUserProgram(user.program);
                      //   const userSkill = getUserSkills(user.required_skills);

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
                            {user?.date_of_birth || "-"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                            {userApplication.city || "-"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                            {userLocation.name || "-"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">
                            16 years
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-800">
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-full text-sm flex items-center justify-center gap-3">
                            <div
                              className="flex items-center justify-center  group text-[#03A1D8]"
                              title="info"
                            >
                              {/* <Link href={`/user-management/users/${approvedProgramID}`}> */}
                              <FaEye
                                size={23}
                                className="group-hover:text-[#3c8ca7]"
                              />
                              {/* </Link> */}
                            </div>
                            <div
                              className="flex items-center justify-center group text-[#03A1D8]"
                              title="assign sessions"
                              onClick={() =>
                                handleModal(
                                  user,
                                  userApplication,
                                  userLocation
                                  //   userProgram,
                                  //   userSkill
                                )
                              }
                            >
                              <TiArrowForward
                                size={23}
                                className="group-hover:text-[#3c8ca7]"
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

            {modal && selectedUser && (
              <ApprovalUserModal
                selectedOption={selectedOption}
                setModal={setModal}
                modal={modal}
                firstName={selectedUser.first_name}
                lastName={selectedUser.last_name}
                email={selectedUser.email}
                status={selectedUser.application_status}
                locations={selectedStudentLocation}
                // programs={selectedProgram}
                // skills={selectedSkills}
                id={userID}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApprovalTable;
