"use client";

import { createContext } from "@/utils/create-context";
import React from "react";
import { findClosestSnapPoint } from "./utils/findClosestSnapPoint";

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
  const [startDragPosition, setStartDragPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [transform, setTransform] = React.useState<Position>(initialTransform);

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
      if (initialPosition && playerRef.current) {
        const width = playerRef.current.offsetWidth;
        const height = playerRef.current.offsetHeight;
        const currentX = transform.x;
        const currentY = transform.y;

        const newTransform = findClosestSnapPoint(
          currentX,
          currentY,
          width,
          height,
          offset
        );
        setTransform(newTransform);
      }
    };

    updateInitialPosition();
    window.addEventListener("resize", updateInitialPosition);
    return () => window.removeEventListener("resize", updateInitialPosition);
  }, [initialPosition, offset, open]);

  React.useLayoutEffect(() => {
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

      if (snapping && playerRef.current) {
        const width = playerRef.current.offsetWidth;
        const height = playerRef.current.offsetHeight;
        const closest = findClosestSnapPoint(
          transform.x,
          transform.y,
          width,
          height,
          offset
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

  React.useLayoutEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
  }, [dragging]);

  return (
    <div className="inset-0 fixed pointer-events-none z-50">
      <div
        {...pictureInPictureProps}
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
          opacity: open ? 1 : 0,
        }}
      />
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
