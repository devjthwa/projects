import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: '#2c3e50', // A professional dark blue color
    color: '#ecf0f1', // Light text color for contrast
    padding: '.1em',
    textAlign: 'center',
    position: 'absolute',
    left: '0',
    bottom: '0',
    width: '100%',
  };

  const linkStyle = {
    color: '#3498db', // A lighter blue for links
    textDecoration: 'none',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
  };

  return (
    <footer style={footerStyle}>
      <div>
        <strong>CoreManage</strong> - Empowering Business Efficiency
      </div>
      <div>
        © {currentYear} DevCore. All rights reserved.
      </div>
      <div>
        <a href="/about" style={linkStyle}>About</a>
        <a href="/contact" style={linkStyle}>Contact</a>
        <a href="/privacy" style={linkStyle}>Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;