"use client";
import { Resizable, type ResizableProps } from "re-resizable";
import React from "react";
import ReactDOM from "react-dom";

type ResizableElement = React.ComponentRef<typeof Resizable>;

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

const DemoPicture = React.forwardRef<
  ResizableElement,
  DemoPictureProps & DemoPicturePrivateProps
>((props, ref) => {
  const {
    activeId,
    portals,
    gutter = 24,
    noResize,
    defaultSize = {
      width: 400,
      height: 192,
    },
    minWidth = 300,
    maxWidth = 1720,
    ...pictureProps
  } = props;

  if (!activeId || !portals[activeId]) return null;

  const mouseStartRef = React.useRef<Position>({
    x: 0,
    y: 0,
  });

  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [transform, setTransform] = React.useState<Position>({
    x: 0,
    y: 0,
  });

  return ReactDOM.createPortal(
    <Resizable
      ref={ref}
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
      defaultSize={defaultSize}
      minWidth={minWidth}
      maxWidth={maxWidth}
      bounds="parent"
      boundsByDirection
      resizeRatio={2}
      lockAspectRatio
      style={{
        overflow: "clip",
        pointerEvents: "all",
        position: "fixed",
        background: "red",
        margin: gutter,
        zIndex: 9999,
        transition: dragging
          ? "none"
          : "left 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1), scale 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        left: `${transform.x}px`,
        top: `${transform.y}px`,
      }}
      {...pictureProps}
    >
      <div className="absolute inset-0 pointer-events-none">
        {portals[activeId]}
      </div>
    </Resizable>,
    document.body
  );
});

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
