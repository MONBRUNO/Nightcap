import { useState, useEffect } from "react";
import LogoBlock from "../components/LogoBlock";
import { useNavigate } from "react-router-dom";

export default function LoginPage({
  setIsLoggedIn,
  setUserId,
  setCurrentUser,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saveId, setSaveId] = useState(false);
  const navigate = useNavigate();
  const [loginSuccessMsg, setLoginSuccessMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setErrorMsg("아이디 또는 비밀번호가 틀렸습니다.");
        return;
      }

      if (saveId) {
        localStorage.setItem("savedUsername", username);
      } else {
        localStorage.removeItem("savedUsername");
      }

      const user = await res.json();
      setCurrentUser(user); // alias 포함된 전체 유저 객체

      setIsLoggedIn(true);
      setUserId(user.id);
      setCurrentUser(user);

      setLoginSuccessMsg("로그인 완료!");
      setTimeout(() => {
        setLoginSuccessMsg("");
        navigate("/");
      }, 2000);
      // 로그인 성공 후
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedUsername");
    if (saved) {
      setUsername(saved);
      setSaveId(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c2a] text-white flex flex-col items-center justify-center px-4">
      {loginSuccessMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition">
          {loginSuccessMsg}
        </div>
      )}
      <LogoBlock />
      <div className="bg-[#1a1b3a] p-6 rounded-xl w-full max-w-sm space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-center">로그인</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm font-medium">아이디</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-white text-black"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">비밀번호</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-white text-black"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveId"
              checked={saveId}
              onChange={() => setSaveId(!saveId)}
            />
            <label htmlFor="saveId" className="text-sm">
              아이디 저장
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 rounded"
          >
            로그인
          </button>
          {errorMsg && <p className="text-red-400 text-center">{errorMsg}</p>}
          <div className="flex justify-between text-xs text-blue-300 mt-2">
            <button type="button">아이디 찾기</button>
            <button type="button">비밀번호 찾기</button>
          </div>
        </form>
        <button
          className="mt-4 w-full text-sm text-blue-300 hover:underline"
          onClick={() => navigate("/signup")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
