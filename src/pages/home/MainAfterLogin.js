import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { sortedRanking } from "../../data/rankingData";  

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

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


function dateKey(date) {
  return date.toISOString().split("T")[0];
}

function MainAfterLogin() {
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [subjectTimes, setSubjectTimes] = useState({});
  const [dailyStudy, setDailyStudy] = useState({});
  const [userChar, setUserChar] = useState(null);

  useEffect(() => {
    const todoKey = `todos:${ymd(new Date())}`;
    const storedTodos = JSON.parse(localStorage.getItem(todoKey) || "[]");
    setTodayTodos(storedTodos);

    if (sortedRanking?.length > 0) {
      setRanking(sortedRanking.slice(0, 5));
    }

    const subj = JSON.parse(localStorage.getItem("subjectTimes") || "{}");
    setSubjectTimes(subj);

    const daily = JSON.parse(localStorage.getItem("dailyStudy") || "{}");
    setDailyStudy(daily);

    const savedChar = JSON.parse(
      localStorage.getItem("selectedCharacter") || "null"
    );
    setUserChar(savedChar);
  }, []);

  const subjectEntries = Object.entries(subjectTimes); 

  const sortedSubjects = subjectEntries
    .map(([subj, seconds]) => ({
      subj,
      hours: Number((seconds / 3600).toFixed(2)),
    }))
    .sort((a, b) => b.hours - a.hours) 
    .slice(0, 7);

  const subjectLabels = sortedSubjects.map((x) => x.subj);
  const subjectHours = sortedSubjects.map((x) => x.hours);

  let last7 = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const key = dateKey(date);

    last7.push({
      date: key.substring(5), 
      hours: Number(((dailyStudy[key] || 0) / 3600).toFixed(2)),
    });
  }

  const last7Labels = last7.map((x) => x.date);
  const last7Hours = last7.map((x) => x.hours);

  function getHourStep(maxHour) {
    if (maxHour <= 3) return 1;
    if (maxHour <= 10) return 2;
    if (maxHour <= 20) return 5;
    return 10;
  }

  const subjectStep = getHourStep(Math.max(...subjectHours, 0));
  const dailyStep = getHourStep(Math.max(...last7Hours, 0));

  const baseLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.3, borderWidth: 3 },
      point: { radius: 5, hoverRadius: 7 },
    },
    plugins: { legend: { display: false } },
  };

  const subjectLineOptions = {
    ...baseLineOptions,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...subjectHours, 0) + subjectStep,
        ticks: { stepSize: subjectStep, callback: (v) => `${v}h` },
      },
    },
  };

  const dailyLineOptions = {
    ...baseLineOptions,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...last7Hours, 0) + dailyStep,
        ticks: { stepSize: dailyStep, callback: (v) => `${v}h` },
      },
    },
  };


  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="afterlogin-container">

          <div className="card-group">
            <p className="card-title">캘린더</p>
            <div className="uniform-card">
              <h3>
                오늘의 할 일{" "}
                <span className="todo-count">({todayTodos.length})</span>
              </h3>
              <p className="date">{ymd(new Date())}</p>

              <ul className="todo-ul">
                {todayTodos.length === 0 ? (
                  <li>오늘의 일정이 없습니다.</li>
                ) : (
                  todayTodos.slice(0, 3).map((t, i) => (
                    <li key={i}>{t.done ? <s>{t.title}</s> : t.title}</li>
                  ))
                )}
              </ul>

              <div className="card-bottom">
                <Link to="/user/calendar" className="more-link">
                  바로가기 →
                </Link>
              </div>
            </div>
          </div>

          <div className="card-group">
            <p className="card-title">캐릭터</p>
            <div className="uniform-card char-section">
              <div className="character-image-box">
                {userChar?.image ? (
                  <img src={userChar.image} alt="캐릭터 이미지" className="character-img-home" />
                ) : (
                  <p className="no-img-text">캐릭터 없음</p>
                )}
              </div>
              <p className="char-name">{userChar?.name || "미선택"}</p>
              <p className="char-level">
                {userChar?.level ? `Lv.${userChar.level}` : ""}
              </p>

              <div className="card-bottom">
                <Link to="/user/character" className="more-link">
                  바로가기 →
                </Link>
              </div>
            </div>
          </div>

          <div className="card-group">
            <p className="card-title">사용자 레벨 순위</p>
            <div className="uniform-card">
              <h3>주간 순위</h3>
              <p className="date">{ymd(new Date())}</p>

              <ol>
                {ranking.map((user, i) => (
                  <li key={i}>
                   {user.nickname} — Lv.{user.level}
                  </li>
                ))}
              </ol>

              <div className="card-bottom">
                <Link to="/user/ranking" className="more-link">
                  바로가기 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="study-stat-big">
          <p className="card-title" style={{ marginLeft: "6px" }}>
            공부 통계
          </p>

          <div className="stats-inner-row">

            <div className="stats-small-card today-card">
              <h3 className="graph-title">오늘 과목별 공부시간</h3>

              <div className="chart-container">
                <Line
                  data={{
                    labels: subjectLabels,
                    datasets: [
                      {
                        data: subjectHours,
                        borderColor: "#FFD400",
                        backgroundColor: "rgba(255,212,0,0.3)",
                        pointBackgroundColor: "#FFD400",
                      },
                    ],
                  }}
                  options={subjectLineOptions}
                />
              </div>
            </div>

            <div className="stats-small-card week-card">
              <h3 className="graph-title">최근 7일 공부시간</h3>

              <div className="chart-container">
                <Line
                  data={{
                    labels: last7Labels,
                    datasets: [
                      {
                        data: last7Hours,
                        borderColor: "#4DA3FF",
                        backgroundColor: "rgba(77,163,255,0.3)",
                        pointBackgroundColor: "#4DA3FF",
                      },
                    ],
                  }}
                  options={dailyLineOptions}
                />
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
