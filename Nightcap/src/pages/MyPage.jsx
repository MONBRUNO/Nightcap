import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가

export default function MyPage({ currentUser, isLoggedIn }) {
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);

  const navigate = useNavigate(); // ✅ 추가

  const getAliasBase = (alias) => {
    return alias?.match(/^[^\d]+/)?.[0] || "기본";
  };

  const aliasIcons = {
    밤손님: "/icons/night.png",
    마스터: "/icons/wizard.png",
    요정: "/icons/fairy.png",
    바텐더: "/icons/bartender.png",
    해결사: "/icons/detective.png",
  };

  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) return;

    fetch(`http://localhost:8080/users/${currentUser.id}/posts`)
      .then((res) => res.json())
      .then((data) => setMyPosts(Array.isArray(data) ? data : []));

    fetch(`http://localhost:8080/users/${currentUser.id}/liked-posts`)
      .then((res) => res.json())
      .then((data) => setLikedPosts(Array.isArray(data) ? data : []));

    fetch(`http://localhost:8080/users/${currentUser.id}/commented-posts`)
      .then((res) => res.json())
      .then((data) => setCommentedPosts(Array.isArray(data) ? data : []));
  }, [currentUser, isLoggedIn]);

  const Section = ({ title, posts, emptyMessage }) => (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-pink-300">{title}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)} // ✅ 클릭 시 이동
              className="cursor-pointer bg-[#1a1b3a] p-4 rounded-xl shadow hover:shadow-lg hover:bg-[#25274a] transition"
            >
              <div className="text-sm text-gray-400 mb-1">{post.title}</div>
              <div className="text-white">{post.content}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#0b0c2a] text-white px-6 py-10">
      <div className="w-2/3 mx-auto mb-6 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-[#1a1b3a] text-blue-300 rounded-full text-sm font-semibold shadow hover:bg-[#2a2c4a] hover:text-blue-200 transition"
        >
          ← 뒤로가기
        </button>
      </div>

      <div className="w-2/3 mx-auto space-y-12">
        {/* 상단 헤더 + 로그아웃 */}
        <div className="bg-[#1a1b3a] p-6 rounded-xl shadow flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <img
                src={
                  aliasIcons[getAliasBase(currentUser?.alias)] ||
                  "/icons/default.png"
                }
                alt="icon"
                className="w-6 h-6"
              />
              {currentUser?.alias || "사용자"}님의 마이페이지
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              내가 남긴 글과 공감, 댓글들을 확인해보세요 😊
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
          >
            로그아웃
          </button>
        </div>

        <Section
          title="📌 내가 쓴 글"
          posts={myPosts}
          emptyMessage="작성한 글이 없습니다."
        />

        <div className="border-t border-gray-700 my-8 w-2/3 mx-auto" />

        <Section
          title="💖 공감한 글"
          posts={likedPosts}
          emptyMessage="공감한 글이 없습니다."
        />

        <div className="border-t border-gray-700 my-8 w-2/3 mx-auto" />

        <Section
          title="💬 댓글 단 글"
          posts={commentedPosts}
          emptyMessage="댓글 단 글이 없습니다."
        />
      </div>
    </div>
  );
}
