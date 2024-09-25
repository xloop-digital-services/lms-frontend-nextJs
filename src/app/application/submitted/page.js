import React from 'react'
import bouncing from "../../public/data/bouncing.json";
import Lottie from "lottie-react";


export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 h-screen bg-surface-100">
    <div className="text-center">
      <h1 className="text-4xl text-blue-300 font-bold mb-4">Thank You!</h1>
      <p className="text-lg text-blue-300">Your application has been submitted.</p>
      <p className="text-lg text-blue-300">Wait till the admin verify you.</p>
      <Lottie animationData={bouncing} className="h-[300px] p-0 bg-transparent" />
    </div>
  </div>
  )
}
