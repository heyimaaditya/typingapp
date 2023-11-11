import React from 'react'
import Logo from '../assets/logo.png'
type Props={};
const Home=(props:Props)=>{
  return (
    <div className="min-h-screen">
      <img className="w-60 mx-auto" src={Logo} alt="TypeSwift Logo" />
    </div>
  );
};
export default Home;