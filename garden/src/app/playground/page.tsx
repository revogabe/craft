"use client";

import { MiniPlayer } from "@/seeds/mini-player/demo";
import { useState } from "react";

export default function PlaygroundPage() {
  const [openMiniPlayer, setOpenMiniPlayer] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen container border-x border-neutral-800 border-dashed mx-auto">
      <button
        className="h-8 text-sm px-4 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 transition-colors duration-200"
        onClick={() => setOpenMiniPlayer((prev) => !prev)}
      >
        {openMiniPlayer ? "Hide Mini Player" : "Show Mini Player"}
      </button>
      <MiniPlayer
        open={openMiniPlayer}
        initialPosition="bottom-right"
        snapping
      />
    </div>
  );
}
