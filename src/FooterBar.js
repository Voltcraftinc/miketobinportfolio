// src/FooterBar.js
import React, { useState, useEffect, useRef } from "react";
import "./FooterBar.css";

// Import images
import headshot from "./assets/headshotcircle.png";
import miketobin from "./assets/miketobintext.png";

function FooterBar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [hoverStates, setHoverStates] = useState({
    linkedin: false,
    twitter: false,
    instagram: false,
    email: false
  });
  const hideTimeout = useRef(null);
  const footerRef = useRef(null);
  const interactionActive = useRef(false);

  // Handle mouse movements for showing/hiding the footer
  useEffect(() => {
    let lastMouseMove = 0;
  
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMouseMove < 100) return; // throttle to ~10 fps
      lastMouseMove = now;
  
      const distFromBottom = window.innerHeight - e.clientY;
  
      if (distFromBottom < 100 || interactionActive.current) {
        if (!visible) setVisible(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
      } else if (!interactionActive.current) {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
          setVisible(false);
        }, 100);
      }
    };
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
  
      if (documentHeight - scrollPosition < 150 && !visible) {
        setVisible(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
      }
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'End') {
        setVisible(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setTimeout(() => {
          if (!interactionActive.current) setVisible(false);
        }, 1000);
      }
  
      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    };
  
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [visible]);
  

  // Track user interaction with the footer
  useEffect(() => {
    const handleFooterInteraction = () => {
      interactionActive.current = true;
    };

    const handleFooterLeave = () => {
      interactionActive.current = false;
      hideTimeout.current = setTimeout(() => {
        setVisible(false);
      }, 800);
    };

    const footerElement = footerRef.current;
    if (footerElement) {
      footerElement.addEventListener("mouseenter", handleFooterInteraction);
      footerElement.addEventListener("mouseleave", handleFooterLeave);
    }

    return () => {
      if (footerElement) {
        footerElement.removeEventListener("mouseenter", handleFooterInteraction);
        footerElement.removeEventListener("mouseleave", handleFooterLeave);
      }
    };
  }, []);

  // Social icons data for easy management
  const socialLinks = [
    {
      name: "linkedin",
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/mike-tobin-39a8682b6/",
      icon: "https://img.icons8.com/?size=100&id=21088&format=png&color=000000"
    },
    {
      name: "twitter",
      title: "Twitter",
      url: "https://twitter.com/boonahgraphic",
      icon: "https://cdn.iconscout.com/icon/free/png-512/free-twitter-logo-icon-download-in-svg-png-gif-file-formats--x-new-logos-pack-icons-7651212.png?f=webp&w=256"
    },
    {
      name: "instagram",
      title: "Instagram",
      url: "https://instagram.com/myksquared",
      icon: "https://cdn.simpleicons.org/instagram/E1306C"
    },
    {
      name: "email",
      title: "Email Me",
      url: "mailto:mdtobin318@gmail.com",
      icon: "https://cdn.simpleicons.org/maildotru/000000"
    }
  ];

  // Sections data
  const sections = [
    {
      id: "design",
      title: "Graphic Design & Video",
      icons: [
        { name: "Photoshop", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
        { name: "Illustrator", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" },
        { name: "After Effects", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg" },
        { name: "Premiere Pro", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg" },
        { name: "InDesign", src: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg" },
        { name: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" }

      ]
    },
    {
      id: "web",
      title: "Web Development",
      icons: [
        { name: "HTML5", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS3", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Vue.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
        { name: "Bootstrap", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
        { name: "Node.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Tailwind CSS", src: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" }

      ]
    },
    {
      id: "game",
      title: "Game Development",
      icons: [
        { name: "Unity", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" },
        { name: "Phaser", src: "https://cdn.phaser.io/images/logo/phaser-planet-web.png" },
        { name: "Blender", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
        { name: "Gadot", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg" }
        
      ]
    }
  ];

  const handleSectionHover = (id) => {
    setActiveSection(id);
  };

  const handleSectionLeave = () => {
    setActiveSection(null);
  };

  const updateHoverState = (name, isHovered) => {
    setHoverStates(prev => ({
      ...prev,
      [name]: isHovered
    }));
  };

  return (
    <>
      {/* Hover Area to Keep Footer Visible */}
      <div className="footer-hover-zone"></div>

      <div 
        ref={footerRef}
        className={`footer-bar ${visible ? "show" : ""}`}
        role="contentinfo"
        aria-label="Contact information and skills"
      >
        <div className="footer-content">
          {/* Left Side: Headshot & Name with pulse animation */}
          <div className="footer-left">
            <div className={`headshot-container ${visible ? "animate-pulse" : ""}`}>
              <img src={headshot} alt="Mike Tobin headshot" className="footer-headshot" />
            </div>
            <img src={miketobin} alt="Mike Tobin" className="footer-name" />
          </div>

          {/* Social Icons Under Name */}
          <div className="footer-social">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                aria-label={social.title}
                onMouseEnter={() => updateHoverState(social.name, true)}
                onMouseLeave={() => updateHoverState(social.name, false)}
                className={hoverStates[social.name] ? "icon-hover-effect" : ""}
              >
                <div className="icon-wrapper">
                  <img 
                    title={social.title} 
                    src={social.icon} 
                    alt={social.title} 
                    className={`social-icon ${hoverStates[social.name] ? "icon-active" : ""}`}
                  />
                  {hoverStates[social.name] && (
                    <span className="icon-tooltip">{social.title}</span>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Middle Sections with hover effects */}
          <div className="footer-sections">
            {sections.map((section) => (
              <div 
                key={section.id}
                className={`footer-section ${activeSection === section.id ? "section-active" : ""}`}
                onMouseEnter={() => handleSectionHover(section.id)}
                onMouseLeave={handleSectionLeave}
              >
                <h4>{section.title}</h4>
                <div className="icon-group">
                  {section.icons.map((icon, idx) => (
                    <div 
                      key={icon.name} 
                      className="icon-container"
                      style={{ 
                        animationDelay: `${idx * 0.1}s`,
                        opacity: activeSection === section.id ? 1 : 0.7
                      }}
                    >
                      <img 
                        title={icon.name} 
                        src={icon.src} 
                        alt={icon.name} 
                        className={`skill-icon ${activeSection === section.id ? "pop-in" : ""}`}
                      />
                      {activeSection === section.id && (
                        <span className="skill-name">{icon.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer toggle button for mobile */}
          <button 
            className="footer-toggle"
            aria-label={visible ? "Hide footer" : "Show footer"}
            onClick={() => setVisible(!visible)}
          >
            <span className={`toggle-arrow ${visible ? "up" : "down"}`}>
              {visible ? "▼" : "▲"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default FooterBar;