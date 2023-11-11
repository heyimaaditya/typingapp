import React from "react";
import Footer from "./Footer";
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type Props={
  children:React.ReactNode;
};
const Layout=({children}:Props)=>{
  return (
    <div className="bg-dark text-white w-full h-full min-h-screen">
      <Navbar/>
      <ToastContainer position="bottom-left" />
      {children}
      <Footer/>
    </div>
  )
}
export default Layout;