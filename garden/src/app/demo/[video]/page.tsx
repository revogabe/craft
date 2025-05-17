"use client";

import { use } from "react";
import type { NextPage } from "@/types/next";
import Link from "next/link";
import { DemoPortal, useDemo } from "@/seeds/mini-player/demo";

export default function VideoPage({ params }: NextPage<{ video: string }, {}>) {
  const { video } = use(params);
  const { enablePiP, disablePiP } = useDemo();

  return (
    <div className="flex items-start justify-between min-h-screen container border-x border-slate-300 border-dashed mx-auto p-4 gap-4">
      {/* Video Player + Comments*/}
      <div className="w-full flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-start gap-2">
          <Link
            href={"/demo"}
            className="text-slate-500 hover:text-slate-800 duration-200 ease-out"
          >
            Home
          </Link>
          <span className="text-slate-500">/</span>
          <Link href={"/demo"} className="text-slate-800">
            {video}
          </Link>
        </div>
        <div className="w-full h-[524px] bg-slate-200 rounded-xl overflow-clip">
          <DemoPortal id={video}>
            {/* <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/IO21Ejtu-Qs?si=BqhoY1vBhN_7rLVt&autoplay=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              className="rounded-xl"
              allowFullScreen
            /> */}
            <video src="/videos/nba.mp4" controls />
          </DemoPortal>
        </div>
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="leading-tight select-none text-xl font-semibold line-clamp-1">
              Grand Theft Auto V - The Last of Us Part II - 4K 60FPS
            </h1>
            <div className="flex items-center justify-end gap-3">
              <span className="text-lg text-slate-800">1.2M views</span>
              <button
                onClick={() => enablePiP(video)}
                className="border rounded-full border-slate-300 px-4 h-8 text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-800 duration-200 ease-out"
              >
                Enable PiP
              </button>
              <button
                onClick={() => disablePiP()}
                className="border rounded-full border-slate-300 px-4 h-8 text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-800 duration-200 ease-out"
              >
                Disable PiP
              </button>
            </div>
          </div>
          <p className="line-clamp-2 select-none text-slate-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere nemo
            quo error asperiores corporis tempore praesentium dolorum excepturi
            incidunt natus nobis, iure aliquam accusamus adipisci consequuntur?
            Molestias dicta voluptas architecto!
          </p>
        </div>
        <div className="flex flex-col gap-6 p-1">
          <h1 className="text-xl font-semibold">10 Comments</h1>
          <div className="flex items-start justify-start gap-4 w-full">
            <img
              src="https://avatars.githubusercontent.com/u/56942108?v=4"
              alt="Profile"
              className="h-10 w-10 rounded-full border border-slate-400 hover:opacity-80 duration-300 ease-out"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="border-b border-slate-300 h-10 px-2 w-full outline-none duration-200 ease-out"
            />
          </div>
          {/* Comments */}
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="flex items-start justify-start gap-4 max-w-4/5"
            >
              <img
                src="https://avatars.githubusercontent.com/u/56942108?v=4"
                alt="Profile"
                className="h-10 w-10 rounded-full border border-slate-400 hover:opacity-80 duration-300 ease-out"
              />
              <div className="flex flex-col items-start justify-start gap-1">
                <span className="text-sm font-semibold">@revogabe</span>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Facere nemo quo error asperiores corporis.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recommends */}
      <aside className="w-100"></aside>
    </div>
  );
}
