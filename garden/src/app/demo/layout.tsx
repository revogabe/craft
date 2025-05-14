import {
  MiniPlayerPictureInPicture,
  MiniPlayerProvider,
} from "@/seeds/mini-player/mini-player";
import type { NextLayout } from "@/types/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Playground for testing",
};

export default function DemoLayout({ children }: NextLayout) {
  return (
    <MiniPlayerProvider snapping>
      <main className="min-h-screen w-full mx-auto">
        <MiniPlayerPictureInPicture />
        {children}
      </main>
    </MiniPlayerProvider>
  );
}
