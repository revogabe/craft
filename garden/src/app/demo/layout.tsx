import { HeaderSearch } from "@/components/header-search";
import { DemoProvider } from "@/seeds/mini-player/demo";
import type { NextLayout } from "@/types/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Playground for testing",
};

export default function DemoLayout({ children }: NextLayout) {
  return (
    <DemoProvider className="rounded-xl">
      <main className="min-h-screen w-full mx-auto bg-slate-100 text-slate-950">
        <HeaderSearch />
        {children}
      </main>
    </DemoProvider>
  );
}
