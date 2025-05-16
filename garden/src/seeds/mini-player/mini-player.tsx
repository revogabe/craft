"use client";

import React, { useState } from "react";
import { createContext } from "@/utils/create-context";
import { findClosestSnapPoint } from "./utils/findClosestSnapPoint";
import { Resizable } from "re-resizable";

/* ----------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------*/

type PrimitiveDivElement = React.ComponentRef<"div">;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<"div">;

type PictureInPictureElement = HTMLVideoElement | HTMLIFrameElement | null;

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

type Size = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ResizeDirection =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "topRight"
  | "bottomRight"
  | "bottomLeft"
  | "topLeft";

type ResizeFunction = {
  delta: {
    width: number;
    height: number;
  };
  direction: ResizeDirection;
  size: Size;
};

type MiniPlayerPublicContextValue = {
  open: boolean;
  togglePictureInPicture: (ref: PictureInPictureElement) => void;
};

type MiniPlayerContextValue = {
  snapping: boolean;
  offset: number;
  clickThreshold: number;
  initialPosition: SnapPoints;
  initialTransform: Position;
  width?: number;
  height?: number;
  noDrag: boolean;
  externalRef?: PictureInPictureElement;
  onReturn?: () => void;
};

export interface MiniPlayerProviderProps extends PrimitiveDivProps {
  snapping?: boolean;
  offset?: number;
  width?: number;
  height?: number;
  clickThreshold?: number;
  initialPosition?: SnapPoints;
  initialTransform?: Position;
  noDrag?: boolean;
  onReturn?: () => void;
}

/* ----------------------------------------------------------------------------
 * Component Form:Field
 * --------------------------------------------------------------------------*/

const PROVIDER_PRIVATE_NAME = "MiniPlayerPrivateProvider";
const PROVIDER_PUBLIC_NAME = "MiniPlayerPublicProvider";

const [PrivateProvider, useMiniPlayerPrivate] =
  createContext<MiniPlayerContextValue>(PROVIDER_PRIVATE_NAME);

const [PublicProvider, useMiniPlayerPublic] =
  createContext<MiniPlayerPublicContextValue>(PROVIDER_PUBLIC_NAME);

export const Provider = React.forwardRef<
  PrimitiveDivElement,
  MiniPlayerProviderProps
>((props, ref) => {
  const {
    children,
    snapping = false,
    offset = 16,
    width = 360,
    height = 200,
    clickThreshold = 5,
    noDrag = false,
    initialPosition = "bottom-right",
    initialTransform = { x: 0, y: 0 },
    onReturn,
    ...providerProps
  } = props;

  const [activeRef, setActiveRef] =
    React.useState<PictureInPictureElement>(null);

  const handleTogglePictureInPicture = (ref: PictureInPictureElement) => {
    setActiveRef((prev) => (prev === ref ? null : ref));
  };

  return (
    <PrivateProvider
      snapping={snapping}
      offset={offset}
      clickThreshold={clickThreshold}
      width={width}
      height={height}
      initialPosition={initialPosition}
      initialTransform={initialTransform}
      noDrag={noDrag}
      externalRef={activeRef}
    >
      <PublicProvider
        open={!!activeRef}
        togglePictureInPicture={handleTogglePictureInPicture}
      >
        <div ref={ref} {...providerProps}>
          {children}
        </div>
      </PublicProvider>
    </PrivateProvider>
  );
});

Provider.displayName = PROVIDER_PRIVATE_NAME;

const PICTURE_NAME = "PictureInPicture";

