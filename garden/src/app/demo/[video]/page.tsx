"use client";

import { useMiniPlayer } from "@/seeds/mini-player/mini-player";
import type { NextPage } from "@/types/next";
import { use, useRef } from "react";

export default function VideoPage({ params }: NextPage<{ video: string }, {}>) {
  const { video } = use(params);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { open, togglePictureInPicture } = useMiniPlayer();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen container border-x border-neutral-800 border-dashed mx-auto">
      <div className="w-full min-h-screen flex flex-col lg:flex-row gap-8 p-10">
        <div className="h-100 w-100 bg-neutral-950 border border-neutral-900 rounded-3xl flex flex-col justify-between items-start p-4 gap-4">
          <div className="w-full h-[200px] rounded-2xl bg-neutral-900 overflow-hidden relative">
            <video
              ref={videoRef}
              src={`/videos/gta.mp4`}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
              controls
            />
          </div>

          <div className="flex flex-col gap-2 p-1">
            <h1 className="text-xl font-medium text-neutral-200">{video}</h1>
            <p className="text-sm text-neutral-500">
              Trailer for the upcoming Grand Theft Auto VI game, showcasing new
              features and gameplay mechanics.
            </p>
          </div>
          <button
            className="self-start h-8 text-sm px-4 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 transition-colors duration-200"
            onClick={() => togglePictureInPicture(videoRef.current)}
          >
            {open ? "Hide Mini Player" : "Show Mini Player"}
          </button>
        </div>
      </div>
    </div>
  );
}
