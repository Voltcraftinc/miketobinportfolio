// src/AboutMeBox.js
import React, { useState, useEffect, useRef } from "react";
import "./AboutMeBox.css";

const aboutMeFacts = [
  "• 25+ years in design. My back has the scars to prove it.",
  "• UI, branding, typography... if pixels can be arranged, I've obsessed over them.",
  "• Coding for 3 years. I've broken more things than I've fixed, but the ratio's improving.",
  "• Photoshop, Illustrator, After Effects—I've watched enough loading bars to last several lifetimes.",
  "• Currently juggling projects like a sleep-deprived circus performer.",
  "• Good UI/UX should be invisible. Bad UI/UX makes me rant to strangers at parties.",
  "• Survived dial-up internet. Nothing phases me anymore.",
  "• Worked everywhere from fancy agencies to my kitchen table. Only one lets me eat cereal at meetings.",
  "• Built enough Web3 projects to know both the potential and the bullshit.",
  "• My design process: make it, hate it, overthink it, redo it, accept it, secretly tweak it forever.",
  "• I'll spend 6 hours perfecting a layout but can't be bothered to iron a shirt.",
  "• Dark mode evangelist. Your retinas can thank me later.",
  "• If you use Comic Sans unironically, we need to have a serious talk.",
  "• Half my workday: creating. Other half: wondering why things suddenly stopped working.",
  "• 'Just one more small change' is the biggest lie I tell myself daily.",
  "• I can build a fully-functional web app but somehow manage to burn microwave popcorn.",
  "• My relationship with my computer is complicated. We're in couples therapy.",
  "• When a project goes too smoothly, I get suspicious.",
  "• I measure project timelines in coffee cups, not hours.",
  "• Bad kerning physically hurts me. It's like a visual paper cut.",
  "• Started a side project in 2019. It's still a 'quick weekend project'.",
  "• My hobbies include starting projects I'll probably never finish.",
  "• 'How hard could it be?' – words that have preceded every disaster in my career.",
  "• I once took a weekend off. Ended up redesigning my kitchen.",
  "• The code works? Don't touch it. Don't even look at it too hard.",
  "• Found a new bug this morning. Named it Steve. We've bonded.",

  // PROJECT LINKS - Store in a different format for JSX handling
  { text: "Working on a 2D game, Cosmic Cuddlies. Check it out: ", link: "https://cosmiccuddlies.netlify.app/", label: "Cosmic Cuddlies" },
  { text: "Also building a 3D MMO version of Cosmic Cuddlies. Early stages, but it's coming: ", link: "https://cosmiccuddliesworld.netlify.app/", label: "Cosmic Cuddlies World" },
  { text: "Ever played a portfolio? Mine is a fully interactive 2D game: ", link: "https://miketobin-industrywork.netlify.app/", label: "Mike Tobin Industry Work" },
  { text: "Built Ghost Run, an endless survival game. Try to stay alive: ", link: "https://ghostrun-game.netlify.app/", label: "Ghost Run" },
  { text: "Doggington—no, not that kind. It's a memecoin-inspired game: ", link: "https://doggington-game.netlify.app/", label: "Doggington" },
  { text: "Working with Wavora, a Web3-based project. Check it out: ", link: "https://wavora.netlify.app/", label: "Wavora" },
  { text: "Cooking up something new with Reciply, a recipe finder based on what's in your fridge: ", link: "https://reciplyapp.netlify.app/", label: "Reciply" },
];

function AboutMeBox() {
  const [currentFact, setCurrentFact] = useState(aboutMeFacts[0]);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const boxRef = useRef(null);
  const [showLink, setShowLink] = useState(false);

  // Add hover effect
  const handleMouseEnter = () => {
    if (boxRef.current) {
      boxRef.current.classList.add('expanded');
    }
  };

  const handleMouseLeave = () => {
    if (boxRef.current) {
      boxRef.current.classList.remove('expanded');
    }
  };

  // Randomly trigger glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Ensure we include some link facts in the rotation
  useEffect(() => {
    // After a few regular facts, force a link fact occasionally
    const linkFactTimeout = setInterval(() => {
      if (typeof currentFact === 'string' && Math.random() > 0.7) {
        // Force a link fact
        const linkFacts = aboutMeFacts.filter(fact => typeof fact === 'object');
        setCurrentFact(linkFacts[Math.floor(Math.random() * linkFacts.length)]);
      }
    }, 20000);
    
    return () => clearInterval(linkFactTimeout);
  }, [currentFact]);

  // Typing effect logic
  useEffect(() => {
    setDisplayedText(""); // Reset text before typing
    setCharIndex(0);
    setShowLink(false);
  }, [currentFact]);

  useEffect(() => {
    if (charIndex < (typeof currentFact === "string" ? currentFact.length : currentFact.text.length)) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + (typeof currentFact === "string" ? currentFact[charIndex] : currentFact.text[charIndex]));
        setCharIndex((prev) => prev + 1);
      }, 30); // Faster typing speed
      return () => clearTimeout(timeout);
    } else {
      // Once typing is complete, show link if applicable
      if (typeof currentFact === "object") {
        setShowLink(true);
      }
    }

    // Change fact after delay
    const factTimeout = setTimeout(() => {
      setCurrentFact((prevFact) => {
        let newFact;
        do {
          newFact = aboutMeFacts[Math.floor(Math.random() * aboutMeFacts.length)];
        } while (newFact === prevFact); // Ensures a different fact
        return newFact;
      });
    }, 6000); // Slightly longer display time

    return () => clearTimeout(factTimeout);
  }, [charIndex, currentFact]);

  return (
    <div 
      className={`about-me-box ${glitching ? 'glitch' : ''}`}
      ref={boxRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="about-me-inner">
        <div className="about-me-content">
          {typeof currentFact === "string" ? (
            <p>{displayedText}<span className="cursor"></span></p>
          ) : (
            <p>
              {displayedText}
              {showLink && (
                <a href={currentFact.link} target="_blank" rel="noopener noreferrer">
                  {currentFact.label}
                </a>
              )}
              <span className="cursor"></span>
            </p>
          )}
        </div>
        <div className="terminal-decoration">
          <div className="terminal-buttons">
            <span className="terminal-button"></span>
            <span className="terminal-button"></span>
            <span className="terminal-button"></span>
          </div>
          <div className="terminal-title">about_me.exe</div>
        </div>
      </div>
    </div>
  );
}

export default AboutMeBox;