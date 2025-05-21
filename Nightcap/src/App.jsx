import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import NewPostPage from "./pages/NewPostPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";
import MyPage from "./pages/MyPage";
import "./App.css";

export default function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log("서버에서 받아온 posts:", data);
        setPosts(data);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setIsLoggedIn(true);
      setCurrentUser(parsed);
      setUserId(parsed.id);
    }
  }, []);

  return (
    <div className="App">
      {!shouldHideHeader && (
        <Header
          currentUser={currentUser}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              posts={posts}
              setPosts={setPosts}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              selectedCategory={selectedCategory}
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setUserId={setUserId}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/posts/:postId"
          element={
            <PostDetailPage
              posts={posts}
              setPosts={setPosts}
              isLoggedIn={isLoggedIn}
              authToken={authToken}
              userId={userId}
              currentUser={currentUser} // ✅ 이 줄 추가
            />
          }
        />

        <Route
          path="/new"
          element={
            <NewPostPage
              setPosts={setPosts}
              isLoggedIn={isLoggedIn}
              userId={userId}
              currentUser={currentUser}
            />
          }
        />

        <Route
          path="/mypage"
          element={<MyPage currentUser={currentUser} isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </div>
  );
}
