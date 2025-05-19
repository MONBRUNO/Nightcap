import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import NewPostPage from "./pages/NewPostPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  useEffect(() => {
    fetch("/test")
      .then((res) => res.text())
      .then((m) => setMessage(m));
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
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setUserId={setUserId}
              setCurrentUser={setCurrentUser} // ✅ 추가
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
            />
          }
        />
      </Routes>
    </div>
  );
}
