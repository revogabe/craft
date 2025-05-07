import type { NextLayout } from "@/types/next";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Playground",
  description: "Playground for testing",
};

export default function PlaygroundLayout({ children }: NextLayout) {
  if (process.env.ENVIRONMENT !== "development") {
    return redirect("/404");
  }
  return <main className="min-h-screen w-full mx-auto">{children}</main>;
}
