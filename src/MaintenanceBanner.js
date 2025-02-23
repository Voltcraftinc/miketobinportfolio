// src/MaintenanceBanner.js
import React from "react";
import "./MaintenanceBanner.css";

function MaintenanceBanner() {
  return (
    <div className="maintenance-banner">
      <p>🚧 Portfolio Undergoing Maintenance 🚧</p>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
}

export default MaintenanceBanner;
