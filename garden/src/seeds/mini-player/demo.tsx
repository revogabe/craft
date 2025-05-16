"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import ReactDOM from "react-dom";

type DemoContextType = {
  register: (id: string, node: ReactNode) => void;
  unregister: (id: string) => void;
  enablePiP: (id: string) => void;
  disablePiP: () => void;
  activeId: string | null;
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [portals, setPortals] = useState<Record<string, ReactNode>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const register = useCallback(
    (id: string, node: ReactNode) => {
      setPortals((prev) => ({ ...prev, [id]: node }));
    },
    [] // roda só uma vez
  );

  const unregister = useCallback((id: string) => {
    setPortals((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setActiveId((curr) => (curr === id ? null : curr));
  }, []);

  const enablePiP = useCallback(
    (id: string) => {
      setActiveId((prev) => (portals[id] ? id : prev));
    },
    [portals]
  );

  const disablePiP = useCallback(() => {
    setActiveId(null);
  }, []);

  // memoiza o objeto de contexto pra não mudar em toda render
  const value = useMemo(
    () => ({ register, unregister, enablePiP, disablePiP, activeId }),
    [register, unregister, enablePiP, disablePiP, activeId]
  );

  return (
    <DemoContext.Provider value={value}>
      {children}
      <DemoPicture portals={portals} activeId={activeId} />
    </DemoContext.Provider>
  );
};

const DemoPicture = ({
  portals,
  activeId,
}: {
  portals: Record<string, ReactNode>;
  activeId: string | null;
}) => {
  if (!activeId || !portals[activeId]) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        maxWidth: "360px",
        maxHeight: "300px",
        position: "fixed",
        background: "red",
        bottom: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      {portals[activeId]}
    </div>,
    document.body
  );
};

export const useDemo = () => {
  const ctx = useContext(DemoContext);
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
  const ctx = useContext(DemoContext)!;
  const { register, activeId } = ctx;

  useEffect(() => {
    register(id, children);
  }, [id, register]);

  if (activeId === id) return null;
  return <>{children}</>;
};
