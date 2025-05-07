import type { NextLayout } from "@/types/next";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Playground",
  description: "Playground for testing",
};

export default function PlaygroundLayout({ children }: NextLayout) {
  return <main className="min-h-screen w-full mx-auto">{children}</main>;
}
