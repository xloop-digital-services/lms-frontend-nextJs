"use client";
import React, { useEffect, useState } from "react";
import ApprovedTable from "@/components/ApprovedUsersTable";
import UserManagement from "@/components/UserManagement";

export default function Page(){

    return(
        <>
        <UserManagement heading='Approved Users' table={<ApprovedTable />}/>
        </>
    )

}