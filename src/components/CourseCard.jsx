"use client"
import React from 'react'
import Image from 'next/image';
import PropTypes from 'prop-types';
import { MdKeyboardArrowRight } from "react-icons/md";

const CourseCard = ({ image, category, title, progress, avatars, extraCount }) => {
    return (
        <div className='w-[300px] group bg-transparent h-auto'>
            <div className='rounded-xl border group-hover:cursor-pointer group-hover:shadow-lg group-hover:shadow-gray-300'>
                <Image src={image} alt="here you go" className='p-3 w-full ' />
                <div className='space-y-3 text-sm px-3 pt-2'>
                    <div className='flex bg-[#EBF6FF] w-fit py-[9px] px-5 rounded-lg items-center space-x-2'>
                        <p className='bg-[#03A1D8] w-2 h-2 rounded-full'></p>
                        <p className='text-[#03A1D8] uppercase text-[12px] font-semibold'>{category}</p>
                    </div>
                    <div>
                        <p>{title}</p>
                    </div> 
                    <div className='bg-[#EBF6FF] w-full h-2 rounded-xl'>
                        <div className='bg-[#03A1D8] w-[120px] h-2 rounded-xl' style={{ width: progress }}></div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className="flex pb-3 pt-2">
                            <div className="flex justify-end mr-2">
                                {avatars.map((avatar, index) => (
                                    <Image
                                        key={index}
                                        className="border-2 border-white dark:border-gray-800 rounded-full h-8 w-8 -mr-2"
                                        src={avatar}
                                        alt={`Avatar ${index}`}
                                    />
                                ))}
                                {extraCount && (
                                    <span
                                        className="flex items-center justify-center bg-[#EBF6FF] ml-2 dark:bg-gray-800 text-sm text-[#03A1D8] dark:text-white font-semibold border-2 border-gray-200 dark:border-gray-700 rounded-full p-1">
                                        +{extraCount - (avatars.length)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className='text-[#fcfeff] bg-[#03A1D8] p-1 rounded-full'>
                            <MdKeyboardArrowRight size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
    avatars: PropTypes.arrayOf(PropTypes.string).isRequired,
    extraCount: PropTypes.number
};
export default CourseCard