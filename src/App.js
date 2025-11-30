import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
/* 메인화면 */
import MainBeforeLogin from "./pages/home/MainBeforeLogin";
import MainAfterLogin from "./pages/home/MainAfterLogin";
/* 로그인/회원가입 */
import Login from "./pages/user/auth/Login";
import Register from "./pages/user/auth/Register";
import FindId from "./pages/user/auth/FindId";
import FindPw from "./pages/user/auth/FindPw";
import EmailVerification from "./pages/user/auth/EmailVerification";
/* 사용자 페이지 */
import ProfileView from "./pages/user/profile/ProfileView";
import NoticeDetail from "./pages/user/community/tabs/NoticeDetail";
import Community from "./pages/user/community/CommunityPage";
import CalendarPage from "./pages/user/calendar/CalendarPage";
import CharacterPage from "./pages/user/character/CharacterPage";
import RankingPage from "./pages/user/ranking/RankingPage";
import StudyPage from "./pages/user/study/StudyPage";
/* 단어 게임 */
import GamePage from "./pages/user/game/GamePage";
import WordGamePageBasic from "./pages/user/game/WordGamePageBasic";
import WordGamePageCustom from "./pages/user/game/WordGamePageCustom";
import WordQuizPage from "./pages/user/game/WordQuizPage";
import ResultPage from "./pages/user/game/ResultPage";
import AcidRainPage from "./pages/user/game/AcidRainPage";
/* 전역 저장소 */
import { WordSetProvider } from "./context/WordSetContext";

/* 관리자 페이지 */
import MainAdmin from "./pages/admin/MainAdmin";
import AdminProfilePage from "./pages/admin/profile/AdminProfilePage";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminCharacter from "./pages/admin/AdminCharacter";
import AdminGame from "./pages/admin/AdminGame";
import AdminRanking from "./pages/admin/AdminRanking";

function RequireAdmin({ children }) {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/home/before" replace />;
}

function App() {
  /* 사용자/관리자 테마 분리 적용 */
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      document.documentElement.classList.add("admin-mode");
      document.documentElement.classList.remove("user-mode");

      const adminBg = localStorage.getItem("adminThemeBg") || "#FFF4A3";
      const adminAccent = localStorage.getItem("adminThemeAccent") || "#FFD400";

      document.documentElement.style.setProperty("--admin-theme-bg", adminBg);
      document.documentElement.style.setProperty("--admin-theme-accent", adminAccent);
    } else {
      document.documentElement.classList.add("user-mode");
      document.documentElement.classList.remove("admin-mode");

      const userBg = localStorage.getItem("userThemeBg") || "#FFF4A3";
      const userAccent = localStorage.getItem("userThemeAccent") || "#FFD400";

      document.documentElement.style.setProperty("--user-theme-bg", userBg);
      document.documentElement.style.setProperty("--user-theme-accent", userAccent);
    }
  }, []);

  return (
    <WordSetProvider>
      <Router>
        <Routes>

          {/* 메인 화면 */}
          <Route path="/home/before" element={<MainBeforeLogin />} />
          <Route path="/home/after" element={<MainAfterLogin />} />

          {/* 관리자 전용 */}
          <Route path="/admin/main" element={<RequireAdmin><MainAdmin /></RequireAdmin>} />
          <Route path="/admin/profile" element={<RequireAdmin><AdminProfilePage /></RequireAdmin>} />
          <Route path="/admin/character" element={<RequireAdmin><AdminCharacter /></RequireAdmin>} />
          <Route path="/admin/game" element={<RequireAdmin><AdminGame /></RequireAdmin>} />
          <Route path="/admin/ranking" element={<RequireAdmin><AdminRanking /></RequireAdmin>} />
          <Route path="/admin/community" element={<RequireAdmin><AdminCommunity /></RequireAdmin>} />
          <Route path="/admin/setting" element={<RequireAdmin><AdminProfilePage /></RequireAdmin>} />
          
          {/* 인증 관련 */}
          <Route path="/user/auth/Login" element={<Login />} />
          <Route path="/user/auth/Register" element={<Register />} />
          <Route path="/user/auth/FindId" element={<FindId />} />
          <Route path="/user/auth/FindPw" element={<FindPw />} />
          <Route path="/user/auth/EmailVerification" element={<EmailVerification />} />

          {/* 내 정보 */}
          <Route path="/user/profile/view" element={<ProfileView />} />
          
          {/* 캘린더 */}
          <Route path="/user/calendar" element={<CalendarPage />} />

          {/* 커뮤니티 */}
          <Route path="/user/community" element={<Community />} />
          <Route path="/user/community/notice-detail" element={<NoticeDetail />} />

          {/* 캐릭터 */}
          <Route path="/user/character" element={<CharacterPage/>} />

          {/* 게임 */}
          <Route path="/user/game" element={<GamePage />} />
          <Route path="/user/game/word" element={<WordGamePageBasic />} />
          <Route path="/user/game/upload" element={<WordGamePageCustom />} />
          <Route path="/user/game/quiz" element={<WordQuizPage />} />
          <Route path="/user/game/result" element={<ResultPage />} />
          <Route path="/user/game/acid-rain" element={<AcidRainPage />} />

          {/* 순위 */}
          <Route path="/user/ranking" element={<RankingPage/>} />

          {/* 순공시간 */}
          <Route path="/user/study" element={<StudyPage/>} />

          {/* 기본 라우트 */}
          <Route path="*" element={<MainBeforeLogin />} />

        </Routes>
      </Router>
    </WordSetProvider>
  );
}

export default App;