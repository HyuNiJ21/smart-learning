import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";
import { sortedRanking } from "../../data/rankingData";

function pad(n) {
  return n.toString().padStart(2, "0");
}

function ymd(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = localDate.getUTCFullYear();
  const m = pad(localDate.getUTCMonth() + 1);
  const d = pad(localDate.getUTCDate());
  return `${y}년 ${m}월 ${d}일`;
}

function MainAfterLogin() {
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [todayStudy, setTodayStudy] = useState(0);
  const [weekStudy, setWeekStudy] = useState(0);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    const today = new Date();
    const todayKey = `todos:${ymd(today)}`;

    const stored = JSON.parse(localStorage.getItem(todayKey) || "[]");
    setTodayTodos(stored);

    setRanking(sortedRanking.slice(0, 5));

    const todayData = JSON.parse(localStorage.getItem("todayStudy") || "{}");
    const weekData = JSON.parse(localStorage.getItem("weekStudy") || "{}");

    setTodayStudy(todayData.time || 0);
    setWeekStudy(weekData.time || 0);
  }, []);

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        
        {/* 기존 카드 + 공부 통계 */}
        <div className="afterlogin-container">

          {/* 캘린더 */}
          <div className="card-group">
            <p className="card-title">캘린더</p>
            <div className="card">
              <h3>오늘의 할 일</h3>
              <p className="date">{ymd(new Date())}</p>
              {todayTodos.length === 0 ? (
                <ul>
                  <li>오늘의 일정이 없습니다.</li>
                </ul>
              ) : (
                <ul>
                  {todayTodos.slice(0, 3).map((t, i) => (
                    <li key={i}>{t.done ? <s>{t.title}</s> : t.title}</li>
                  ))}
                </ul>
              )}
              <Link to="/user/calendar" className="more-link">바로가기 →</Link>
            </div>
          </div>

          {/* 캐릭터 */}
          <div className="card-group">
            <p className="card-title">캐릭터</p>
            <div className="card">
              <div className="character-box">캐릭터 이미지</div>
              <p className="character-name">캐릭터 이름</p>
            </div>
          </div>

          {/* 랭킹 */}
          <div className="card-group">
            <p className="card-title">사용자 레벨 순위</p>
            <div className="card">
              <h3>주간 순위</h3>
              <p className="date">{ymd(new Date())}</p>
              {ranking.length === 0 ? (
                <ul><li>순위 데이터가 없습니다.</li></ul>
              ) : (
                <ol>
                  {ranking.map((user, index) => (
                    <li key={user.nickname + index}>
                      {index + 1}. {user.nickname} — Lv.{user.level}
                    </li>
                  ))}
                </ol>
              )}
              <Link to="/user/ranking" className="more-link">바로가기 →</Link>
            </div>
          </div>

          {/* 공부 통계 */}
          <div className="card study-stat-big">
            <p className="card-title">공부 통계</p>

            <div className="stats-inner-row">
              <div className="stats-small-card today-card">
                <h3>오늘의 공부시간</h3>
                <p className="stats-time">{formatTime(todayStudy)}</p>
              </div>

              <div className="stats-small-card week-card">
                <h3>이번 주 공부시간</h3>
                <p className="stats-time">{formatTime(weekStudy)}</p>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}

export default MainAfterLogin;
