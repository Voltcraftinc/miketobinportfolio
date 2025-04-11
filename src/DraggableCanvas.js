// EnhancedDraggableCanvas.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import imagesArray from "./autoImages";

function EnhancedDraggableCanvas({ onImageClick }) {
  // ~~~~~~~~~~~~~~~~~~ CONFIG ~~~~~~~~~~~~~~~~~~
  const CELL_WIDTH = 180;
  const CELL_HEIGHT = 250;
  const SPACING_X = CELL_WIDTH + 10;
  const SPACING_Y = CELL_HEIGHT + 15;
  const MAX_SCALE = 4;
  const INITIAL_SCALE = 0.9;

  // ✅ CHANGE: Better initial center logic
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const initialCenter = {
    x: -(viewportDimensions.width / 2 - CELL_WIDTH / 2),
    y: -(viewportDimensions.height / 2 - CELL_HEIGHT / 2)
  };

  const [currentPos, setCurrentPos] = useState(initialCenter);
  const [targetPos, setTargetPos] = useState(initialCenter);
  const [currentScale, setCurrentScale] = useState(INITIAL_SCALE);
  const [targetScale, setTargetScale] = useState(INITIAL_SCALE);
  const [minScale, setMinScale] = useState(0.2);
  const [seed] = useState(Math.floor(Math.random() * 10000));
  const [hoveredItem, setHoveredItem] = useState(null);
  const [images, setImages] = useState([]);

  const pointerDownRef = useRef(null);
  const draggingRef = useRef(false);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const inertiaFrameRef = useRef(null);

  useEffect(() => {
    setImages(imagesArray);
  }, []);

  const getConsistentRandom = useCallback((x, y) => {
    const hash = (x * 13769 + y * 12781 + seed) % 10000;
    return hash / 10000;
  }, [seed]);

  const colorPaletteMemo = useMemo(() => [
    "#FF5A5F", "#00A699", "#FC642D", "#484848", "#767676",
    "#3B5998", "#4285F4", "#34A853", "#FBBC05", "#EA4335"
  ], []);

  const getItemColor = useCallback((row, col) => {
    const index = Math.floor(getConsistentRandom(row, col) * colorPaletteMemo.length);
    return colorPaletteMemo[index];
  }, [getConsistentRandom, colorPaletteMemo]);

  useEffect(() => {
    function updateViewportDimensions() {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    updateViewportDimensions();
    window.addEventListener("resize", updateViewportDimensions);
    return () => window.removeEventListener("resize", updateViewportDimensions);
  }, []);

  useEffect(() => {
    function calcMinScale() {
      const { width, height } = viewportDimensions;
      const minDimension = Math.min(width, height);
      const ms = Math.max(minDimension / (SPACING_Y * 6), 0.2);
      setMinScale(ms);
      setTargetScale((s) => (s < ms ? ms : s));
    }

    calcMinScale();
  }, [viewportDimensions, SPACING_Y]);

  const visibleGridItems = useMemo(() => {
    if (viewportDimensions.width === 0 || images.length === 0) return [];

    const items = [];
    const centerX = -currentPos.x / currentScale;
    const centerY = -currentPos.y / currentScale;
    const visibleWidth = viewportDimensions.width / currentScale;
    const visibleHeight = viewportDimensions.height / currentScale;
    const startCol = Math.floor((centerX - visibleWidth / 2) / SPACING_X) - 2;
    const endCol = Math.ceil((centerX + visibleWidth / 2) / SPACING_X) + 7;
    const startRow = Math.floor((centerY - visibleHeight / 2) / SPACING_Y) - 2;
    const endRow = Math.ceil((centerY + visibleHeight / 2) / SPACING_Y) + 2;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const xPos = col * SPACING_X;
        const yPos = row * SPACING_Y;
        const itemKey = `r${row}c${col}`;
        const imgIndex = Math.abs((row * 31 + col * 17 + seed) % images.length);

        items.push({
          key: itemKey,
          src: images[imgIndex],
          x: xPos,
          y: yPos,
          row,
          col,
          color: getItemColor(row, col),
          parallaxOffset: getConsistentRandom(row, col) * 15 - 7.5
        });
      }
    }

    return items;
}, [currentPos, currentScale, viewportDimensions, SPACING_X, SPACING_Y, images, getItemColor, getConsistentRandom, seed]);

  useEffect(() => {
    let rafId;
    function animate() {
      setCurrentPos((pos) => {
        const lerpFactor = 0.12;
        return {
          x: pos.x + (targetPos.x - pos.x) * lerpFactor,
          y: pos.y + (targetPos.y - pos.y) * lerpFactor,
        };
      });

      setCurrentScale((sc) => sc + (targetScale - sc) * 0.1);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [targetPos, targetScale]);

  useEffect(() => {
    return () => {
      if (inertiaFrameRef.current) cancelAnimationFrame(inertiaFrameRef.current);
    };
  }, []);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }

    draggingRef.current = true;
    velocityRef.current = { x: 0, y: 0 };
    lastPositionRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = performance.now();

    pointerDownRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: targetPos.x,
      startPosY: targetPos.y,
      moved: false,
      target: e.target,
      timestamp: performance.now()
    };

    document.body.style.cursor = "grabbing";
  }, [targetPos]);

  const onPointerMove = useCallback((e) => {
    if (!draggingRef.current) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    if (deltaTime > 0) {
      const dx = e.clientX - lastPositionRef.current.x;
      const dy = e.clientY - lastPositionRef.current.y;

      velocityRef.current = {
        x: dx / deltaTime * 16.67,
        y: dy / deltaTime * 16.67
      };

      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      lastTimeRef.current = currentTime;
    }

    if (!pointerDownRef.current.moved) {
      const dx = e.clientX - pointerDownRef.current.startX;
      const dy = e.clientY - pointerDownRef.current.startY;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        pointerDownRef.current.moved = true;
      }
    }

    setTargetPos({
      x: pointerDownRef.current.startPosX + (e.clientX - pointerDownRef.current.startX),
      y: pointerDownRef.current.startPosY + (e.clientY - pointerDownRef.current.startY)
    });
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    document.body.style.cursor = "";

    if (!pointerDownRef.current.moved) {
      if (pointerDownRef.current.target?.tagName === "IMG") {
        const imgSrc = pointerDownRef.current.target.src;
        onImageClick(imgSrc);
      }
    } else {
      inertiaFrameRef.current = requestAnimationFrame(function startInertia() {
        if (Math.abs(velocityRef.current.x) < 0.05 && Math.abs(velocityRef.current.y) < 0.05) {
          cancelAnimationFrame(inertiaFrameRef.current);
          inertiaFrameRef.current = null;
          return;
        }

        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;

        setTargetPos(pos => ({
          x: pos.x + velocityRef.current.x,
          y: pos.y + velocityRef.current.y
        }));

        inertiaFrameRef.current = requestAnimationFrame(startInertia);
      });
    }
  }, [onImageClick]);

  const onMouseWheel = useCallback((e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    const worldX = (pointerX - currentPos.x) / currentScale;
    const worldY = (pointerY - currentPos.y) / currentScale;
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

    const newScale = Math.max(minScale, Math.min(MAX_SCALE, targetScale * zoomFactor));

    if (newScale !== targetScale) {
      const newPosX = pointerX - worldX * newScale;
      const newPosY = pointerY - worldY * newScale;
      setTargetScale(newScale);
      setTargetPos({ x: newPosX, y: newPosY });
    }
  }, [currentPos, currentScale, targetScale, minScale]);

  const onImageHover = useCallback((item) => setHoveredItem(item), []);
  const onImageLeave = useCallback(() => setHoveredItem(null), []);
  const onImageDoubleClick = useCallback((e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const targetX = viewportDimensions.width / 2 - centerX + currentPos.x;
    const targetY = viewportDimensions.height / 2 - centerY + currentPos.y;
    setTargetPos({ x: targetX, y: targetY });
    setTargetScale(Math.min(2, MAX_SCALE));
  }, [currentPos, viewportDimensions]);



  useEffect(() => {
    const el = document.getElementById("canvas-root");
    if (!el) return;

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onMouseWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("wheel", onMouseWheel);
    };
  }, [onPointerDown, onPointerMove, onPointerUp, onMouseWheel]);

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
        overflow: "hidden", // ✅ keeps canvas within bounds
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        boxSizing: "border-box", // ✅ makes layout more predictable
 
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: `translate(${currentPos.x}px, ${currentPos.y}px) scale(${currentScale})`,
          transformOrigin: "0 0",
          willChange: "transform",
          transition: draggingRef.current ? "none" : "transform 0.05s linear",
        }}
      >
        {visibleGridItems.map((item) => {
          const isHovered = hoveredItem?.key === item.key;
          const parallaxX = item.parallaxOffset * (targetPos.x - currentPos.x) * 0.01;
          const parallaxY = item.parallaxOffset * (targetPos.y - currentPos.y) * 0.01;

          return (
            <div
              key={item.key}
              style={{
                position: "absolute",
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${CELL_WIDTH}px`,
                height: `${CELL_HEIGHT}px`,
                transform: isHovered
                  ? `translate(${parallaxX}px, ${parallaxY}px) scale(1.05)`
                  : `translate(${parallaxX}px, ${parallaxY}px)`,
                zIndex: isHovered ? 10 : 1,
                transition: "transform 0.15s ease-out, box-shadow 0.2s ease",
                borderRadius: "8px",
                boxShadow: isHovered
                  ? `0 14px 28px rgba(0,0,0,0.2), 0 10px 10px rgba(0,0,0,0.15), 0 0 0 2px ${item.color}`
                  : `0 4px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)`,
              }}
              onMouseEnter={() => onImageHover(item)}
              onMouseLeave={onImageLeave}
              onDoubleClick={(e) => onImageDoubleClick(e, item)}
            >
              <img
                src={item.src}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  filter: isHovered ? "contrast(1.05) brightness(1.05)" : "none",
                  transition: "filter 0.2s ease",
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EnhancedDraggableCanvas;
