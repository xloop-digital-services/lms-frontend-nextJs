"use client";
import React, { useEffect, useState } from "react";
import UserManagement from "@/components/UserManagement";
import DevelopmentTable from "@/components/DevelopmentTable";

export default function Page(){

    return(
        <>
        <UserManagement heading='User Approval' table={<DevelopmentTable />} />
        </>
    )

}