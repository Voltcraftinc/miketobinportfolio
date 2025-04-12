// src/MaintenanceBanner.js
import React, { useState, useEffect } from "react";
import "./MaintenanceBanner.css";

function MaintenanceBanner() {
  const [glitching, setGlitching] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [statusText, setStatusText] = useState("Initializing systems...");

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      }
    }, 4000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Cycling status messages
  useEffect(() => {
    const statusMessages = [
      "Initializing systems...",
      "Optimizing code base...",
      "Calibrating UI elements...",
      "Enhancing visuals...",
      "Debugging portfolio...",
      "Reticulating splines...",
      "Applying neural upgrades...",
      "Polishing pixels...",
    ];
    
    const messageInterval = setInterval(() => {
      setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
    }, 3000);
    
    return () => clearInterval(messageInterval);
  }, []);

  // Simulated progress
  useEffect(() => {
    const simulateProgress = () => {
      setProgressValue(prevValue => {
        // Random progress that fluctuates
        const newValue = prevValue + (Math.random() * 15 - 5);
        // Keep within 10-95% range
        return Math.min(Math.max(newValue, 10), 95);
      });
    };
    
    const progressInterval = setInterval(simulateProgress, 2000);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className={`maintenance-banner ${glitching ? 'glitch' : ''}`}>
      <div className="maintenance-banner-inner">
        <div className="terminal-decoration">
          <div className="terminal-buttons">
            <span className="terminal-button"></span>
            <span className="terminal-button"></span>
            <span className="terminal-button"></span>
          </div>
          <div className="terminal-title">system_maintenance.exe</div>
        </div>
        
        <div className="maintenance-content">
          <div className="maintenance-header">
            <span className="warning-icon">⚠</span>
            <p>Portfolio Undergoing Maintenance</p>
            <span className="warning-icon">⚠</span>
          </div>
          
          <div className="status-message">
            <span className="status-indicator"></span>
            <p>{statusText}</p>
          </div>
          
          <div className="loading-bar-container">
            <div className="loading-bar">
              <div 
                className="loading-progress" 
                style={{width: `${progressValue}%`}}
              ></div>
            </div>
            <div className="progress-value">{Math.round(progressValue)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceBanner;