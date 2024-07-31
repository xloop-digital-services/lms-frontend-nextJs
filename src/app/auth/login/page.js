"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link';
import logo from '../../../../public/assets/img/logo.png'
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import Image from 'next/image';
import axios from "axios";

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const API = process.env.NEXT_PUBLIC_BACKEND_URL
  const router = useRouter();

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const LogInpUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API}/api/login/`, {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('API response:', response);

      if (response.data.status_code === 200) {
        console.log('Login successful, navigating to dashboard');
        router.push('/dashboard');
      } else {
        console.log('Login failed, status code:', response.data.status_code);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div class="min-h-screen bg-[#F2F6FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6 font-inter">
      <div class="sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center space-x-6 pr-4">
        <Image class=" h-[75px] w-auto" src={logo} alt="Workflow" />
          {/* <h2 class=" text-3xl font-exo leading-9 font-extrabold text-dark-900">
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
              <label for="email" class="block text-sm font-medium leading-5  text-dark-700">Email</label>
              <div class="mt-1 relative rounded-lg ">
                <input 
                id="email" 
                name="email" 
                placeholder="user@example.com" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                class="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
               
              </div>
            </div>

            <div className='space-y-2 mt-6'>
              <div className='flex justify-between items-center'>
              <label for="password" class="block text-sm font-medium leading-5 text-dark-700">Password</label>
              <div class="text-sm leading-5">
                <Link href="/auth/reset-password"
                  class="font-medium text-[#03A1D8] hover:text-[#3092b2] focus:outline-none focus:underline transition ease-in-out duration-150">
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
                class="appearance-none block w-full p-3 border border-dark-300 rounded-lg placeholder-dark-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
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
              <span className='text-[#03A1D8] decoration-1 hover:underline font-medium pl-1 cursor-pointer' >
                <Link href='/auth/signup'> SignUp </Link>
              </span></p>
              <p>or</p>
              <button class="w-full flex justify-center py-2 px-4 hover:text-surface-100 border bg-transparent text-sm font-medium rounded-lg text-[#03A1D8]  border-[#03A1D8] hover:bg-[#2799bf] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">Register Now </button>
            </div>
        </div>
      </div>
    </div>
  )
}
