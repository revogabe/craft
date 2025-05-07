"use client";

import { useRef, useState, useEffect, use } from "react";

type SnapPoints =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-left"
  | "center-right"
  | "top-center"
  | "bottom-center";

type MiniPlayerProps = {
  open?: boolean;
  snapping?: boolean;
  offset?: number;
  initialPosition?: SnapPoints;
  initialTransform?: { x: number; y: number };
  noDrag?: boolean;
};

export function MiniPlayer({
  open = false,
  snapping = false,
  offset = 16,
  noDrag = false,
  initialPosition = "bottom-right",
  initialTransform = { x: 0, y: 0 },
}: MiniPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState(initialTransform);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (noDrag) return;
    const touch = e.touches[0];
    setDragging(true);
    setStartDragPosition({ x: touch.clientX, y: touch.clientY });
  };

  useEffect(() => {
    const updateInitialPosition = () => {
      if (initialPosition && playerRef.current) {
        const width = playerRef.current.offsetWidth;
        const height = playerRef.current.offsetHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let x = 0;
        let y = 0;

        switch (initialPosition) {
          case "top-left":
            x = offset;
            y = offset;
            break;
          case "top-right":
            x = screenWidth - width - offset;
            y = offset;
            break;
          case "bottom-left":
            x = offset;
            y = screenHeight - height - offset;
            break;
          case "bottom-right":
            x = screenWidth - width - offset;
            y = screenHeight - height - offset;
            break;
          case "center-left":
            x = offset;
            y = screenHeight / 2 - height / 2;
            break;
          case "center-right":
            x = screenWidth - width - offset;
            y = screenHeight / 2 - height / 2;
            break;
          case "top-center":
            x = screenWidth / 2 - width / 2;
            y = offset;
            break;
          case "bottom-center":
            x = screenWidth / 2 - width / 2;
            y = screenHeight - height - offset;
            break;
          default:
            break;
        }

        setTransform({ x, y });
      }
    };

    updateInitialPosition();

    window.addEventListener("resize", updateInitialPosition);
    return () => {
      window.removeEventListener("resize", updateInitialPosition);
    };
  }, [initialPosition, offset, open]);

  useEffect(() => {
    if (initialPosition && playerRef.current) {
      const width = playerRef.current.offsetWidth;
      const height = playerRef.current.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let x = 0;
      let y = 0;

      switch (initialPosition) {
        case "top-left":
          x = offset;
          y = offset;
          break;
        case "top-right":
          x = screenWidth - width - offset;
          y = offset;
          break;
        case "bottom-left":
          x = offset;
          y = screenHeight - height - offset;
          break;
        case "bottom-right":
          x = screenWidth - width - offset;
          y = screenHeight - height - offset;
          break;
        case "center-left":
          x = offset;
          y = screenHeight / 2 - height / 2;
          break;
        case "center-right":
          x = screenWidth - width - offset;
          y = screenHeight / 2 - height / 2;
          break;
        case "top-center":
          x = screenWidth / 2 - width / 2;
          y = offset;
          break;
        case "bottom-center":
          x = screenWidth / 2 - width / 2;
          y = screenHeight - height - offset;
          break;
        default:
          break;
      }

      setTransform({ x, y });
    }
  }, [initialPosition, offset, open]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startDragPosition.x;
      const dy = e.clientY - startDragPosition.y;

      setTransform((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setStartDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startDragPosition.x;
      const dy = touch.clientY - startDragPosition.y;

      setTransform((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setStartDragPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleEnd = () => {
      if (!dragging) return;
      setDragging(false);

      if (snapping && playerRef.current) {
        const width = playerRef.current.offsetWidth;
        const height = playerRef.current.offsetHeight;
        const closest = findClosestSnapPoint(
          transform.x,
          transform.y,
          width,
          height
        );
        setTransform(closest);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, startDragPosition, snapping, transform]);

  const findClosestSnapPoint = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const margin = offset;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const snapPoints = [
      { x: margin, y: margin }, // top-left
      { x: screenWidth / 2 - width / 2, y: margin }, // top-center
      { x: screenWidth - width - margin, y: margin }, // top-right
      { x: margin, y: screenHeight / 2 - height / 2 }, // center-left
      { x: screenWidth - width - margin, y: screenHeight / 2 - height / 2 }, // center-right
      { x: margin, y: screenHeight - height - margin }, // bottom-left
      { x: screenWidth / 2 - width / 2, y: screenHeight - height - margin }, // bottom-center
      { x: screenWidth - width - margin, y: screenHeight - height - margin }, // bottom-right
    ];

    let closest = snapPoints[0];
    let minDist = Infinity;

    for (const point of snapPoints) {
      const dist = Math.hypot(x - point.x, y - point.y);
      if (dist < minDist) {
        minDist = dist;
        closest = point;
      }
    }

    return closest;
  };

  useEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
  }, [dragging]);

  return (
    <div className="inset-0 fixed pointer-events-none">
      {open && (
        <div
          ref={playerRef}
          data-state={open ? "open" : "closed"}
          className="absolute w-90 h-50 bg-neutral-900 rounded-3xl duration-300"
          onMouseDown={!noDrag ? handleMouseDown : undefined}
          onTouchStart={!noDrag ? handleTouchStart : undefined}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${
              open ? 1 : 0.8
            })`,
            transition: dragging
              ? "none"
              : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: "all",
            zIndex: 9999,
            cursor: dragging ? "grabbing" : "grab",
            opacity: open ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
