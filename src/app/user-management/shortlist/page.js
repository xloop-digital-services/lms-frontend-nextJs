"use client";
import React, { useEffect, useState } from "react";
import ShortListUserTable from "@/components/ShortlistUserTable";
import UserManagement from "@/components/UserManagement";

export default function Page(){

    return(
        <>
        <UserManagement heading='Approved Users' table={<ShortListUserTable />}/>
        
        </>
    )

}