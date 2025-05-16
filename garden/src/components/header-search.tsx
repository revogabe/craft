"use client";

import { CATEGORIES } from "@/data/videos";
import React from "react";

export function HeaderSearch() {
  const [activeCategory, setActiveCategory] = React.useState(["All"]);

  const handleCategoryClick = (category: string) => {
    if (category === "All") {
      setActiveCategory(["All"]);
      return;
    }

    setActiveCategory((prev) => {
      const newCategories = prev.includes("All")
        ? prev.filter((cat) => cat !== "All")
        : [...prev];
      if (newCategories.includes(category)) {
        return newCategories.filter((cat) => cat !== category);
      }
      return [...newCategories, category];
    });
  };

  return (
    <div className="sticky top-0 bg-slate-100/90 backdrop-blur-xl container mx-auto w-full border-b border-x border-dashed border-slate-300 flex flex-col gap-4">
      <header>
        <div className="h-full w-full flex items-center justify-between px-3 pt-3 gap-4">
          <input
            className="border border-slate-300 rounded-xl py-2 px-4 w-full outline-none focus:ring-2 ring-0 ring-offset-0 focus:ring-offset-2 ring-offset-slate-100 ring-slate-500  duration-200 ease-out"
            placeholder="Search videos, channels, or topics..."
          />
          <img
            src="https://avatars.githubusercontent.com/u/56942108?v=4"
            alt="Profile"
            className="h-10 w-10 rounded-xl border border-slate-400 hover:opacity-80 duration-300 ease-out"
          />
        </div>
      </header>
      <div className="px-3 pb-3">
        <div className="flex gap-2 z-50">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              aria-label={`Filter by ${category}`}
              data-active={activeCategory.includes(category)}
              style={{
                order: activeCategory.includes(category) ? -1 : 0,
              }}
              className="border hover:bg-slate-200 data-[active=true]:text-slate-50 data-[active=true]:bg-slate-900 border-slate-300 rounded-full h-8 text-sm px-4 outline-none focus:ring-2 ring-0 ring-offset-0 focus:ring-offset-2 ring-offset-slate-100 ring-slate-500  duration-200 ease-out"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
