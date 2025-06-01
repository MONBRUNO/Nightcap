import React from "react";
import { useLocation } from "react-router-dom";

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const location = useLocation();
  const hiddenRoutes = ["/", "/mypage"]; // 카테고리를 숨길 경로들

  if (hiddenRoutes.includes(location.pathname)) return null;

  const categoryIcons = {
    전체: "all",
    연애: "love",
    가정: "family",
    학업: "study",
    직장: "work",
    교우: "friends",
    건강: "health",
    메뉴: "menu",
    당근: "carrot",
    TMI: "tmi",
  };

  const allCategories = Object.keys(categoryIcons);

  return (
    <div className="flex flex-wrap gap-3 justify-center bg-[#1a1b3a] py-3 px-4">
      {allCategories.map((cat, i) => (
        <button
          key={i}
          onClick={() => setSelectedCategory(cat)}
          className={`flex items-center gap-1 px-4 py-1 rounded-full font-bold transition ${
            selectedCategory === cat
              ? "bg-blue-400 text-black"
              : "bg-blue-300 text-black hover:bg-blue-400"
          }`}
        >
          <img
            src={`/icons/${categoryIcons[cat]}.png`}
            alt={cat}
            className="w-5 h-5"
          />
          {cat}
        </button>
      ))}
    </div>
  );
}