export const PictureInPicture = (props: PrimitiveDivProps) => {
  const { ...pictureInPictureProps } = props;

  const {
    snapping,
    offset,
    width,
    height,
    clickThreshold,
    initialPosition,
    initialTransform,
    noDrag,
    externalRef,
    onReturn,
  } = useMiniPlayerPrivate(PICTURE_NAME);

  const { open } = useMiniPlayerPublic(PICTURE_NAME);

  const playerRef = React.useRef<HTMLDivElement>(null);
  const originalParentRef = React.useRef<HTMLElement | null>(null);
  const mouseStartRef = React.useRef<Position>({ x: 0, y: 0 });

  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(true);
  const [hideEdge, setHideEdge] = useState<
    "left" | "right" | "top" | "bottom" | null
  >(null);
  const [lastVisiblePosition, setLastVisiblePosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [dragStartSize, setDragStartSize] = useState<Size>();
  const [size, setSize] = useState<Size>({
    left: 0,
    top: 0,
    width: width ?? 360,
    height: height ?? 200,
  });
  const [startDragPosition, setStartDragPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [transform, setTransform] = React.useState<Position>(initialTransform);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (resizing) return;
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (resizing) return;
    if (noDrag) return;
    const touch = e.touches[0];
    mouseStartRef.current = { x: touch.clientX, y: touch.clientY };
    setDragging(true);
    setStartDragPosition({ x: touch.clientX, y: touch.clientY });
  };

  const onResize = React.useCallback(
    ({ delta, direction, size }: ResizeFunction) => {
      if (!dragStartSize) {
        return;
      }
      const directions = ["top", "left", "topLeft", "bottomLeft", "topRight"];

      if (directions.indexOf(direction) !== -1) {
        let newLeft = size.left;
        let newTop = size.top;

        if (direction === "bottomLeft") {
          newLeft = dragStartSize.left - delta.width;
        } else if (direction === "topRight") {
          newTop = dragStartSize.top - delta.height;
        } else {
          newLeft = dragStartSize.left - delta.width;
          newTop = dragStartSize.top - delta.height;
        }

        setSize({
          ...size,
          left: newLeft,
          top: newTop,
        });
      }
    },
    [dragStartSize]
  );

  React.useEffect(() => {
    if (!isHidden) {
      setLastVisiblePosition({ left: size.left, top: size.top });
    }
  }, [isHidden, size.left, size.top]);

  React.useLayoutEffect(() => {
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

  React.useLayoutEffect(() => {
    const updateInitialPosition = () => {
      if (initialPosition) {
        const closest = findClosestSnapPoint(
          size.left,
          size.top,
          size.width,
          size.height,
          offset
        );

        setSize((prev) => ({
          ...prev,
          left: closest.left,
          top: closest.top,
        }));
      }
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);
    return () => window.removeEventListener("resize", updateInitialPosition);
  }, [initialPosition, offset, open]);

  React.useLayoutEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) return;
      if (!dragging) return;
      const dx = e.clientX - startDragPosition.x;
      const dy = e.clientY - startDragPosition.y;
      setSize((prev) => ({
        ...prev,
        left: prev.left + dx,
        top: prev.top + dy,
      }));
      setStartDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startDragPosition.x;
      const dy = touch.clientY - startDragPosition.y;
      setSize((prev) => ({
        ...prev,
        left: prev.left + dx,
        top: prev.top + dy,
      }));
      setStartDragPosition({ x: touch.clientX, y: touch.clientY });
    };

    const handleEnd = (e?: MouseEvent | TouchEvent) => {
      if (resizing) return;
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
      const isClick = deltaX < clickThreshold && deltaY < clickThreshold;

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

      if (snapping && !isHidden) {
        const closest = findClosestSnapPoint(
          size.left,
          size.top,
          size.width,
          size.height,
          offset
        );

        setSize((prev) => ({
          ...prev,
          left: closest.left,
          top: closest.top,
        }));
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

  React.useLayoutEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
  }, [dragging]);

  React.useLayoutEffect(() => {
    if (resizing || isHidden) return; // ← aqui está a mudança
    if (snapping) {
      const closest = findClosestSnapPoint(
        size.left,
        size.top,
        size.width,
        size.height,
        offset
      );
      setSize((prev) => ({
        ...prev,
        left: closest.left,
        top: closest.top,
      }));
      setDragging(false);
    }
  }, [resizing, isHidden]);

  React.useEffect(() => {
    if (resizing) return;

    const thresholdX = size.width * 0.6;
    const thresholdY = size.height * 0.6;

    const rightEdge = size.left + size.width;
    const bottomEdge = size.top + size.height;

    let shouldHide = false;
    let edge: "left" | "right" | "top" | "bottom" | null = null;

    if (size.left < -thresholdX) {
      shouldHide = true;
      edge = "left";
    } else if (rightEdge > window.innerWidth + thresholdX) {
      shouldHide = true;
      edge = "right";
    } else if (size.top < -thresholdY) {
      shouldHide = true;
      edge = "top";
    } else if (bottomEdge > window.innerHeight + thresholdY) {
      shouldHide = true;
      edge = "bottom";
    }

    if (shouldHide) {
      setLastVisiblePosition({ left: size.left, top: size.top });
      setIsHidden(true);
      setHideEdge(edge);
    } else {
      setIsHidden(false);
      setHideEdge(null);
    }
  }, [size, resizing]);

  let adjustedLeft = size.left;
  let adjustedTop = size.top;

  if (isHidden && hideEdge) {
    if (hideEdge === "left") {
      adjustedLeft = -size.width + 0;
    }
    if (hideEdge === "right") {
      adjustedLeft = window.innerWidth - 14;
    }
    if (hideEdge === "top") {
      adjustedTop = -size.height + 0;
    }
    if (hideEdge === "bottom") {
      adjustedTop = window.innerHeight - 0;
    }
  }

  return (
    <div className="inset-0 fixed pointer-events-none z-50">
      <Resizable
        as="div"
        minHeight={100}
        bounds={"parent"}
        boundsByDirection
        resizeRatio={2}
        lockAspectRatio
        data-state={open ? "open" : "closed"}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onResizeStart={() => {
          setResizing(true);
          setDragStartSize(size);
        }}
        onResize={(event, direction, elementRef, delta) => {
          onResize({ delta, direction, size });
        }}
        onResizeStop={(e, direction, ref, delta) => {
          setResizing(false);
          setDragStartSize(undefined);

          if (snapping) {
            const rect = ref.getBoundingClientRect(); // pega tamanho real após resize
            const closest = findClosestSnapPoint(
              rect.left,
              rect.top,
              rect.width,
              rect.height,
              offset
            );

            setSize((prev) => ({
              ...prev,
              left: closest.left,
              top: closest.top,
              width: rect.width,
              height: rect.height,
            }));
          }
        }}
        defaultSize={size}
        style={{
          position: "absolute",
          transition: dragging
            ? "none"
            : "left 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1), scale 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          scale: open ? 1 : 0.75,
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          left: `${adjustedLeft}px`,
          top: `${adjustedTop}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        {...pictureInPictureProps}
      >
        <div ref={playerRef} className="absolute inset-0" />
        <div className="absolute inset-0" />
        {/* Show PiP Again */}
        {isHidden && (
          <button
            onClick={() => {
              if (lastVisiblePosition) {
                setSize((prev) => ({
                  ...prev,
                  left: lastVisiblePosition.left,
                  top: lastVisiblePosition.top,
                }));
                setIsHidden(false);
                setHideEdge(null);
              }
            }}
            className={`absolute ${
              hideEdge === "left"
                ? "right-0 top-1/2 -translate-y-1/2 translate-x-full rounded-r-xl h-full w-6"
                : hideEdge === "right"
                ? "left-0 top-1/2 -translate-y-1/2 -translate-x-full rounded-l-xl h-full w-6"
                : hideEdge === "top"
                ? "left-1/2 bottom-0 -translate-x-1/2 translate-y-full rounded-b-xl h-6 w-full"
                : "left-1/2 top-0 -translate-x-1/2 -translate-y-full rounded-t-xl h-6 w-full"
            } bg-slate-200 text-slate-500 border border-slate-300 flex items-center justify-center -z-10`}
          >
            X
          </button>
        )}
      </Resizable>
    </div>
  );
};

PictureInPicture.displayName = PICTURE_NAME;

/* ----------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------*/

export const useMiniPlayer = () => useMiniPlayerPublic("useMiniPlayer");

export {
  Provider as MiniPlayerProvider,
  PictureInPicture as MiniPlayerPictureInPicture,
};

export const MiniPlayer = Object.assign(
  {},
  {
    Provider,
    PictureInPicture,
  }
);
