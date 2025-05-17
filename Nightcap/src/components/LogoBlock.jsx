import { useNavigate } from "react-router-dom";

export default function LogoBlock() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="text-center cursor-pointer mb-6"
    >
      <h1 className="text-3xl font-bold text-yellow-100 flex justify-center items-center gap-2">
        🍸 Nightcap
      </h1>
      <p className="text-sm italic text-gray-400 mt-1">
        어두운 밤, 익명의 고민과 기발한 조언이 오가는 바
      </p>
    </div>
  );
}
