// StudyPage.js

import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/study/StudyPage.css";

function StudyPage() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const [todayStudy, setTodayStudy] = useState(0);
  const [weekStudy, setWeekStudy] = useState(0);

  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [currentSubject, setCurrentSubject] = useState("");
  const [subjectTimes, setSubjectTimes] = useState({});

  const [showModal, setShowModal] = useState(false);

  const timerRef = useRef(null);

  const getTodayKey = () => new Date().toISOString().split("T")[0];
  const getWeekKey = () => {
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    return monday.toISOString().split("T")[0];
  };

  const handleSubjectChange = (name) => {
    setCurrentSubject(name);
    setTime(0);
    setRunning(false);
  };

  /* ---------------------- 초기 로드 ---------------------- */
  useEffect(() => {
    const weekKey = getWeekKey();
    const todayKey = getTodayKey();

    const storedWeek = JSON.parse(localStorage.getItem("weekStudy") || "{}");
    const storedToday = JSON.parse(localStorage.getItem("todayStudy") || "{}");

    if (storedWeek.date !== weekKey) {
      localStorage.setItem("weekStudy", JSON.stringify({ date: weekKey, time: 0 }));
      setWeekStudy(0);
    } else setWeekStudy(storedWeek.time || 0);

    if (storedToday.date !== todayKey) {
      localStorage.setItem("todayStudy", JSON.stringify({ date: todayKey, time: 0 }));
      setTodayStudy(0);
    } else setTodayStudy(storedToday.time || 0);

    setSubjects(JSON.parse(localStorage.getItem("subjects") || "[]"));
    setSubjectTimes(JSON.parse(localStorage.getItem("subjectTimes") || "{}"));
  }, []);

  /* ---------------------- 타이머 실행 ---------------------- */
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime((t) => t + 10), 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  /* ---------------- 1초마다 공부 시간 기록 ---------------- */
  useEffect(() => {
    if (!running || time === 0) return;

    const todayKey = getTodayKey();
    const weekKey = getWeekKey();

    // 1초마다 저장
    if (time % 1000 === 0) {
      setTodayStudy((prev) => {
        const updated = prev + 1;
        localStorage.setItem("todayStudy", JSON.stringify({ date: todayKey, time: updated }));
        return updated;
      });

      setWeekStudy((prev) => {
        const updated = prev + 1;
        localStorage.setItem("weekStudy", JSON.stringify({ date: weekKey, time: updated }));
        return updated;
      });

      if (currentSubject) {
        setSubjectTimes((prev) => {
          const updated = {
            ...prev,
            [currentSubject]: (prev[currentSubject] || 0) + 1,
          };
          localStorage.setItem("subjectTimes", JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [time, running, currentSubject]);

  /* ---------------- 과목 추가 ---------------- */
  const addSubject = () => {
    if (!subjectInput.trim()) return;

    const name = subjectInput.trim();

    if (subjects.includes(name)) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }

    const updatedSubjects = [...subjects, name];
    setSubjects(updatedSubjects);
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    // 🔥 새 과목을 subjectTimes에도 0으로 초기화
    const updatedTimes = {
      ...subjectTimes,
      [name]: subjectTimes[name] || 0,
    };

    setSubjectTimes(updatedTimes);
    localStorage.setItem("subjectTimes", JSON.stringify(updatedTimes));

    setSubjectInput("");
  };

  /* ---------------- 과목 삭제 ---------------- */
  const deleteSubject = (name) => {
    const updatedSubjects = subjects.filter((s) => s !== name);

    // subjectTimes에서도 삭제
    const updatedTimes = { ...subjectTimes };
    delete updatedTimes[name];

    setSubjects(updatedSubjects);
    setSubjectTimes(updatedTimes);

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
    localStorage.setItem("subjectTimes", JSON.stringify(updatedTimes));

    if (currentSubject === name) setCurrentSubject("");
  };

  /* ---------------- 시간 형식 ---------------- */
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatTimer = (t) => {
    const s = String(Math.floor((t / 1000) % 60)).padStart(2, "0");
    const m = String(Math.floor((t / 60000) % 60)).padStart(2, "0");
    const h = String(Math.floor(t / 3600000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const progress = (time % 3600000) / 3600000 * 360;

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="study-container">

          {/* ---------------- 카테고리 박스 ---------------- */}
          <div className="subject-box">
            <div className="subject-title">카테고리 관리</div>

            <div className="subject-add-row">
              <input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="카테고리 입력"
              />
              <button onClick={addSubject}>추가</button>
            </div>

            <div className="subject-list">
              {subjects.map((s, idx) => (
                <div
                  key={idx}
                  className={`subject-item ${currentSubject === s ? "active" : ""}`}
                  onClick={() => handleSubjectChange(s)}
                >
                  <span>{s}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubject(s);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- 스톱워치 ---------------- */}
          <div className="timer-box">
            <div
              className="timer-circle"
              style={{
                background: `conic-gradient(#FFD400 ${progress}deg, #fff 0deg)`
              }}
            >
              <div className="timer-inner">
                <div className="timer-text">{formatTimer(time)}</div>
              </div>
            </div>

            <div className="current-subject">
              현재 선택된 카테고리: <b>{currentSubject || "없음"}</b>
            </div>

            <div className="timer-btns">
              <button
                className="timer-btn"
                onClick={() => {
                  if (!currentSubject && !running) {
                    setShowModal(true);
                    return;
                  }
                  setRunning(!running);
                }}
              >
                {running ? "STOP" : "START"}
              </button>
            </div>
          </div>

          {/* ---------------- 기록 ---------------- */}
          <div className="record-box">
            <div className="record-title">공부 기록</div>

            <div className="record-item">
              <span>이번 주 공부 시간</span>
              <span>{formatTime(weekStudy)}</span>
            </div>

            <div className="record-item">
              <span>오늘 공부 시간</span>
              <span>{formatTime(todayStudy)}</span>
            </div>

            <div className="record-title">카테고리별 누적 시간</div>

            <div className="subject-time-list">
              {subjects.map((s, i) => (
                <div key={i} className="record-item">
                  <span>{s}</span>
                  <span>{formatTime(subjectTimes[s] || 0)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- 모달 ---------------- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">카테고리 선택 필요</div>
            <div className="modal-text">먼저 공부할 카테고리를 선택해주세요.</div>
            <button className="modal-btn" onClick={() => setShowModal(false)}>확인</button>
          </div>
        </div>
      )}
    </>
  );
}

export default StudyPage;
