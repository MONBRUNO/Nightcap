// src/pages/IntroPage.jsx
import { useNavigate } from "react-router-dom";
import LogoBlock from "../components/LogoBlock";

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0c2a] flex flex-col items-center justify-center text-white text-center px-4">
      <LogoBlock />
      <p className="text-lg mt-4 mb-8 text-gray-300">
        익명의 고민과 따뜻한 조언이 오가는 밤의 바에 오신 것을 환영합니다.
      </p>
      <button
        onClick={() => navigate("/home")}
        className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-full text-lg font-bold transition"
      >
        🍷 입장하기
      </button>
    </div>
  );
}
