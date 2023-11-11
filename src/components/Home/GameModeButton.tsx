import React from "react";
import { Link } from "react-router-dom";
type Props={
  text:string,
  mode:string,
};
const GameModeButton=({text,mode}:Props)=>{
  return (
    <Link to='/game-settings' state={{mode:mode,}} className='realtive inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-secondary rounded-full shadow-md group'>
      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <path stroke-linecap="round" stroke-linejoin='round' stroke-width='2' d='M14 517 7m0 01-7 7m7-7H3'></path>
      </svg>
      <span className="absolute flex items-center justify-center w-full h-full text-secondary transition-all ease duration-200 transform group-hover:translate-x-full ease">
        {text}
      </span>
      <span className="relative invisible">{text}</span>
    </Link>
  )
}
export default GameModeButton;
