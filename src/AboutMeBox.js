// src/AboutMeBox.js
import React, { useState, useEffect } from "react";
import "./AboutMeBox.css";

const aboutMeFacts = [
  "• Been designing for over 25 years. The aches in my back and my need for bigger font sizes should tell you my age.",
  "• Frontend, UI/UX, and some backend. Enough to break things, enough to fix them. Usually in that order.",
  "• Making games with Unity & Phaser—because clearly, I never outgrew clicking things for loot.",
  "• Always tinkering with new tech. Web3, AI, whatever’s trending—except NFTs. Learned my lesson there.",
  "• Photoshop, Illustrator, After Effects, Premiere Pro—I know them well. Whether I love them is a different story.",
  "• Currently building Necrotap, Cosmic Cuddlies, and whatever ridiculous idea I come up with next.",
  "• Coding for about 3 years. Not a wizard, but I can make shit work. Eventually.",
  "• If it looks good but is a nightmare to use, I will fix it. If it looks bad and is a nightmare to use, I will judge it.",
  "• Web3, blockchain, crypto projects—I’ve seen some things, man.",
  "• React, Vue, JavaScript, and a sprinkle of backend. Enough full-stack to get by, but let’s not pretend I’m running Google.",
  "• Started with graphic design, somehow ended up doing everything.",
  "• Self-taught in pretty much everything. Trial, error, and an unhealthy amount of caffeine.",
  "• If you remember dial-up, you probably also remember the trauma of your mum picking up the phone mid-download.",
  "• Building tools, bots, websites, and whatever nonsense people throw my way.",
  "• Used to do a lot of video production. Now, I mostly critique bad editing on YouTube like a grumpy old man.",
  "• Spent too many years making nightclub promo graphics. If you ever saw a dodgy flyer with a shirtless DJ, sorry.",
  "• I like making things. Doesn’t really matter what. Sometimes useful, sometimes questionable.",
  "• My game dev style: 'Let’s build this and see what happens.' Sometimes it happens. Sometimes it crashes.",
  "• My projects list is long. My finished projects list is much, much shorter.",
  "• Pixel-perfect or it doesn’t leave my desk. Slightly misaligned buttons haunt me in my sleep.",
  "• Learning AI integration now. Not because I want to, but because the robots are coming whether I like it or not.",
  "• Built a Telegram game, a clicker game, a crypto project—what’s next? Hopefully, something less stressful.",
  "• Can design a sleek UI, write some code, and build a game, but still somehow burn toast.",
  "• I explain things like you're five, mostly because I need the same explanation myself half the time.",
  "• I don’t just make games, I suffer through making games. If you know, you know.",
  "• I could be working on a new project… or staring at my screen wondering why the semicolon broke everything."
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
