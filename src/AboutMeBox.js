// src/AboutMeBox.js
import React, { useState, useEffect } from "react";
import "./AboutMeBox.css";

const aboutMeFacts = [
  "• Been designing for over 25 years. My spine disagrees with this career choice.",
  "• Graphic design, UI, branding—if it involves making things look good, I probably overthink it.",
  "• Been coding for about 3 years. I know enough to build things and enough to make them catastrophically fail.",
  "• Photoshop, Illustrator, After Effects, Premiere Pro—I spend more time looking at loading bars than making things.",
  "• Currently working on a few projects. Statistically, at least one of them might actually get finished.",
  "• UI/UX matters. If you make users suffer, they’ll leave. If you make me suffer, I’ll complain about it for days.",
  "• If you remember dial-up internet, you already know patience. If you don’t, you probably still have hope.",
  "• I’ve worked in nightclubs, startups, agencies, and from my bed. Only one of those is ideal.",
  "• Web3, blockchain, crypto—I’ve built things in that space. Somethings cool, somethings weird.",
  "• If something looks good but is miserable to use, I’ll fix it. If it looks bad *and* is miserable to use, I’ll judge you.",
  "• My process: Make it, hate it, redo it, overthink it, finally accept it, then tweak it forever.",
  "• Nightclub promo graphics taught me one thing—people will read absolutely anything if it glows.",
  "• If I had a pound for every 'mystery bug' I’ve encountered, I’d have enough money to quit fixing them.",
  "• I enjoy making things. Whether they’re useful is a separate discussion.",
  "• I’ll spend hours making a design pixel-perfect, but my own handwriting looks like I’m summoning demons.",
  "• Dark mode is superior. If you use light mode, I assume you’re a functional human being. I am not.",
  "• Fonts matter. If you use Comic Sans, I assume you have nothing to lose.",
  "• I could be working on a new project, or I could be staring at my screen wondering why my code suddenly stopped working.",
  "• There’s a fine line between ‘debugging’ and ‘creating a new problem.’ I cross that line daily.",
  "• If I ever say 'one last tweak,' I’m definitely lying.",
  "• I can design a website, write some code, and build a game, but I still somehow burn toast.",
  "• I explain things like you're five, because half the time, I also need them explained to me that way.",
  "• The only thing stopping me from throwing my computer out of the window is the fact that I need it to fix the problem.",
  "• If a project is going too smoothly, I get suspicious. And then something breaks.",
  "• ‘This will only take five minutes’ is the biggest lie in tech.",
  "• If the fonts aren’t kerned properly, I will see it. And I will suffer.",
  "• Everything is a ‘simple project’ until I actually start working on it.",
  "• My hobbies include making things and regretting making things.",
  "• If you think ‘how hard could it be?’, you have already made a mistake.",
  "• I once tried to take a break from projects. That became a project.",
  "• Half my job is making things work. The other half is pretending they were always meant to work that way.",
  "• Every day, I discover a new way to break something I just fixed.",
];


function AboutMeBox() {
  const [currentFact, setCurrentFact] = useState(aboutMeFacts[0]);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Typing effect logic
  useEffect(() => {
    setDisplayedText(""); // Reset text before typing
    setCharIndex(0);
  }, [currentFact]);

  useEffect(() => {
    if (charIndex < currentFact.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentFact[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
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
    }, 8000);

    return () => clearTimeout(factTimeout);
  }, [charIndex, currentFact]);

  return (
    <div className="about-me-box">
      <p>{displayedText}</p>
    </div>
  );
}

export default AboutMeBox;
