import { useNavigate } from "react-router-dom";
import LogoBlock from "./LogoBlock";

// 수정 후
export default function Header({
  selectedCategory,
  setSelectedCategory,
  currentUser,
}) {
  const navigate = useNavigate();

  const aliasIcons = {
    밤손님: "/icons/night.png",
    마스터: "/icons/wizard.png",
    요정: "/icons/fairy.png",
    바텐더: "/icons/bartender.png",
    해결사: "/icons/detective.png",
  };

  const getAliasBase = (alias) => alias?.match(/^[^\d]+/)[0];

  return (
    <div className="bg-[#0b0c2a] text-white border-b border-gray-700">
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

        <div className="flex justify-center">
          <LogoBlock resetCategory={() => setSelectedCategory("전체")} />
        </div>
      </div>
    </div>
  );
}
