import { useNavigate } from "react-router-dom";
import LogoBlock from "./LogoBlock";

export default function Header({
  selectedCategory,
  setSelectedCategory,
  currentUser,
}) {
  const navigate = useNavigate();

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

  const aliasIcons = {
    밤손님: "/icons/night.png",
    마스터: "/icons/wizard.png",
    요정: "/icons/fairy.png",
    바텐더: "/icons/bartender.png",
    해결사: "/icons/detective.png",
  };

  const getAliasBase = (alias) => {
    // 숫자 제외하고 앞부분만 추출 (예: 밤손님1 → 밤손님)
    return alias?.match(/^[^\d]+/)[0];
  };

  const allCategories = Object.keys(categoryIcons);

  return (
    <div className="bg-[#0b0c2a] text-white border-b border-gray-700">
      {/* 로그인 상태 또는 로그인 버튼 */}
      <div className="relative pt-6 px-4">
        <div className="absolute right-10 top-10 flex items-center gap-2">
          {currentUser ? (
            <>
              <img
                src={
                  aliasIcons[getAliasBase(currentUser.alias)] ||
                  "/icons/default.png"
                }
                alt="alias"
                className="w-6 h-6"
              />
              <span
                className="text-sm text-blue-300 font-semibold cursor-pointer"
                onClick={() => navigate("/mypage")}
              >
                {currentUser.alias}
              </span>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>
              <img src="/icons/person.png" alt="로그인" className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* 중앙 로고 */}
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
