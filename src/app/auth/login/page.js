"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import logo from '../../../../public/assets/img/logo.png'
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import Image from 'next/image';
import axios from "axios";

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const API = 'https://xb1kkjgb-8000.euw.devtunnels.ms/'

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const LogInpUser = async (event) => {
    event.preventDefault()
    try{
    const response = await axios.post(`${API}/api/login/`, {
      email,  
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status_code === 200) {
      console.log('res', response)
      router.push("/dashboard");
    }
  } catch (error) {
    console.log('error araha he')
    console.error(error)
  }

  }

  return (
    <div class="min-h-screen bg-[#F2F6FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6 font-inter">
      <div class="sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center space-x-6 pr-4">
        <Image class=" h-[75px] w-auto" src={logo} alt="Workflow" />
          {/* <h2 class=" text-3xl font-exo leading-9 font-extrabold text-gray-900">
            Learning Management 
          </h2> */}
      </div>
      <div class=" mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class=" bg-surface-100 py-8 px-4 shadow sm:rounded-xl sm:px-10">
          <div className='space-y-2'>
            <h1 className='font-exo font-bold text-xl text-center'> Login </h1>
            <p className='text-[#8A8A95] text-sm text-center'>Please enter your login information</p>
          </div>
          <form className='mt-5 ' onSubmit={LogInpUser}>
            
            <div className='space-y-2'>
              <label for="email" class="block text-sm font-medium leading-5  text-gray-700">Email</label>
              <div class="mt-1 relative rounded-lg ">
                <input 
                id="email" 
                name="email" 
                placeholder="user@example.com" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                class="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
               
              </div>
            </div>

            <div className='space-y-2 mt-6'>
              <div className='flex justify-between items-center'>
              <label for="password" class="block text-sm font-medium leading-5 text-gray-700">Password</label>
              <div class="text-sm leading-5">
                <Link href="#"
                  class="font-medium text-[#03A1D8] hover:text-[#03A1D8] focus:outline-none focus:underline transition ease-in-out duration-150">
                  Forgot your password?
                </Link>
              </div>
              </div>
              <div class="mt-1 relative rounded-lg ">
                <input 
                id="password" 
                name="password" 
                type={showPassword ? "text": "password" } 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                class="appearance-none block w-full px-3 py-2 border border-dark-300 rounded-lg placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-[#b0b0c0] hover:text-[#686870]" onClick={handleShowPassword}>
                  {showPassword ? <BsEyeSlashFill size={20} /> : <IoEyeSharp size={20}/>}
                </div>
              </div>
            </div>


            <div class="mt-6">
              <span class="block w-full rounded-lg shadow-sm">
                <button type="submit" class="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-dark-100 bg-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                  Sign in
                </button>
              </span>
            </div>
          </form>
            <div className='text-[#8A8A95] text-sm text-center mt-3 space-y-3'>
              <p>Dont have an account?
              <span className='text-[#03A1D8] pl-1 hover:text-[#2799bf] cursor-pointer hover:font-medium' >
                <Link href='/auth/signup'> SignUp </Link>
              </span></p>
              <p>or</p>
              <button class="w-full flex justify-center py-2 px-4 hover:text-white border bg-transparent text-sm font-medium rounded-lg text-[#03A1D8]  border-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">Register Now </button>
            </div>
        </div>
      </div>
    </div>
  )
}
