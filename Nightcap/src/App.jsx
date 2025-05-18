import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import NewPostPage from "./pages/NewPostPage";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import SignupPage from "./pages/SignupPage";

export default function App() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);

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
    <Router>
      <div className="App">
        {/* 이 부분은 개발용으로 잠시만 보이게 하고 지워도 됩니다 */}
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{message}</p>
        </header> */}

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                posts={posts}
                setPosts={setPosts}
                isLoggedIn={isLoggedIn}
                authToken={authToken}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setAuthToken={setAuthToken}
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
              />
            }
          />
          <Route path="/new" element={<NewPostPage setPosts={setPosts} />} />
        </Routes>
      </div>
    </Router>
  );
}
