import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "../components/PostModal";

export default function HomePage({ posts, setPosts, isLoggedIn, currentUser }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentReactions, setCommentReactions] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  if (isLoggedIn && !currentUser) {
    return <div className="text-red-400 p-4">로그인 정보가 없습니다.</div>;
  }

  const filteredPosts = Array.isArray(posts)
    ? selectedCategory === "전체"
      ? posts
      : posts.filter((post) => post.category === selectedCategory)
    : [];

  const handleAddPost = (newPost) => {
    setPosts((prev) => [...prev, { ...newPost, comments: [], likes: 0 }]);
  };

  const handleAddComment = (postId, comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: Date.now(),
                  text: comment,
                  likes: 0,
                  dislikes: 0,
                  author: currentUser?.alias || "익명",
                  authorId: currentUser?.id || null,
                  profileIcon: getAliasIcon(currentUser?.alias),
                },
              ],
            }
          : p
      )
    );
  };

  const handleTogglePostLike = (postId) => {
    const alreadyLiked = likedPosts[postId];
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: alreadyLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    setLikedPosts((prev) => ({ ...prev, [postId]: !alreadyLiked }));
  };

  const handleCommentReaction = (postId, commentId, type) => {
    const currentReaction = commentReactions[commentId];
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((c) => {
            if (c.id !== commentId) return c;
            let updatedLikes = c.likes || 0;
            let updatedDislikes = c.dislikes || 0;
            if (currentReaction === type) {
              if (type === "like") updatedLikes--;
              if (type === "dislike") updatedDislikes--;
              return { ...c, likes: updatedLikes, dislikes: updatedDislikes };
            }
            if (currentReaction === "like" && type === "dislike") {
              updatedLikes--;
              updatedDislikes++;
            } else if (currentReaction === "dislike" && type === "like") {
              updatedDislikes--;
              updatedLikes++;
            } else if (!currentReaction) {
              if (type === "like") updatedLikes++;
              else updatedDislikes++;
            }
            return { ...c, likes: updatedLikes, dislikes: updatedDislikes };
          }),
        };
      })
    );
    setCommentReactions((prev) => {
      if (currentReaction === type) {
        const updated = { ...prev };
        delete updated[commentId];
        return updated;
      } else {
        return { ...prev, [commentId]: type };
      }
    });
  };

  const handleEditComment = (postId, commentId) => {
    const post = posts.find((p) => p.id === postId);
    const comment = post.comments.find((c) => c.id === commentId);
    const newText = prompt("댓글을 수정하세요", comment.text);
    if (newText && newText.trim()) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments.map((c) =>
                  c.id === commentId ? { ...c, text: newText.trim() } : c
                ),
              }
            : p
        )
      );
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      )
    );
  };

  const isCommentAuthor = (comment) => {
    return isLoggedIn && currentUser && comment.authorId === currentUser.id;
  };

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

  return (
    <div className="bg-[#0b0c2a] min-h-screen text-white">
      <button
        onClick={() => {
          if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            window.location.href = "/login";
            return;
          }
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition"
      >
        ✍️ 고민 쓰기
      </button>

      <div className="px-6 pt-6 space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            아직 게시물이 없습니다. 첫 게시물을 작성해보세요!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#1a1b3a] p-4 rounded-xl shadow-md cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{post.category}</span>
                <div className="flex items-center gap-1">
                  <img
                    src={post.profileIcon || "/icons/default.png"}
                    className="w-5 h-5"
                    alt="icon"
                  />
                  <span>{post.author}</span>
                </div>
              </div>

              <div className="text-lg my-2">{post.content}</div>

              <div className="flex gap-4 text-sm items-center">
                <button
                  className={
                    likedPosts[post.id]
                      ? "text-pink-400"
                      : "text-blue-300 hover:text-blue-400"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePostLike(post.id);
                  }}
                >
                  💖 {post.likes}
                </button>
                <span>💬 {post.comments.length}</span>
              </div>

              <div className="mt-3 space-y-2">
                {post.comments.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="text-sm text-gray-200 flex justify-between items-start"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-1 items-center">
                      <img
                        src={c.profileIcon || "/icons/default.png"}
                        className="w-4 h-4"
                        alt="icon"
                      />
                      <span className="font-bold text-blue-300">
                        {c.author}
                      </span>
                      <span>: {c.text}</span>
                      {isCommentAuthor(c) && (
                        <div className="flex gap-2 text-xs text-gray-400 ml-2">
                          <button
                            onClick={() => handleEditComment(post.id, c.id)}
                            className="hover:text-yellow-300"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(post.id, c.id)}
                            className="hover:text-red-300"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2 text-xs">
                      <button
                        onClick={() =>
                          handleCommentReaction(post.id, c.id, "like")
                        }
                        className={
                          commentReactions[c.id] === "like"
                            ? "text-blue-400"
                            : "text-blue-300 hover:text-blue-400"
                        }
                      >
                        👍 {c.likes || 0}
                      </button>
                      <button
                        onClick={() =>
                          handleCommentReaction(post.id, c.id, "dislike")
                        }
                        className={
                          commentReactions[c.id] === "dislike"
                            ? "text-red-400"
                            : "text-red-300 hover:text-red-400"
                        }
                      >
                        👎 {c.dislikes || 0}
                      </button>
                    </div>
                  </div>
                ))}

                {post.comments.length > 2 && (
                  <button
                    className="text-sm text-blue-400 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/posts/${post.id}`);
                    }}
                  >
                    댓글 더보기...
                  </button>
                )}
              </div>

              {isLoggedIn ? (
                <form
                  className="mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = e.target.comment.value.trim();
                    if (value) {
                      handleAddComment(post.id, value);
                      e.target.reset();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    name="comment"
                    maxLength={100}
                    placeholder="100자 이내의 재치 있는 댓글을 달아보세요!"
                    className="w-full bg-[#2a2b4a] px-3 py-2 rounded-md text-white placeholder-gray-400"
                  />
                </form>
              ) : (
                <div className="mt-2 text-sm text-gray-400">
                  💬 댓글을 작성하려면 {" "}
                  <a href="/login" className="underline text-blue-300">
                    로그인
                  </a>{" "}
                  이 필요합니다.
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPost}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
