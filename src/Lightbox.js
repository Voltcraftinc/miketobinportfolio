// src/Lightbox.js
import React from "react";

function Lightbox({ imageSrc, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        cursor: "zoom-out",
      }}
    >
      <img
        src={imageSrc}
        alt="Lightbox"
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
          cursor: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default Lightbox;
