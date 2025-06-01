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
import CategoryFilter from "./components/CategoryFilter";
import IntroPage from "./pages/IntroPage";

export default function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/login", "/signup", "/mypage"];
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
    const savedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    const SESSION_DURATION = 1000 * 60 * 60; // 1시간

    if (savedUser && loginTime) {
      const now = Date.now();
      const elapsed = now - parseInt(loginTime, 10);

      if (elapsed < SESSION_DURATION) {
        const parsed = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setCurrentUser(parsed);
        setUserId(parsed.id);
      } else {
        // ⏱ 세션 만료
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserId(null);
        alert("세션이 만료되어 자동 로그아웃 되었습니다.");
      }
    }
  }, []);

  useEffect(() => {
  const saved =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  if (saved) {
    setIsLoggedIn(true);
    setCurrentUser(saved);
    setUserId(saved.id);
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

      {!["/new", "/signup", "/login"].includes(location.pathname) &&
        !location.pathname.startsWith("/posts") && (
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

      <Routes>
  <Route path="/" element={<IntroPage />} />
  <Route
    path="/home"
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
