// src/DraggableCanvas.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import imagesArray from "./autoImages";



/**
 * A smoother, less jittery draggable canvas with:
 * - pointer events (mouse + touch)
 * - fixed portrait (141×200) images, object-fit: cover
 * - random distribution of images in a 21×21 grid
 * - minimum zoom so you can't zoom out beyond the grid
 * - tap an image to open Lightbox (no big drag)
 */
function DraggableCanvas({ onImageClick }) {
  // ~~~~~~~~~~~~~~~~~~ CONFIG ~~~~~~~~~~~~~~~~~~
  const GRID_SIZE = 21;
  const HALF_GRID = 10;
  const CELL_WIDTH = 141;
  const CELL_HEIGHT = 200;
  const SPACING_X = CELL_WIDTH;
  const SPACING_Y = CELL_HEIGHT;
  const MAX_SCALE = 3;

  const TOTAL_WIDTH = GRID_SIZE * CELL_WIDTH;
  const TOTAL_HEIGHT = GRID_SIZE * CELL_HEIGHT;

  // ~~~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~~~
  const [images, setImages] = useState([]);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [currentScale, setCurrentScale] = useState(1);
  const [targetScale, setTargetScale] = useState(1);
  const [minScale, setMinScale] = useState(0.2);

  const pointerDownRef = useRef(null);
  const draggingRef = useRef(false);

  // ~~~~~~~~~~~~~~~~~~ LOAD COMPRESSED IMAGES ~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    setImages(imagesArray);
}, []);



  // ~~~~~~~~~~~~~~~~~~ GRID ITEMS ~~~~~~~~~~~~~~~~~~
  const gridItems = useMemo(() => {
    if (images.length === 0) return [];
    const items = [];
    for (let row = -HALF_GRID; row <= HALF_GRID; row++) {
      for (let col = -HALF_GRID; col <= HALF_GRID; col++) {
        const xPos = col * SPACING_X;
        const yPos = row * SPACING_Y;
        const randomIndex = Math.floor(Math.random() * images.length);
        items.push({
          key: `r${row}c${col}`,
          src: images[randomIndex],
          x: xPos,
          y: yPos,
        });
      }
    }
    return items;
  }, [images, SPACING_X, SPACING_Y]);

  // ~~~~~~~~~~~~~~~~~~ FIX: ADDED MISSING DEPENDENCIES ~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    function calcMinScale() {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const neededX = sw / TOTAL_WIDTH;
      const neededY = sh / TOTAL_HEIGHT;
      const ms = Math.max(neededX, neededY, 0.2);
      setMinScale(ms);
      setTargetScale((s) => (s < ms ? ms : s));
    }

    calcMinScale();
    window.addEventListener("resize", calcMinScale);
    return () => window.removeEventListener("resize", calcMinScale);
  }, [TOTAL_WIDTH, TOTAL_HEIGHT]);

  // ~~~~~~~~~~~~~~~~~~ RAF LOOP FOR SMOOTHNESS ~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    let rafId;
    function animate() {
      setCurrentPos((pos) => {
        const lerpFactor = 0.3;
        return {
          x: pos.x + (targetPos.x - pos.x) * lerpFactor,
          y: pos.y + (targetPos.y - pos.y) * lerpFactor,
        };
      });
      setCurrentScale((sc) => sc + (targetScale - sc) * 0.3);
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [targetPos, targetScale]);

  // ~~~~~~~~~~~~~~~~~~ POINTER EVENTS ~~~~~~~~~~~~~~~~~~
  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    pointerDownRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      target: e.target,
    };
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!draggingRef.current) return;

    if (!pointerDownRef.current.moved) {
      const dx = e.clientX - pointerDownRef.current.startX;
      const dy = e.clientY - pointerDownRef.current.startY;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        pointerDownRef.current.moved = true;
      }
    }

    const dx = e.movementX || 0;
    const dy = e.movementY || 0;
    setTargetPos((pos) => ({
      x: pos.x + dx,
      y: pos.y + dy,
    }));
  }, []);

  const onPointerUp = useCallback((e) => {
    draggingRef.current = false;
    if (!pointerDownRef.current.moved) {
      if (pointerDownRef.current.target?.tagName === "IMG") {
        const imgSrc = pointerDownRef.current.target.src;
        onImageClick(imgSrc);
      }
    }
  }, [onImageClick]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setTargetScale((prev) => {
      let next = prev + delta;
      if (next < minScale) next = minScale;
      if (next > MAX_SCALE) next = MAX_SCALE;
      return next;
    });
  }, [minScale]);

  // ~~~~~~~~~~~~~~~~~~ EVENT LISTENERS ~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    const el = document.getElementById("canvas-root");
    if (!el) return;

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [onPointerDown, onPointerMove, onPointerUp, onWheel]);

  // ~~~~~~~~~~~~~~~~~~ RENDER ~~~~~~~~~~~~~~~~~~
  return (
    <div
      id="canvas-root"
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none",
        userSelect: "none",
        cursor: draggingRef.current ? "grabbing" : "grab",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: `translate(${currentPos.x}px, ${currentPos.y}px) scale(${currentScale})`,
        }}
      >
        {gridItems.map((item) => (
          <img
            key={item.key}
            src={item.src}
            alt=""
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: "141px",
              height: "200px",
              objectFit: "cover",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default DraggableCanvas;
