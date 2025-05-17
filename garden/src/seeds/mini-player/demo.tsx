"use client";
import { Resizable } from "re-resizable";
import React from "react";
import ReactDOM from "react-dom";

type DemoContextType = {
  register: (id: string, node: React.ReactNode) => void;
  unregister: (id: string) => void;
  enablePiP: (id: string) => void;
  disablePiP: () => void;
  activeId: string | null;
};

type DemoPictureProps = {
  className?: string;
  snapping?: boolean;
  noDrag?: boolean;
  noResize?: boolean;
  gutter?: number;
  threshold?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  onReturn?: () => void;
};

type ResizableProps = React.ComponentProps<typeof Resizable>;

type DemoPicturePrivateProps = {
  portals: Record<string, React.ReactNode>;
  activeId: string | null;
};

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

const DemoPicture = (props: DemoPicturePrivateProps & DemoPictureProps) => {
  const {
    portals,
    activeId,
    gutter = 24,
    width,
    height,
    minWidth = 200,
    maxWidth = 1400,
    noResize,
    ...pictureProps
  } = props;

  if (!activeId || !portals[activeId]) return null;

  const mouseStartRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const [transform, setTransform] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  return ReactDOM.createPortal(
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
        width: width || 400,
        height: height || 194,
      }}
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
        bottom: 0,
        right: 0,
        margin: gutter,
        zIndex: 9999,
      }}
    >
      <div className="absolute inset-0">{portals[activeId]}</div>
    </Resizable>,
    document.body
  );
};

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
