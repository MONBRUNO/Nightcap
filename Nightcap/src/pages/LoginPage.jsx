import LogoBlock from "../components/LogoBlock";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0c2a] text-white flex flex-col items-center justify-center px-4">
      <LogoBlock /> {/* 중앙 로고 */}
      
      <div className="bg-[#1a1b3a] p-6 rounded-xl w-full max-w-sm space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-center">로그인</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">아이디</label>
            <input type="text" className="w-full p-2 rounded bg-white text-black" required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">비밀번호</label>
            <input type="password" className="w-full p-2 rounded bg-white text-black" required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="saveId" />
            <label htmlFor="saveId" className="text-sm">아이디 저장</label>
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 rounded">
            로그인
          </button>
          <div className="flex justify-between text-xs text-blue-300 mt-2">
            <button type="button">아이디 찾기</button>
            <button type="button">비밀번호 찾기</button>
          </div>
        </form>
        <button className="mt-4 w-full text-sm text-blue-300 hover:underline">
          회원가입
        </button>
      </div>
    </div>
  );
}
