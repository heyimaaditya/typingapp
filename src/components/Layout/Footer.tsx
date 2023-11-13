 
import React from 'react';
type Props = {};
const Footer = (props: Props) => {
  const footerStyle: React.CSSProperties = {
    backgroundColor: '#3490dc',
    color: '#f8f9fa',
    fontSize: '0.875rem',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    margin: '0 auto',
  };
  const paragraphStyle: React.CSSProperties = {
    textAlign: 'center',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    color: '#165374',
  };
  const blueText: React.CSSProperties = {
    color: '#031120',

  };


  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={paragraphStyle}>
          <span style={blueText}>Developed with ❤️ By </span>
          <span style={blueText}>Error 404: Team Not Found</span>
          <span style={blueText}>© {new Date().getFullYear()} </span>
        </p>
      </div>
    </footer>
  );
};
export default Footer;