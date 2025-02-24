// src/AboutMeBox.js
import React, { useState, useEffect } from "react";
import "./AboutMeBox.css";

const aboutMeFacts = [
  "• 25+ years in design. My spine regrets this career choice daily.",
  "• UI, branding, typography—if it involves making things look good, I care about it. Probably too much.",
  "• Coding for 3 years. I can build things. I can also break them in ways I didn’t think were possible.",
  "• Photoshop, Illustrator, After Effects, Premiere Pro—spent half my life staring at progress bars.",
  "• Currently juggling multiple projects. Odds are, at least one will make it out alive.",
  "• UI/UX should make sense. If your design makes people suffer, they’ll leave. If it makes *me* suffer, I’ll never shut up about it.",
  "• If you survived dial-up, you’ve already experienced true pain.",
  "• I’ve worked in agencies, startups, clubs, and at home. Only one of those lets me wear pajama bottoms.",
  "• Web3, blockchain, crypto—I’ve built things in that world. Some were useful. Some were… experiments.",
  "• If something looks good but works like shit, I fix it. If it looks bad *and* works like shit, I judge it.",
  "• Design process: Make it, hate it, redo it, overthink it, accept it, then tweak it forever.",
  "• If it glows and has motion, people will read anything. Nightclub promos taught me that.",
  "• Every mystery bug has a price. If I got paid per bug, I wouldn’t need to fix them anymore.",
  "• I make things because I enjoy it. Whether they’re useful is a separate issue.",
  "• I’ll spend hours making a design pixel-perfect. Meanwhile, my handwriting looks like an exorcism.",
  "• Dark mode is non-negotiable. Light mode is for people who have their life together. That’s not me.",
  "• Fonts matter. If you use Comic Sans, I assume you’re beyond saving.",
  "• Half my time is spent making things. The other half is figuring out why they suddenly stopped working.",
  "• Debugging is just creative problem-solving. Sometimes too creative.",
  "• ‘One last tweak’ is never actually the last tweak.",
  "• I can design, code, and build a game. Somehow, I still manage to burn toast.",
  "• The only reason my computer hasn’t been thrown out the window is that I need it to fix whatever just broke.",
  "• If a project is going too smoothly, something is definitely about to break.",
  "• ‘This will only take five minutes’ is a lie. Every time.",
  "• Badly kerned fonts haunt me. Adjust your tracking before I do it for you.",
  "• Everything is a ‘quick project’ until it isn’t.",
  "• Hobbies: Making things, and then questioning why I started making them.",
  "• If you’ve ever thought ‘how hard could it be?’, congratulations, you’ve just cursed yourself.",
  "• I once tried to take a break. That turned into a project.",
  "• Making things work is only half the job. The other half is pretending they were always meant to work that way.",
  "• Every day, I find a new way to break something I just fixed.",

  // PROJECT LINKS - Store in a different format for JSX handling
  { text: "Working on a 2D game, Cosmic Cuddlies. Check it out: ", link: "https://cosmiccuddlies.netlify.app/", label: "Cosmic Cuddlies" },
  { text: "Also building a 3D MMO version of Cosmic Cuddlies. Early stages, but it's coming: ", link: "https://cosmiccuddliesworld.netlify.app/", label: "Cosmic Cuddlies World" },
  { text: "Ever played a portfolio? Mine is a fully interactive 2D game: ", link: "https://miketobin-industrywork.netlify.app/", label: "Mike Tobin Industry Work" },
  { text: "Built Ghost Run, an endless survival game. Try to stay alive: ", link: "https://ghostrun-game.netlify.app/", label: "Ghost Run" },
  { text: "Doggington—no, not that kind. It’s a memecoin-inspired game: ", link: "https://doggington-game.netlify.app/", label: "Doggington" },
  { text: "Working with Wavora, a Web3-based project. Check it out: ", link: "https://wavora.netlify.app/", label: "Wavora" },
  { text: "Cooking up something new with Reciply, a recipe finder based on the ingredients you have to hand.: ", link: "https://reciplyapp.netlify.app/", label: "Reciply" },
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
    if (charIndex < (typeof currentFact === "string" ? currentFact.length : currentFact.text.length)) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + (typeof currentFact === "string" ? currentFact[charIndex] : currentFact.text[charIndex]));
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
    }, 5000);

    return () => clearTimeout(factTimeout);
  }, [charIndex, currentFact]);

  return (
    <div className="about-me-box">
      {typeof currentFact === "string" ? (
        <p>{displayedText}</p>
      ) : (
        <p>
          {displayedText}
          {charIndex >= currentFact.text.length && (
            <a href={currentFact.link} target="_blank" rel="noopener noreferrer">
              {currentFact.label}
            </a>
          )}
        </p>
      )}
    </div>
  );
}

export default AboutMeBox;
