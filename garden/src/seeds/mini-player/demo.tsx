"use client";

import { useRef, useState, useEffect } from "react";

type SnapPoints =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-left"
  | "center-right"
  | "top-center"
  | "bottom-center";

type Position = {
  x: number;
  y: number;
};

type MiniPlayerProps = {
  open?: boolean;
  snapping?: boolean;
  offset?: number;
  initialPosition?: SnapPoints;
  initialTransform?: Position;
  noDrag?: boolean;
  externalRef?: HTMLVideoElement | HTMLIFrameElement | null;
  onReturn?: () => void;
};

const CLICK_THRESHOLD = 5;

export function MiniPlayer({
  open = false,
  snapping = false,
  offset = 16,
  noDrag = false,
  initialPosition = "bottom-right",
  initialTransform = { x: 0, y: 0 },
  externalRef,
  onReturn,
}: MiniPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const originalParentRef = useRef<HTMLElement | null>(null);
  const mouseStartRef = useRef<Position>({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState<Position>(initialTransform);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (noDrag) return;
    const touch = e.touches[0];
    mouseStartRef.current = { x: touch.clientX, y: touch.clientY };
    setDragging(true);
    setStartDragPosition({ x: touch.clientX, y: touch.clientY });
  };

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
      { x: margin, y: margin },
      { x: screenWidth / 2 - width / 2, y: margin },
      { x: screenWidth - width - margin, y: margin },
      { x: margin, y: screenHeight / 2 - height / 2 },
      { x: screenWidth - width - margin, y: screenHeight / 2 - height / 2 },
      { x: margin, y: screenHeight - height - margin },
      { x: screenWidth / 2 - width / 2, y: screenHeight - height - margin },
      { x: screenWidth - width - margin, y: screenHeight - height - margin },
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
    const video = externalRef;
    const container = playerRef.current;
    if (!video || !container) return;

    if (!originalParentRef.current && video.parentElement) {
      originalParentRef.current = video.parentElement;
    }

    container.appendChild(video);

    const forwardMouse = (e: Event) => {
      const mouse = e as MouseEvent;
      const cloned = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: mouse.clientX,
        clientY: mouse.clientY,
        buttons: mouse.buttons,
      });
      container.dispatchEvent(cloned);
    };

    const forwardTouch = (e: Event) => {
      const touchEvent = e as TouchEvent;
      const touch = touchEvent.touches[0];
      const simulated = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
        buttons: 1,
      });
      container.dispatchEvent(simulated);
    };

    video.addEventListener("mousedown", forwardMouse);
    video.addEventListener("touchstart", forwardTouch);

    return () => {
      video.removeEventListener("mousedown", forwardMouse);
      video.removeEventListener("touchstart", forwardTouch);
      if (originalParentRef.current) {
        originalParentRef.current.appendChild(video);
        onReturn?.();
      }
    };
  }, [externalRef]);

  useEffect(() => {
    const updateInitialPosition = () => {
      if (initialPosition && playerRef.current) {
        const width = playerRef.current.offsetWidth;
        const height = playerRef.current.offsetHeight;
        const currentX = transform.x;
        const currentY = transform.y;

        const newTransform = findClosestSnapPoint(
          currentX,
          currentY,
          width,
          height
        );
        setTransform(newTransform);
      }
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);
    return () => window.removeEventListener("resize", updateInitialPosition);
  }, [initialPosition, offset, open]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startDragPosition.x;
      const dy = e.clientY - startDragPosition.y;
      setTransform((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startDragPosition.x;
      const dy = touch.clientY - startDragPosition.y;
      setTransform((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartDragPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleEnd = (e?: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      setDragging(false);

      const endX =
        e instanceof MouseEvent
          ? e.clientX
          : (e as TouchEvent).changedTouches?.[0]?.clientX;
      const endY =
        e instanceof MouseEvent
          ? e.clientY
          : (e as TouchEvent).changedTouches?.[0]?.clientY;
      const deltaX = Math.abs(endX - mouseStartRef.current.x);
      const deltaY = Math.abs(endY - mouseStartRef.current.y);
      const isClick = deltaX < CLICK_THRESHOLD && deltaY < CLICK_THRESHOLD;

      if (!isClick && externalRef) {
        const blocker = (clickEvent: Event) => {
          clickEvent.preventDefault();
          clickEvent.stopImmediatePropagation();
        };
        externalRef.addEventListener("click", blocker, {
          once: true,
          capture: true,
        });
      }

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

  useEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
  }, [dragging]);

  return (
    <div className="inset-0 fixed pointer-events-none z-50">
      <div
        ref={playerRef}
        data-state={open ? "open" : "closed"}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="absolute w-90 h-50 bg-neutral-900 rounded-2xl duration-300 overflow-clip"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${
            open ? 1 : 0.75
          })`,
          transition: dragging
            ? "none"
            : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "all",
          zIndex: 9999,
          opacity: open ? 1 : 0,
        }}
      />
    </div>
  );
}
