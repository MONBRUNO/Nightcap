import { useEffect, useState } from "react";

export default function MyPage({ currentUser, isLoggedIn }) {
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // 내가 쓴 글
    fetch(`http://localhost:8080/users/${currentUser.id}/posts`)
      .then((res) => res.json())
      .then((data) => setMyPosts(data));

    // 내가 공감한 글
    fetch(`http://localhost:8080/users/${currentUser.id}/liked-posts`)
      .then((res) => res.json())
      .then((data) => setLikedPosts(data));

    // 내가 댓글 단 글
    fetch(`http://localhost:8080/users/${currentUser.id}/commented-posts`)
      .then((res) => res.json())
      .then((data) => setCommentedPosts(data));
  }, [currentUser, isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#0b0c2a] text-white px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        {currentUser.alias}님의 마이페이지
      </h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">내가 쓴 글</h2>
        {myPosts.map((post) => (
          <div key={post.id} className="bg-[#1a1b3a] p-4 rounded mb-2">
            {post.content}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">공감한 글</h2>
        {likedPosts.map((post) => (
          <div key={post.id} className="bg-[#1a1b3a] p-4 rounded mb-2">
            {post.content}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">댓글 단 글</h2>
        {commentedPosts.map((post) => (
          <div key={post.id} className="bg-[#1a1b3a] p-4 rounded mb-2">
            {post.content}
          </div>
        ))}
      </section>
    </div>
  );
}
