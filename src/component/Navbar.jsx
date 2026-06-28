import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

import winner from "../assets/winner.jpeg";
import { Link } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";

const Navbar = () => {

   const navigate = useNavigate();
   const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div>

        <nav className='flex mt-[30px] hidden md:block'>
              
               <div className='flex'>

               <div className='ml-[30px] font-bold text-[30px]'>
                <img src={winner} alt='winner' className='w-[80px] h-[60px]'/>
               </div>
       
              <ul className='flex font-bold gap-[50px] text-[20px] ml-[50px] mt-[10px] ml-[30px]'>
  <li className='text-purple-600'>
    <Link to="/home">Home</Link>
  </li>

  <li className='hover:text-orange-400'>
    <Link to="/">About</Link>
  </li>

  <li className="relative group cursor-pointer">
  <span className="hover:text-orange-400 transition-colors duration-300">
    Our Services
  </span>

  <div className="absolute left-0 top-full mt-2 w-[260px] bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
    
    <div
      onClick={() => navigate("/flight")}
      className="text-black text-[17px] py-[10px] px-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
    >
      Flight Ticket
    </div>

    <div
      onClick={() => navigate("/customized")}
      className="text-black text-[17px] py-[10px] px-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
    >
      Customized Tours
    </div>

    <div
      onClick={() => navigate("/hotel")}
      className="text-black text-[17px] py-[10px] px-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
    >
      Hotel Reservations
    </div>

    <div
      onClick={() => navigate("/travel")}
      className="text-black text-[17px] py-[10px] px-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
    >
      Travel Insurance
    </div>

    <div
      onClick={() => navigate("/vacation")}
      className="text-black text-[17px] py-[10px] px-5 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
    >
      Vacation Packages
    </div>

    <div
      onClick={() => navigate("/visa")}
      className="text-black text-[17px] py-[10px] px-5 hover:bg-gray-50 cursor-pointer"
    >
      Visa Procurement
    </div>

</div>
</li>

  <li className='hover:text-orange-400'>
    <Link to="/packages">Our Packages</Link>
  </li>

  <li className='hover:text-orange-400'>
    <Link to="/testimonies">Testimonies</Link>
  </li>

  <li className='hover:text-orange-400'>
    <Link to="/gallery">Gallery</Link>
  </li>

  <li className='hover:text-orange-400'>
    <Link to="/news">News & Update</Link>
  </li>

  <li className='hover:text-orange-400'>
    <Link to="/contact">Contact</Link>
  </li>
</ul>  
      
        </div>
        </nav>

        {/* MOBILE NAVBAR */}

        <div className='md:hidden'>

          <div className='flex justify-between items-center px-[20px] mt-[10px]'>
            <img src={winner} className='w-[70px] h-[70px]' alt='winner' />

            <CiMenuBurger
              onClick={() => setMobileMenu(!mobileMenu)}
              className='w-[40px] h-[40px] text-purple-700 font-bold cursor-pointer'
            />
          </div>

          {mobileMenu && (
            <div className='bg-white shadow-lg mt-[10px] w-full py-[10px] z-50'>

              <div
                onClick={() => {
                  navigate("/home");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Home
              </div>

              <div
                onClick={() => {
                  navigate("/");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                About
              </div>

              <div className='px-[20px] py-[12px] font-bold text-purple-700 border-b border-gray-200'>
                Our Services
              </div>

              <div
                onClick={() => {
                  navigate("/flight");
                  setMobileMenu(false);
                }}
                className='pl-[40px] py-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Flight Ticket
              </div>

              <div
                onClick={() => {
                  navigate("/customized");
                  setMobileMenu(false);
                }}
                className='pl-[40px] py-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Customized Tours
              </div>

              <div
                onClick={() => {
                  navigate("/hotel");
                  setMobileMenu(false);
                }}
                className='pl-[40px] py-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Hotel Reservations
              </div>

              <div
                onClick={() => {
                  navigate("/travel");
                  setMobileMenu(false);
                }}
                className='pl-[40px] py-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Travel Insurance
              </div>

              <div
                onClick={() => {
                  navigate("/vacation");
                  setMobileMenu(false);
                }}
                className='pl-[40px] py-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Vacation Packages
              </div>

              <div
                onClick={() => {
                  navigate("/visa");
                  setMobileMenu(false);
                }}
                className='pl-[40px] py-[10px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Visa Procurement
              </div>

              <div
                onClick={() => {
                  navigate("/packages");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Our Packages
              </div>

              <div
                onClick={() => {
                  navigate("/testimonies");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Testimonies
              </div>

              <div
                onClick={() => {
                  navigate("/gallery");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                Gallery
              </div>

              <div
                onClick={() => {
                  navigate("/news");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] border-b border-gray-200 cursor-pointer hover:bg-gray-100'
              >
                News & Update
              </div>

              <div
                onClick={() => {
                  navigate("/contact");
                  setMobileMenu(false);
                }}
                className='px-[20px] py-[12px] cursor-pointer hover:bg-gray-100'
              >
                Contact
              </div>

            </div>
          )}

        </div>

    </div>
  )
}

export default Navbar