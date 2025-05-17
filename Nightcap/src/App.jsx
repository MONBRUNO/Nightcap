import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import NewPostPage from "./pages/NewPostPage";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              posts={posts}
              setPosts={setPosts}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/posts/:postId"
          element={
            <PostDetailPage
              posts={posts}
              setPosts={setPosts}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="/new"
          element={<NewPostPage setPosts={setPosts} />}
        />
      </Routes>
    </Router>
  );
}
