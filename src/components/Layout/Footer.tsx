 
import React from 'react';
type Props = {};
const Footer = (props: Props) => {
  return (
    <footer className="bg-primary text-gray-50 text-sm sm:text-base">
      <div className="container flex flex-col items-center justify-center p-4 mx-auto md:p-6 lg:flex-row divide-gray-400">
        <p className="text-center px-6">
          <span className="text-blue-900">Developed with ❤️ By </span>
          <span className="font-semibold text-blue-900">Error 404: Team Not Found</span>
          <span className="text-blue-900">© {new Date().getFullYear()} </span>
        </p>
      </div>
    </footer>
  );
};
export default Footer;