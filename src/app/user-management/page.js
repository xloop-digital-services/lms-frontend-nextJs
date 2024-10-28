"use client";
import React, { useEffect, useState } from "react";
import UserManagement from "@/components/UserManagement";
import DevelopmentTable from "@/components/DevelopmentTable";
import { getAllPrograms } from "@/api/route";

export default function Page() {
 

 

  return (
    <>
      <UserManagement heading="User Approval" />
    </>
  );
}
