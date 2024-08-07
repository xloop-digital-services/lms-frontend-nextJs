import React from 'react'

const TopPart = () => {
  return (
    <div className=" ">
        <div className="flex flex-col">
          <div className="flex justify-between max-md:flex-col max-md:items-center">
            <h2 className="text-xl font-bold">
              Foundations of User Experience (UX) Design
            </h2>
            <p className="text-blue-300 font-bold ">Cr. hrs: 4(3-1)</p>
          </div>

          <p className="mt-2 mb-2 text-dark-500 max-md:text-center">
            This course is part of Google UX Design Professional Certificate
          </p>
        </div>
        <div className=" flex items-center mb-8 max-sm:flex-col">
          <div className="flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2 max-md:mt-2 ">
            <p className="bg-[#03A1D8] w-2 h-2 rounded-full"></p>
            <p className="text-[#03A1D8] uppercase text-[12px] ">
              Top Instructor
            </p>
          </div>
          <p className="ml-2 flex items-center"> Instructor: Noor Ahmed</p>
        </div>
        <div className="bg-[#EBF6FF] w-full h-2 rounded-xl">
          <div
            className="bg-[#03A1D8] w-[120px] h-2 rounded-xl"
            style={{ width: "50%" }}
          ></div>
        </div>
        <hr className="my-8 text-dark-200"></hr>
      </div>
  )
}

export default TopPart