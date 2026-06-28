import React from 'react'
import winner from "../assets/winner.jpeg";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      
       
             <footer className="flex-col md:flex-row bg-[#081224] text-white">
             {/* Main Footer */}
             <div className="flex-col md:flex-row max-w-[1400px] mx-auto px-8 py-16">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                 {/* Logo Section */}
                 <div>
                   <img
                     src={winner}
                     alt="Tranquilane Travel Agency"
                     className="w-[320px] h-auto"
                   />
       
                   <div className="flex items-center gap-6 mt-5 text-2xl">
                     <FaInstagram className="cursor-pointer hover:text-orange-500 transition-colors duration-300" />
                     <FaFacebook className="cursor-pointer hover:text-orange-500 transition-colors duration-300" />
                     <FaTwitter className="cursor-pointer hover:text-orange-500 transition-colors duration-300" />
                   </div>
                 </div>
       
                 {/* Quick Links */}
                 <div className='text-center justify-center'>
                   <h3 className="text-[38px] text-purple-700 font-medium mb-8">
                     Quick Links
                   </h3>
       
                   <ul className="space-y-5 text-[20px]">
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Home
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       About Us
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Our Packages
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Gallery
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       News and Update
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Contact Us
                     </li>
                   </ul>
                 </div>
       
                 {/* Services */}
                 <div className='text-center'>
                   <h3 className="text-[38px] text-purple-700 font-medium mb-8">
                     Our Services
                   </h3>
       
                   <ul className="space-y-5 text-[20px]">
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Flight Booking
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Customized Tours
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Hotel Reservations
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Travel Insurance
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Vacation Packages
                     </li>
                     <li className="cursor-pointer hover:text-purple-700 transition-colors duration-300">
                       Visa Procurement
                     </li>
                   </ul>
                 </div>
       
                 {/* Office Info */}
                 <div className='text-center'>
                   <h3 className="text-[38px] text-purple-700 font-medium mb-8">
                     Office Info
                   </h3>
       
                   <div className="space-y-8 text-[20px]">
                     <p>
                       Block A, Shop 1, 3rd Avenue
                       <br />
                       Cornershop, Gwarimpa,
                       <br />
                       Abuja, Nigeria
                     </p>
       
                     <div>
                       <p className="font-medium">Email:</p>
                       <p>tranquilaneTravels@gmail.com</p>
                     </div>
       
                     <div>
                       <p className="font-medium">Phone:</p>
                       <p>+234-806-872-5251</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
       
             {/* Bottom Bar */}
             <div className="bg-[#F23A3A] py-6 px-8">
               <p className="text-center text-lg">
                 Copyright © 2026 Tranquilane Travels and Tours Limited |
                 Designed by{" "}
                 <span className="underline cursor-pointer hover:text-black transition-colors duration-300">
                   Oneder Technologies
                 </span>
               </p>
             </div>
           </footer>
       
       

    </div>
  )
}

export default Footer
