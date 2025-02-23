// src/FooterBar.js
import React, { useState, useEffect, useRef } from "react";
import "./FooterBar.css";

// Import images
import headshot from "./assets/headshotcircle.png";
import miketobin from "./assets/miketobintext.png";

function FooterBar() {
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const distFromBottom = window.innerHeight - e.clientY;

      if (distFromBottom < 100) {
        setVisible(true);
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
        }
      } else {
        hideTimeout.current = setTimeout(() => {
          setVisible(false);
        }, 500);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <>
      {/* Hover Area to Keep Footer Visible */}
      <div className="footer-hover-zone"></div>

      <div className={`footer-bar ${visible ? "show" : ""}`}>
        <div className="footer-content">

          {/* Left Side: Headshot & Name */}
          <div className="footer-left">
            <img src={headshot} alt="Headshot" className="footer-headshot" />
            <img src={miketobin} alt="Mike Tobin" className="footer-name" />
          </div>

          {/* Social Icons Under Name */}
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/mike-tobin-39a8682b6/" target="_blank" rel="noreferrer">
              <img title="LinkedIn" src="https://img.icons8.com/?size=100&id=21088&format=png&color=000000" alt="LinkedIn" />
            </a>
            <a href="https://twitter.com/boonahgraphic" target="_blank" rel="noreferrer">
              <img title="Twitter" src="https://cdn.iconscout.com/icon/free/png-512/free-twitter-logo-icon-download-in-svg-png-gif-file-formats--x-new-logos-pack-icons-7651212.png?f=webp&w=256" alt="Twitter" />
            </a>
            <a href="https://instagram.com/myksquared" target="_blank" rel="noreferrer">
              <img title="Instagram" src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram" />
            </a>
            <a href="mailto:mdtobin318@gmail.com">
              <img title="Email Me" src="https://cdn.simpleicons.org/maildotru/000000" alt="Contact Me" />
            </a>
          </div>

          {/* Middle Sections (Graphic Design, Web Dev, Game Dev) */}
          <div className="footer-sections">

            {/* Graphic Design Section */}
            <div className="footer-section">
              <h4>Graphic Design & <br />Video Production</h4>
              <div className="icon-group">
                <img title="Photoshop" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" alt="Photoshop" />
                <img title="Illustrator" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" alt="Illustrator" />
                <img title="After Effects" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg" alt="After Effects" />
                <img title="Premiere Pro" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg" alt="Premiere Pro" />
                <img title="Premiere Pro" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg" alt="Indesign" />
              </div>
            </div>

            {/* Web Development Section */}
            <div className="footer-section">
              <h4>Web Development</h4>
              <div className="icon-group">
                <img title="HTML5" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" />
                <img title="CSS3" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" />
                <img title="JavaScript" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
                <img title="React" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
                <img title="Vue.js" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="Vue" />
                <img title="Bootstrap" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" />
                <img title="Node.js" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />
              </div>
            </div>

            {/* Game Development Section */}
            <div className="footer-section">
              <h4>Game Development</h4>
              <div className="icon-group">
                <img title="Unity" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" alt="Unity" />
                <img title="Phaser" src="https://cdn.phaser.io/images/logo/phaser-planet-web.png" alt="Phaser" />
                <img title="Blender" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" alt="Blender" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default FooterBar;
