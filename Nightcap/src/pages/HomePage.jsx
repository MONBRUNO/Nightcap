import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage({
  posts,
  setPosts,
  isLoggedIn,
  currentUser,
  selectedCategory,
}) {
  const navigate = useNavigate();
  const [commentReactions, setCommentReactions] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  const categoryIcons = {
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

  useEffect(() => {
    const fetchCommentsForAllPosts = async () => {
      const updatedPosts = await Promise.all(
        posts.map(async (post) => {
          const res = await fetch(
            `http://localhost:8080/posts/${post.id}/comments`
          );
          const comments = await res.json();
          return { ...post, comments: Array.isArray(comments) ? comments : [] };
        })
      );
      setPosts(updatedPosts);
    };

    if (posts.length > 0) {
      fetchCommentsForAllPosts();
    }
  }, []);

  if (isLoggedIn && !currentUser) {
    return <div className="text-red-400 p-4">로그인 정보가 없습니다.</div>;
  }

  const filteredPosts = Array.isArray(posts)
    ? selectedCategory === "전체"
      ? posts
      : posts.filter((post) => post.category === selectedCategory)
    : [];

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

  const handleAddPost = async (newPost) => {
    try {
      const res = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error("글 등록 실패");

      const savedPost = await res.json();
      savedPost.likes = 0;
      savedPost.comments = [];

      setPosts((prev) => [...prev, savedPost]);
    } catch (err) {
      console.error("글 등록 실패:", err);
      alert("글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText || !commentText.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const newCommentData = {
      content: commentText.trim(),
      authorAlias: currentUser?.alias || "익명",
      userId: currentUser?.id || null,
      profileIcon: getAliasIcon(currentUser?.alias),
    };

    try {
      const res = await fetch(
        `http://localhost:8080/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCommentData),
        }
      );

      if (!res.ok) throw new Error("서버 저장 실패");

      const savedComment = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: Array.isArray(p.comments)
                  ? [...p.comments, savedComment]
                  : [savedComment],
              }
            : p
        )
      );
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      alert("댓글 저장에 실패했습니다.");
    }
  };

  const handleTogglePostLike = async (postId) => {
    if (!isLoggedIn || !currentUser?.id) {
      alert("공감은 로그인 후에 사용할 수 있습니다.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/posts/${postId}/like?userId=${currentUser.id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("서버 에러");

      const result = await res.text();
      console.log("🧪 서버 응답 결과:", result); // ✅ 이 줄 추가!

      // 상태 업데이트: 공감 수 반영
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes:
                  result === "liked"
                    ? (p.likes || 0) + 1
                    : Math.max((p.likes || 1) - 1, 0),
              }
            : p
        )
      );

      // 공감 여부 저장 (선택)
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: result === "liked",
      }));
    } catch (err) {
      console.error("공감 실패:", err);
      alert("공감 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCommentReaction = (postId, commentId, type) => {
    const currentReaction = commentReactions[commentId];
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: Array.isArray(post.comments)
            ? post.comments.map((c) => {
                if (c.id !== commentId) return c;
                let updatedLikes = c.likes || 0;
                let updatedDislikes = c.dislikes || 0;
                if (currentReaction === type) {
                  if (type === "like") updatedLikes--;
                  if (type === "dislike") updatedDislikes--;
                } else {
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
                }
                return { ...c, likes: updatedLikes, dislikes: updatedDislikes };
              })
            : [],
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
    const comment = Array.isArray(post.comments)
      ? post.comments.find((c) => c.id === commentId)
      : null;
    const newText = prompt("댓글을 수정하세요", comment?.content);
    if (newText && newText.trim()) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: Array.isArray(p.comments)
                  ? p.comments.map((c) =>
                      c.id === commentId ? { ...c, content: newText.trim() } : c
                    )
                  : [],
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
          ? {
              ...p,
              comments: Array.isArray(p.comments)
                ? p.comments.filter((c) => c.id !== commentId)
                : [],
            }
          : p
      )
    );
  };

  const isCommentAuthor = (comment) =>
    isLoggedIn && currentUser && comment.authorId === currentUser.id;

  return (
    <div className="bg-[#0b0c2a] min-h-screen text-white">
      <button
        onClick={() => {
          if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            window.location.href = "/login";
            return;
          }
          navigate("/new"); // ✅ 페이지 이동으로 수정
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
              className="bg-[#1a1b3a] p-4 rounded-xl shadow-md"
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (!post.id) {
                    console.error("❌ post.id가 없습니다:", post);
                    return alert("잘못된 게시글입니다. 관리자에게 문의하세요.");
                  }
                  navigate(`/posts/${post.id}`);
                }}
              >
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex items-center gap-1 bg-blue-300 px-2 py-1 rounded-full text-sm text-black font-medium">
                    <img
                      src={`/icons/${
                        categoryIcons[post.category] ?? "default"
                      }.png`}
                      className="w-4 h-4"
                      alt="category"
                    />
                    <span>{post.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img
                      src={post.profileIcon || "/icons/default.png"}
                      className="w-5 h-5"
                      alt="icon"
                    />
                    <span>{post.author || post.authorAlias || "익명"}</span>
                  </div>
                </div>
                <div className="text-base my-2">{post.content}</div>
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
                    💖 {post.likes ?? 0}
                  </button>
                  <span>
                    💬 {Array.isArray(post.comments) ? post.comments.length : 0}
                  </span>
                </div>
              </div>

              {/* 댓글 미리보기 */}
              <div className="mt-3 space-y-2">
                {Array.isArray(post.comments) &&
                  [...post.comments]
                    .sort((a, b) =>
                      (b.likes || 0) !== (a.likes || 0)
                        ? (b.likes || 0) - (a.likes || 0)
                        : new Date(a.createdAt) - new Date(b.createdAt)
                    )
                    .slice(0, 2)
                    .map((c) => (
                      <div
                        key={c.id}
                        className="text-sm text-gray-200 flex justify-between items-start"
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
                          <span>: {c.content}</span>
                          {isCommentAuthor(c) && (
                            <div className="flex gap-2 text-xs text-gray-400 ml-2">
                              <button
                                onClick={() => handleEditComment(post.id, c.id)}
                                className="hover:text-yellow-300"
                              >
                                수정
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComment(post.id, c.id)
                                }
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
              </div>

              {isLoggedIn ? (
                <form
                  className="mt-2"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const value = e.target.elements.comment?.value.trim();
                    const postId = e.target.elements.postId?.value;

                    if (!value || !postId) {
                      console.error("댓글 내용 또는 postId 누락");
                      return;
                    }

                    handleAddComment(Number(postId), value);
                    e.target.reset();
                  }}
                >
                  <input type="hidden" name="postId" value={post.id} />
                  <input
                    name="comment"
                    maxLength={100}
                    placeholder="100자 이내의 재치 있는 댓글을 달아보세요!"
                    className="w-full bg-[#2a2b4a] px-3 py-2 rounded-md text-white placeholder-gray-400"
                  />
                </form>
              ) : (
                <div className="mt-2 text-sm text-gray-400">
                  💬 댓글을 작성하려면{" "}
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
    </div>
  );
}
