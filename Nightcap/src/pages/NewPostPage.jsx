// NewPostPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewPostPage({ setPosts }) {
  const navigate = useNavigate();

  const handleAddPost = (e) => {
    e.preventDefault();
    const category = e.target.category.value.trim();
    const content = e.target.content.value.trim();

    if (!category || !content) {
      alert("카테고리와 내용을 모두 입력해주세요.");
      return;
    }

    fetch("http://localhost:8080/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        content,
        author: "익명", // 나중에 currentUser.nickname으로 대체 가능
      }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        setPosts((prev) => [...prev, newPost]);
        navigate("/");
      })
      .catch((err) => {
        console.error("등록 실패:", err);
        alert("등록 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="bg-[#0b0c2a] min-h-screen text-white px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">새 고민 작성</h2>
      <form onSubmit={handleAddPost} className="space-y-4">
        <input
          name="category"
          placeholder="카테고리 (예: 연애, 진로, 인간관계 등)"
          className="w-full bg-[#1a1b3a] p-3 rounded-md text-white placeholder-gray-400"
        />
        <textarea
          name="content"
          placeholder="고민 내용을 입력하세요..."
          className="w-full bg-[#1a1b3a] p-3 rounded-md text-white placeholder-gray-400"
          rows={5}
        />
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md font-bold"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
