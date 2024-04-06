import React from "react";
import { Link } from "react-router-dom";
import "../../styles/authstyle.css"; // Corrected file name

const Footer = () => {
  return (
    <div className="paddings footer-container">
      <div className="footer-about">
        <h3>
          <b>Crypto Lands</b>
        </h3>
        <p>
          <b>Crypto Lands</b> is a digital platform for buying, selling, and
          trading cryptocurrencies. We provide secure, reliable, and easy-to-use
          solutions for crypto enthusiasts, traders, and investors.
        </p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/blog">Services</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>
      <div className="footer-copyright">
        <p>© 2023 Crypto Lands. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
