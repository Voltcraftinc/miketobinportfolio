// src/DraggableCanvas.js
import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * A smoother, less jittery draggable canvas with:
 * - pointer events (mouse + touch)
 * - fixed portrait (141×200) images, object-fit: cover
 * - random distribution of images in a 21×21 grid
 * - minimum zoom so you can't zoom out beyond the grid
 * - tap an image to open Lightbox (no big drag)
 */
function DraggableCanvas({ images, onImageClick }) {
  // ~~~~~~~~~~~~~~~~~~ CONFIG ~~~~~~~~~~~~~~~~~~
  const GRID_SIZE = 21;          // 21x21 = 441 cells
  const HALF_GRID = 10;          // from row/col = -10..10
  const CELL_WIDTH = 141;        // forced portrait width
  const CELL_HEIGHT = 200;       // forced portrait height
  const SPACING_X = CELL_WIDTH;  // horizontal distance between cells
  const SPACING_Y = CELL_HEIGHT; // vertical distance
  const MAX_SCALE = 3;

  // *** Calculate total bounding box size ***
  // e.g. 21 * 141 wide = 2961
  // e.g. 21 * 200 tall = 4200
  const TOTAL_WIDTH = GRID_SIZE * CELL_WIDTH;
  const TOTAL_HEIGHT = GRID_SIZE * CELL_HEIGHT;

  // ~~~~~~~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~~~
  // We keep a "target" position and scale, and a "current" position and scale,
  // then smoothly animate "current" to "target" in rAF → reduces jitter.

  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [currentScale, setCurrentScale] = useState(1);
  const [targetScale, setTargetScale] = useState(1);

  const pointerDownRef = useRef(null); // for click vs drag detection
  const draggingRef = useRef(false);

  // ~~~~~~~~~~~~~~~~~~ RANDOM GRID ITEMS ~~~~~~~~~~~~~~~~~~
  const gridItems = useMemo(() => {
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
  }, [images]);

  // ~~~~~~~~~~~~~~~~~~ MIN SCALE (so entire grid fills screen) ~~~~~~~~~~~~~~~~~~
  // We want to prevent zooming out so far that we see outside the grid.
  // That means the entire bounding box must be at least as big as the screen.
  // minScale = max( screenWidth / TOTAL_WIDTH, screenHeight / TOTAL_HEIGHT ).
  const [minScale, setMinScale] = useState(0.2); // fallback

  useEffect(() => {
    function calcMinScale() {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const neededX = sw / TOTAL_WIDTH;
      const neededY = sh / TOTAL_HEIGHT;
      // whichever is larger ensures no empty space
      const ms = Math.max(neededX, neededY, 0.2);
      setMinScale(ms);
      // also clamp target scale if it's below ms
      setTargetScale((s) => (s < ms ? ms : s));
    }

    calcMinScale();
    window.addEventListener("resize", calcMinScale);
    return () => window.removeEventListener("resize", calcMinScale);
  }, []);

  // ~~~~~~~~~~~~~~~~~~ RAF LOOP FOR SMOOTHNESS ~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    let rafId;
    function animate() {
      // LERP between currentPos -> targetPos for less jitter
      setCurrentPos((pos) => {
        const lerpFactor = 0.3; // bigger → snappier, smaller → smoother
        const nx = pos.x + (targetPos.x - pos.x) * lerpFactor;
        const ny = pos.y + (targetPos.y - pos.y) * lerpFactor;
        return { x: nx, y: ny };
      });
      setCurrentScale((sc) => {
        const lerpFactor = 0.3;
        const nsc = sc + (targetScale - sc) * lerpFactor;
        return nsc;
      });
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [targetPos, targetScale]);

  // ~~~~~~~~~~~~~~~~~~ EVENT HANDLERS ~~~~~~~~~~~~~~~~~~

  // pointer down
  function onPointerDown(e) {
    e.preventDefault();
    draggingRef.current = true;

    // store pointer coords for click vs drag check
    pointerDownRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      target: e.target,
    };
  }

  // pointer move
  function onPointerMove(e) {
    if (!draggingRef.current) return;

    // see if user moved enough to consider it a drag
    if (!pointerDownRef.current.moved) {
      const dx = e.clientX - pointerDownRef.current.startX;
      const dy = e.clientY - pointerDownRef.current.startY;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        pointerDownRef.current.moved = true;
      }
    }

    // apply the movement to targetPos directly
    const dx = e.movementX || 0; 
    const dy = e.movementY || 0;
    setTargetPos((pos) => ({
      x: pos.x + dx,
      y: pos.y + dy,
    }));
  }

  // pointer up
  function onPointerUp(e) {
    draggingRef.current = false;
    // if not moved => it's a click
    if (!pointerDownRef.current.moved) {
      // if they tapped an image, open Lightbox
      if (pointerDownRef.current.target?.tagName === "IMG") {
        const imgSrc = pointerDownRef.current.target.src;
        onImageClick(imgSrc);
      }
    }
  }

  // wheel zoom
  function onWheel(e) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setTargetScale((prev) => {
      let next = prev + delta;
      // clamp scale
      if (next < minScale) next = minScale;
      if (next > MAX_SCALE) next = MAX_SCALE;
      return next;
    });
  }

  // ~~~~~~~~~~~~~~~~~~ SETUP LISTENERS ~~~~~~~~~~~~~~~~~~
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
  }, [onImageClick, minScale]); // safe to ignore other deps

  // ~~~~~~~~~~~~~~~~~~ RENDER ~~~~~~~~~~~~~~~~~~
  return (
    <div
      id="canvas-root"
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none", // mobile dragging
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
