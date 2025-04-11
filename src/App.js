// src/App.js
import React, { useState } from "react";
import DraggableCanvas from "./DraggableCanvas";
import Lightbox from "./Lightbox";
import FooterBar from "./FooterBar"; // <-- import the footer
import imagesArray from "./autoImages";

import "./App.css";
import MaintenanceBanner from "./MaintenanceBanner";
import AboutMeBox from "./AboutMeBox";



function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  const handleImageClick = (src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setLightboxSrc("");
  };

  return (
    <div className="app-container">
      {/* Draggable + Zoomable Canvas */}
      <DraggableCanvas images={imagesArray} onImageClick={handleImageClick} />

      {/* Lightbox for clicked image */}
      {lightboxOpen && (
        <Lightbox imageSrc={lightboxSrc} onClose={handleCloseLightbox} />
      )}

      {/* Footer bar that slides up on mouse hover near bottom */}
      <FooterBar />
      <MaintenanceBanner />
      <AboutMeBox />


    </div>
  );
}

export default App;
