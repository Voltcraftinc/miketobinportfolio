// src/FooterBar.js
import React, { useState, useEffect } from "react";
import "./FooterBar.css";


// Import your single banner image (in src/assets) and any icons from a CDN or local
import lowerBanner from "./assets/lowerbanner.png";

function FooterBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const distFromBottom = window.innerHeight - e.clientY;
      setVisible(distFromBottom < 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`footer-bar ${visible ? "show" : ""}`}>
      <div className="footer-content">
        {/* The big banner image */}
        <img
          src={lowerBanner}
          alt="Footer Banner"
          className="footer-banner-img"
        />

             </div>
    </div>
  );
}

export default FooterBar;
