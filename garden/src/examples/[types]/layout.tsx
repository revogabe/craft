import type { NextLayout } from "@/types/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Playground for testing",
};

export default async function TypesLayout({
  children,
  params,
}: NextLayout<{ types: string }>) {
  const { types } = await params;

  return (
    <main>
      <h1>Layout: {types}</h1>
      {children}
    </main>
  );
}
