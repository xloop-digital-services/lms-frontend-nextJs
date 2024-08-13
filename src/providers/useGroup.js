// "use client";
// import { createContext, useContext, useState } from "react";

// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const GroupContext = createContext();

// export const GroupProvider = ({ children }) => {
//   const [group, setGroup] = useState("");

//   console.log(group);

//   return (
//     <GroupContext.Provider value={{ group, setGroup }}>
//       {children}
//     </GroupContext.Provider>
//   );
// };

// export const useGroup = () => {
//   const context = useContext(GroupContext);
//   if (!context) {
//     throw new Error("useGroup must be used within a GroupProvider");
//   }
//   return context;
// };
