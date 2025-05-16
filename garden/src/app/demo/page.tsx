"use client";

import { VideoCard } from "@/components/video-card";
import { VIDEOS } from "@/data/videos";
import React from "react";

export default function DemoPage() {
  return (
    <div className="flex flex-col items-start justify-start min-h-screen container border-x border-slate-300 border-dashed mx-auto">
      <div className="grid grid-cols-4 p-4 w-full gap-4">
        {VIDEOS.map((video) => (
          <VideoCard
            key={video.href}
            href={video.href}
            title={video.title}
            description={video.description}
            categorys={video.categorys}
            views={video.views}
            date={video.date}
            thumbnail={video.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}
