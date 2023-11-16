/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../assets/logo.png'
import useUserStore from '../../store/useUserStore';
import UserProfile from './UserProfile';

type Props={};
const Navbar=(props:Props)=>{
  ///destructing state and functions from useUserStore hook
  const [signInUser,signOutUser,token]=useUserStore((state)=>[
    state.signInUser,
    state.signOutUser,
    state.token,
  ])
  //function handling user Authentication
  const handleAuth=()=>{
    if(token){
      signOutUser();
    }else{
      signInUser();
    }
  }
  
  
  return (
    <nav className='py-1 px-4 w-full bg-primary'>
      <div className="max-w-7xl flex items-center justify-between mx-auto">
        <Link to='/' className="flex items-center h-full" >
         <img className='h-16' src={Logo} alt='logo'/> 
        </Link>
        <div className="space-x-4 flex items-center">
          <div className="sm:block hidden">
            <UserProfile/>
          </div>

          <button onClick={handleAuth} className="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md">
            <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
            <span className="relative px-6 py-3 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
              {/*conditional text based on token*/}
              <span className="relative text-sm sm:text-base text-white">{token ? 'Sign Out':'Sign In'}</span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;