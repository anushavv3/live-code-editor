import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <span className="footer-copyright">© {currentYear} XentariCode. All rights reserved.</span>
        </div>
        
        <div className="footer-links">
          <a href="https://github.com/ivy" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;