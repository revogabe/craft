"use client";
import { Resizable, type ResizableProps } from "re-resizable";
import React from "react";
import ReactDOM from "react-dom";

type SnapPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type SnapResult = {
  position: SnapPosition;
  left: number | null;
  top: number | null;
  right: number | null;
  bottom: number | null;
  leftForAnim: number;
  topForAnim: number;
};

type Position = {
  x: number;
  y: number;
};

type DemoContextType = {
  register: (id: string, node: React.ReactNode) => void;
  unregister: (id: string) => void;
  enablePiP: (id: string) => void;
  disablePiP: () => void;
  activeId: string | null;
};

type DemoPicturePrivateProps = {
  portals: Record<string, React.ReactNode>;
  activeId: string | null;
};

interface DemoPictureProps extends ResizableProps {
  snapping?: boolean;
  gutter?: number;
  threshold?: number;
  noDrag?: boolean;
  noResize?: boolean;
  onReturn?: () => void;
}

type DemoProviderProps = {
  children: React.ReactNode;
} & DemoPictureProps;

const DemoContext = React.createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({
  children,
  ...pictureProps
}: DemoProviderProps) => {
  const [portals, setPortals] = React.useState<Record<string, React.ReactNode>>(
    {}
  );
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const register = React.useCallback((id: string, node: React.ReactNode) => {
    setPortals((prev) => ({ ...prev, [id]: node }));
  }, []);

  const unregister = React.useCallback((id: string) => {
    setPortals((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setActiveId((curr) => (curr === id ? null : curr));
  }, []);

  const enablePiP = React.useCallback(
    (id: string) => {
      setActiveId((prev) => (portals[id] ? id : prev));
    },
    [portals]
  );

  const disablePiP = React.useCallback(() => {
    setActiveId(null);
  }, []);

  const value = React.useMemo(
    () => ({ register, unregister, enablePiP, disablePiP, activeId }),
    [register, unregister, enablePiP, disablePiP, activeId]
  );

  return (
    <DemoContext.Provider value={value}>
      {children}
      <DemoPicture portals={portals} activeId={activeId} {...pictureProps} />
    </DemoContext.Provider>
  );
};

// -------- DemoPicture CORRIGIDO --------

const DemoPicture = (props: DemoPictureProps & DemoPicturePrivateProps) => {
  const {
    activeId,
    portals,
    className,
    snapping = true,
    gutter = 24,
    noResize,
    minWidth = 300,
    maxWidth = 1720,
    ...pictureProps
  } = props;

  // ------------------ SNAP POINTS ------------------
  function findClosestSnapPoint(
    x: number,
    y: number,
    width: number,
    height: number,
    gutter: number
  ): SnapResult {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const snapPoints: SnapResult[] = [
      {
        position: "top-left",
        left: gutter,
        top: gutter,
        right: null,
        bottom: null,
        leftForAnim: gutter,
        topForAnim: gutter,
      },
      {
        position: "top-center",
        left: (screenWidth - width) / 2,
        top: gutter,
        right: null,
        bottom: null,
        leftForAnim: (screenWidth - width) / 2,
        topForAnim: gutter,
      },
      {
        position: "top-right",
        left: null,
        top: gutter,
        right: gutter,
        bottom: null,
        leftForAnim: screenWidth - width - gutter - scrollbarWidth,
        topForAnim: gutter,
      },
      {
        position: "middle-left",
        left: gutter,
        top: (screenHeight - height) / 2,
        right: null,
        bottom: null,
        leftForAnim: gutter,
        topForAnim: (screenHeight - height) / 2,
      },
      {
        position: "middle-right",
        left: null,
        top: (screenHeight - height) / 2,
        right: gutter,
        bottom: null,
        leftForAnim: screenWidth - width - gutter - scrollbarWidth,
        topForAnim: (screenHeight - height) / 2,
      },
      {
        position: "bottom-left",
        left: gutter,
        top: null,
        right: null,
        bottom: gutter,
        leftForAnim: gutter,
        topForAnim: screenHeight - height - gutter,
      },
      {
        position: "bottom-center",
        left: (screenWidth - width) / 2,
        top: null,
        right: null,
        bottom: gutter,
        leftForAnim: (screenWidth - width) / 2,
        topForAnim: screenHeight - height - gutter,
      },
      {
        position: "bottom-right",
        left: null,
        top: null,
        right: gutter,
        bottom: gutter,
        leftForAnim: screenWidth - width - gutter - scrollbarWidth,
        topForAnim: screenHeight - height - gutter,
      },
    ];

    let closest = snapPoints[0];
    let minDist = Infinity;

    for (const point of snapPoints) {
      const pointLeft = point.left ?? screenWidth - width - (point.right ?? 0);
      const pointTop = point.top ?? screenHeight - height - (point.bottom ?? 0);
      const dist = Math.hypot(x - pointLeft, y - pointTop);
      if (dist < minDist) {
        minDist = dist;
        closest = point;
      }
    }
    return closest;
  }

  // ------------------ STATES ------------------
  const pictureRef = React.useRef<HTMLDivElement | null>(null);
  const mouseStartRef = React.useRef<Position>({ x: 0, y: 0 });

  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const [currentSnap, setCurrentSnap] = React.useState<SnapResult | null>(null);
  const [animStyle, setAnimStyle] = React.useState<React.CSSProperties>({});
  const [snapMode, setSnapMode] = React.useState(true);
  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });

  // ------------------ SNAPPING FLOW ------------------
  function handleSnap(snap: SnapResult) {
    setIsTransitioning(true);
    setAnimStyle({
      left: snap.leftForAnim,
      top: snap.topForAnim,
      right: undefined,
      bottom: undefined,
      transition:
        "left 0.4s cubic-bezier(0.22, 1, 0.36, 1), top 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    });
    setCurrentSnap(snap);
    setSnapMode(true);
  }

  function handleTransitionEnd() {
    if (currentSnap) {
      setAnimStyle({
        left: currentSnap.left ?? undefined,
        top: currentSnap.top ?? undefined,
        right: currentSnap.right ?? undefined,
        bottom: currentSnap.bottom ?? undefined,
        transition: "none",
      });
      setIsTransitioning(false);
    }
  }

  // ------------------ DRAG FLOW ------------------
  const handleDragStart = (e: React.MouseEvent) => {
    if (resizing) return;
    e.preventDefault();
    e.stopPropagation();

    if (snapMode && pictureRef.current) {
      const rect = pictureRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
    setDragging(true);
    setSnapMode(false);

    mouseStartRef.current = {
      x:
        e.clientX -
        (pictureRef.current?.getBoundingClientRect().left ?? position.x),
      y:
        e.clientY -
        (pictureRef.current?.getBoundingClientRect().top ?? position.y),
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - mouseStartRef.current.x,
        y: moveEvent.clientY - mouseStartRef.current.y,
      });
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (snapping && pictureRef.current) {
        const rect = pictureRef.current.getBoundingClientRect();
        const snap = findClosestSnapPoint(
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          gutter
        );
        handleSnap(snap);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // ------------------ SYNC SNAP ON LOAD/RESIZE ------------------
  React.useEffect(() => {
    if (!activeId) return;
    // Aplica snap inicial ao ativar
    if (snapping && pictureRef.current) {
      const rect = pictureRef.current.getBoundingClientRect();
      const snap = findClosestSnapPoint(
        rect.left,
        rect.top,
        rect.width,
        rect.height,
        gutter
      );
      handleSnap(snap);
    }
    // eslint-disable-next-line
  }, [activeId]);

  // ------------------ STYLE LOGIC ------------------
  const stylePosition: React.CSSProperties =
    snapMode && currentSnap
      ? animStyle
      : {
          left: position.x,
          top: position.y,
          right: undefined,
          bottom: undefined,
        };

  // --------------- COMPONENT ---------------
  if (!activeId || !portals[activeId]) return null;
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div onTransitionEnd={isTransitioning ? handleTransitionEnd : undefined}>
      <Resizable
        enable={{
          bottom: !noResize,
          bottomLeft: !noResize,
          bottomRight: !noResize,
          left: !noResize,
          right: !noResize,
          top: !noResize,
          topLeft: !noResize,
          topRight: !noResize,
        }}
        defaultSize={{
          width: 480,
          height: 270,
        }}
        minWidth={minWidth}
        maxWidth={maxWidth}
        bounds="parent"
        boundsByDirection
        resizeRatio={2}
        lockAspectRatio
        onResizeStart={() => setResizing(true)}
        onResizeStop={(_e, _direction, ref) => {
          setResizing(false);
          if (snapping && ref) {
            const rect = ref.getBoundingClientRect();
            const snap = findClosestSnapPoint(
              rect.left,
              rect.top,
              rect.width,
              rect.height,
              gutter
            );
            handleSnap(snap);
          }
        }}
        style={{
          ...stylePosition,
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "all",
          width: 400, // Troque se quiser dinâmica de width/height
          height: 200,
        }}
        {...pictureProps}
      >
        <div
          ref={pictureRef}
          className={`absolute inset-0 ${className} overflow-clip`}
        >
          {portals[activeId]}
        </div>
        <div
          onMouseDown={handleDragStart}
          className="absolute inset-0 z-50"
          style={{
            pointerEvents: "visibleFill",
            backgroundColor:
              dragging || resizing ? "rgba(0, 0, 0, 0.5)" : "transparent",
            cursor: dragging || resizing ? "grabbing" : "grab",
          }}
        />
      </Resizable>
    </div>,
    globalThis.document.body
  );
};

// ---- CONTEXT ----

export const useDemo = () => {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be inside DemoProvider");
  return {
    enablePiP: ctx.enablePiP,
    disablePiP: ctx.disablePiP,
  };
};

export const DemoPortal = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const ctx = React.useContext(DemoContext)!;
  const { register, activeId } = ctx;

  React.useEffect(() => {
    register(id, children);
  }, [id, register]);

  if (activeId === id) return null;
  return <>{children}</>;
};
