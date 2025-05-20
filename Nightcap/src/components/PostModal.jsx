import { useState } from "react";

export default function PostModal({ onClose, onSubmit, currentUser }) {
  const categories = [
    "연애",
    "가정",
    "학업",
    "직장",
    "교우",
    "건강",
    "메뉴",
    "당근",
    "TMI",
  ];
  const [category, setCategory] = useState("연애");
  const [content, setContent] = useState("");

  // 테마 아이디 → 아이콘 경로
  const getAliasIcon = (alias = "") => {
    const base = alias.match(/^[^\d]+/)?.[0] || "";
    const icons = {
      밤손님: "/icons/night.png",
      마스터: "/icons/wizard.png",
      요정: "/icons/fairy.png",
      바텐더: "/icons/bartender.png",
      해결사: "/icons/detective.png",
    };
    return icons[base] || "/icons/default.png";
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("고민을 작성해주세요.");
      return;
    }

    const authorAlias = currentUser?.alias || "익명";

    const postData = {
      category,
      content,
      authorAlias: currentUser?.alias || "익명",
      userId: currentUser?.id || null,
      title: content.slice(0, 15), // ← 요거 추가!
      profileIcon: getAliasIcon(currentUser?.alias),
    };

    console.log("📦 보낼 postData:", postData);

    fetch("http://localhost:8080/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 실패");
        return res.text(); // 문자열 응답일 경우
      })
      .then((data) => {
        console.log("등록 성공:", data);
        onSubmit(postData); // ← 등록된 글 데이터를 넘김

        onClose();
      })
      .catch((err) => {
        console.error("등록 실패:", err);
        alert("서버 오류로 등록에 실패했습니다.");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-[#1a1b3a] p-6 rounded-xl w-80 text-white shadow-lg">
        <h2 className="text-lg font-bold mb-4">고민 작성하기</h2>

        <label className="block mb-2 text-sm">카테고리 선택</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-[#2a2b4a] text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="고민을 한 줄로 작성해주세요"
          className="w-full p-2 mb-4 rounded bg-[#2a2b4a] text-white resize-none"
        />

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-sm"
          >
            닫기
          </button>
          <button
            onClick={handleSubmit}
            className="bg-pink-500 px-4 py-1 rounded hover:bg-pink-600 font-bold text-sm"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
