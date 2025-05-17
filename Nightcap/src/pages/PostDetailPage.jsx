import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PostDetailPage({ posts, setPosts, isLoggedIn, currentUser }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // 문자열을 숫자로 변환 - parseInt는 숫자가 아닌 문자가 포함된 경우에도 앞 부분만 파싱하므로 조심
  const postIdNum = parseInt(postId, 10);
  
  // 디버깅을 위한 콘솔 로그
  console.log("Parameter postId:", postId);
  console.log("Converted postIdNum:", postIdNum);
  console.log("Available post IDs:", posts.map(p => p.id));
  
  const post = posts.find((p) => p.id === postIdNum);
  console.log("Found post:", post);

  // 댓글 좋아요/싫어요 상태 추적용
  const [commentReactions, setCommentReactions] = useState({});

  useEffect(() => {
    // 포스트를 찾을 수 없는 경우 처리
    if (!post && posts.length > 0) {
      alert("해당 포스트를 찾을 수 없습니다.");
      navigate("/");
    }
  }, [post, navigate, posts]);

  // 현재 사용자가 댓글 작성자인지 확인하는 함수
  const isCommentAuthor = (comment) => {
    return isLoggedIn && comment.authorId === currentUser.id;
  };

  // 댓글 좋아요/싫어요 토글 함수
  const handleCommentReaction = (commentId, type) => {
    const currentReaction = commentReactions[commentId];

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postIdNum) return p;

        return {
          ...p,
          comments: p.comments.map((c) => {
            if (c.id !== commentId) return c;

            let updatedLikes = c.likes || 0;
            let updatedDislikes = c.dislikes || 0;

            if (currentReaction === type) {
              if (type === "like") updatedLikes--;
              else if (type === "dislike") updatedDislikes--;
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

  // 댓글 수정
  const handleEditComment = (commentId) => {
    const comment = post.comments.find((c) => c.id === commentId);
    const newText = prompt("댓글을 수정하세요", comment.text);
    if (newText && newText.trim()) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postIdNum
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

  // 댓글 삭제
  const handleDeleteComment = (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postIdNum
          ? {
              ...p,
              comments: p.comments.filter((c) => c.id !== commentId),
            }
          : p
      )
    );
  };

  // 댓글 추가
  const handleAddComment = (e) => {
    e.preventDefault();
    const commentText = e.target.comment.value.trim();
    if (!commentText) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postIdNum
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: Date.now(),
                  text: commentText,
                  likes: 0,
                  dislikes: 0,
                  author: currentUser.nickname || "익명",
                  authorId: currentUser.id,
                },
              ],
            }
          : p
      )
    );
    e.target.reset();
  };

  // 포스트 데이터가 로딩 중이거나 아직 없는 경우
  if (posts.length === 0) {
    return (
      <div className="bg-[#0b0c2a] min-h-screen text-white px-6 py-4">
        <p className="text-blue-400">데이터 로딩 중...</p>
      </div>
    );
  }

  // 포스트를 찾을 수 없는 경우
  if (!post) {
    return (
      <div className="bg-[#0b0c2a] min-h-screen text-white px-6 py-4">
        <p className="text-red-400">해당 포스트를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="underline text-blue-400 mt-2">
          ← 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0c2a] min-h-screen text-white px-6 py-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-400 underline"
      >
        ← 뒤로가기
      </button>

      <div className="bg-[#1a1b3a] rounded-xl p-6 shadow-md">
        <div className="text-sm text-gray-400 mb-1">
          {post.category} · {post.author}
        </div>
        <div className="text-xl mb-3">{post.content}</div>
        <div className="flex gap-4 text-sm items-center mb-4">
          <span>💖 {post.likes}</span>
          <span>💬 {post.comments.length}</span>
        </div>

        <hr className="border-gray-700 mb-4" />

        <h3 className="mb-3 text-lg font-semibold">댓글</h3>

        {post.comments.length === 0 && (
          <p className="text-gray-400">아직 댓글이 없습니다.</p>
        )}

        <div className="space-y-4">
          {post.comments.map((c) => (
            <div
              key={c.id}
              className="bg-[#2a2b4a] rounded-md p-3 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="font-bold text-sm text-blue-300 mr-2">
                    {c.author}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.id).toLocaleString().split(",")[0]}
                  </span>
                </div>
                <p>{c.text}</p>
                <div className="flex space-x-4 mt-2 text-xs text-gray-400">
                  {isCommentAuthor(c) && (
                    <>
                      <button
                        onClick={() => handleEditComment(c.id)}
                        className="hover:text-yellow-300"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="hover:text-red-400"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center text-xs space-y-1 ml-4">
                <button
                  onClick={() => handleCommentReaction(c.id, "like")}
                  className={`${
                    commentReactions[c.id] === "like"
                      ? "text-blue-400"
                      : "text-blue-300 hover:text-blue-400"
                  }`}
                >
                  👍 {c.likes || 0}
                </button>
                <button
                  onClick={() => handleCommentReaction(c.id, "dislike")}
                  className={`${
                    commentReactions[c.id] === "dislike"
                      ? "text-red-400"
                      : "text-red-300 hover:text-red-400"
                  }`}
                >
                  👎 {c.dislikes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

        {isLoggedIn ? (
          <form onSubmit={handleAddComment} className="mt-6">
            <input
              name="comment"
              maxLength={100}
              placeholder="100자 이내로 댓글 작성"
              className="w-full bg-[#2a2b4a] px-3 py-2 rounded-md text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="mt-2 bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md font-bold"
            >
              댓글 달기
            </button>
          </form>
        ) : (
          <p className="mt-6 text-gray-400">
            댓글을 작성하려면{" "}
            <a href="/login" className="underline text-blue-400">
              로그인
            </a>{" "}
            이 필요합니다.
          </p>
        )}
      </div>
    </div>
  );
}