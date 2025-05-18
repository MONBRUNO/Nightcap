import { useNavigate } from "react-router-dom";
import LogoBlock from "./LogoBlock";

export default function Header({ selectedCategory, setSelectedCategory }) {
  const navigate = useNavigate();

  // 한글 카테고리 → 영어 아이콘 파일명 매핑
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
    <div className="bg-[#0b0c2a] text-white border-b border-gray-700">
      {/* 로그인 버튼 우상단 + 중앙 로고 */}
      <div className="relative pt-6 px-4">
        {/* 오른쪽 상단 로그인 아이콘 */}
        <button
          onClick={() => navigate("/login")}
          className="absolute right-10 top-10"
        >
          <img src="/icons/person.png" alt="로그인" className="w-6 h-6" />
        </button>

        {/* 중앙 로고를 가운데 정렬 */}
        <div className="flex justify-center">
          <LogoBlock />
        </div>
      </div>

      {/* 카테고리 필터 */}
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
    </div>
  );
}
