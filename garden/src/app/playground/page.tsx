"use client";

import { MiniPlayer } from "@/seeds/mini-player/demo";
import { useRef, useState, useEffect } from "react";

type Video = {
  id: string;
  src: string;
  title: string;
  description: string;
};

const videos: Video[] = [
  {
    id: "warriors-1",
    src: "nba.mp4",
    title: "Golden State Warriors vs. Timberwolves",
    description:
      "Game Highlights between the Golden State Warriors and the Minnesota Timberwolves in last night's game.",
  },
  {
    id: "warriors-2",
    src: "nba.mp4",
    title: "Golden State Warriors vs. Timberwolves",
    description:
      "Game Highlights between the Golden State Warriors and the Minnesota Timberwolves in last night's game.",
  },
  {
    id: "warriors-3",
    src: "nba.mp4",
    title: "Golden State Warriors vs. Timberwolves",
    description:
      "Game Highlights between the Golden State Warriors and the Minnesota Timberwolves in last night's game.",
  },
];

export default function PlaygroundPage() {
  const videoRefs = useRef<Map<string, HTMLVideoElement | null>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleMiniPlayer = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const activeRef = activeId ? videoRefs.current.get(activeId) ?? null : null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen container border-x border-neutral-800 border-dashed mx-auto">
      <div className="w-full min-h-screen flex flex-col lg:flex-row gap-8 p-10">
        {videos.map((video) => (
          <div
            key={video.id}
            className="h-100 w-100 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between items-start p-4 gap-4"
          >
            <div className="w-full h-[200px] rounded-2xl bg-neutral-900 overflow-hidden relative">
              <video
                ref={(el) => void videoRefs.current.set(video.id, el)}
                src={`/videos/${video.src}`}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
                controls
              />
            </div>

            <div className="flex flex-col gap-2 p-1">
              <h1 className="text-xl font-medium text-neutral-200">
                {video.title}
              </h1>
              <p className="text-sm text-neutral-500">{video.description}</p>
            </div>
            <button
              className="self-start h-8 text-sm px-4 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 transition-colors duration-200"
              onClick={() => toggleMiniPlayer(video.id)}
            >
              {activeId === video.id ? "Hide Mini Player" : "Show Mini Player"}
            </button>
          </div>
        ))}

        <MiniPlayer externalRef={activeRef} open={!!activeRef} />
      </div>
    </div>
  );
}
