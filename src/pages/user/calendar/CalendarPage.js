import React, { useMemo, useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import writeIcon from "../../../assets/writebutton.png";
import rewriteIcon from "../../../assets/rewritebutton.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/calendar/Calendar.css";

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

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarPage() {
  const [current, setCurrent] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selected, setSelected] = useState(() => new Date());
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [todoTitle, setTodoTitle] = useState("");
  const [todoMemo, setTodoMemo] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");

  const keyTodo = `todos:${ymd(selected)}`;
  const keyDiary = `diary:${ymd(selected)}`;

  const [todos, setTodos] = useState([]);
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem(keyTodo) || "[]");
    const valid = (Array.isArray(t) ? t : []).filter((item) => item?.title);
    setTodos(valid);

    const d = JSON.parse(localStorage.getItem(keyDiary) || "null");
    setDiary(d);
  }, [keyTodo, keyDiary]);

  const grid = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    return Array.from({ length: 42 }, (_, i) => {
      return new Date(y, m, 1 - new Date(y, m, 1).getDay() + i);
    });
  }, [current]);

  const monthLabel = `${current.getFullYear()}년 ${current.getMonth() + 1}월`;

  const dateLabel = (() => {
    const m = selected.getMonth() + 1;
    const d = selected.getDate();
    const ko = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
    return `${m}월 ${d}일 ${ko[selected.getDay()]}`;
  })();

  const prevMonth = () =>
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  /* ---------------- To-Do ---------------- */
  const saveTodo = () => {
    if (!todoTitle.trim()) return;

    const newItem = { title: todoTitle, memo: todoMemo, done: false };

    const updated =
      editIndex !== null
        ? todos.map((t, i) => (i === editIndex ? newItem : t))
        : [...todos, newItem];

    setTodos(updated);
    localStorage.setItem(keyTodo, JSON.stringify(updated));

    setTodoTitle("");
    setTodoMemo("");
    setEditIndex(null);
    setShowTodoModal(false);
  };

  const openEditTodo = (i) => {
    setEditIndex(i);
    setTodoTitle(todos[i].title);
    setTodoMemo(todos[i].memo);
    setShowTodoModal(true);
  };

  const deleteTodo = (i) => {
    const updated = todos.filter((_, idx) => idx !== i);
    setTodos(updated);
    localStorage.setItem(keyTodo, JSON.stringify(updated));
  };

  const toggleTodoDone = (i) => {
    const updated = todos.map((t, idx) =>
      idx === i ? { ...t, done: !t.done } : t
    );
    setTodos(updated);
    localStorage.setItem(keyTodo, JSON.stringify(updated));
  };

  /* ---------------- Diary ---------------- */
  const saveDiary = () => {
    if (!diaryTitle.trim() && !diaryContent.trim()) return;

    const entry = { title: diaryTitle, content: diaryContent };
    setDiary(entry);
    localStorage.setItem(keyDiary, JSON.stringify(entry));

    setDiaryTitle("");
    setDiaryContent("");
    setShowDiaryModal(false);
  };

  const clearDiary = () => {
    setDiary(null);
    localStorage.removeItem(keyDiary);
  };

  const openEditDiary = () => {
    if (diary) {
      setDiaryTitle(diary.title || "");
      setDiaryContent(diary.content || "");
    }
    setShowDiaryModal(true);
  };

  /* 날짜 비교 */
  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="calendar-page">
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="calendar-layout">
          
          {/* --------------- 달력 --------------- */}
          <div className="calendar-card">
            <div className="calendar-head">
              <button className="nav-btn" onClick={prevMonth}>‹</button>
              <div className="month-label">{monthLabel}</div>
              <button className="nav-btn" onClick={nextMonth}>›</button>
            </div>

            <div className="weekday-row">
              {weekDays.map((w) => (
                <div key={w} className="weekday">{w}</div>
              ))}
            </div>

            <div className="grid">
              {grid.map((d, i) => {
                const inMonth = d.getMonth() === current.getMonth();
                const isSel = isSameDate(d, selected);

                const todoKey = `todos:${ymd(d)}`;
                const diaryKey = `diary:${ymd(d)}`;

                const dayTodos = JSON.parse(localStorage.getItem(todoKey) || "[]");
                const todoCount = Array.isArray(dayTodos)
                  ? dayTodos.filter((x) => x?.title).length
                  : 0;

                const dayDiary = JSON.parse(localStorage.getItem(diaryKey) || "null");

                return (
                  <div
                    key={i}
                    className={`cell ${inMonth ? "" : "dim"} ${isSel ? "selected" : ""}`}
                    onClick={() => setSelected(d)}
                  >
                    {/* 날짜 왼쪽 정렬 */}
                    <span className="day day-left">{d.getDate()}</span>

                    {/* 일정 개수(형광펜 라인) */}
                    {todoCount > 0 && (
                      <span className="todo-underline">{todoCount}</span>
                    )}

                    {/* 일기 점(오른쪽 상단) */}
                    {dayDiary && <span className="diary-dot"></span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --------------- 오른쪽 사이드 패널 --------------- */}
          <div className="side-panel">

            {/* ---- To-Do ---- */}
            <div className="panel-card">
              <div className="panel-head">
                <h3>To-Do List</h3>
                <img
                  src={writeIcon}
                  alt="추가"
                  className="icon-img large"
                  onClick={() => setShowTodoModal(true)}
                />
              </div>

              <div className="date-chip">{dateLabel}</div>

              <ul className="todo-list scrollable-list">
                {todos.length === 0 ? (
                  <li className="muted">(등록된 체크리스트가 없습니다)</li>
                ) : (
                  todos.map((t, i) => (
                    <li
                      key={i}
                      className="todo-item"
                      onClick={() => openEditTodo(i)}
                    >
                      <div className="todo-left">
                        {t.checklist && (
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggleTodoDone(i)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        <div>
                          <div className={`todo-title ${t.done ? "done" : ""}`}>
                            {t.title}
                          </div>

                          {t.memo && (
                            <div className="todo-memo">{t.memo}</div>
                          )}
                        </div>
                      </div>

                      <img
                        src={deleteIcon}
                        alt="삭제"
                        className="icon-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTodo(i);
                        }}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* ---- Diary ---- */}
            <div className="panel-card diary-section">
              <div className="panel-head">
                <h3>한 줄 일기</h3>
                <div className="head-actions spaced">
                  {!diary ? (
                    <img
                      src={writeIcon}
                      alt="작성"
                      className="icon-img large"
                      onClick={() => setShowDiaryModal(true)}
                    />
                  ) : (
                    <>
                      <img
                        src={rewriteIcon}
                        alt="수정"
                        className="icon-img large"
                        onClick={openEditDiary}
                      />
                      <img
                        src={deleteIcon}
                        alt="삭제"
                        className="icon-delete"
                        onClick={clearDiary}
                      />
                    </>
                  )}
                </div>
              </div>

              {diary ? (
                <div className="diary-box diary-scroll">
                  {diary.title && <div className="diary-title">{diary.title}</div>}
                  <div className="diary-content">{diary.content}</div>
                </div>
              ) : (
                <div className="empty-text">내용이 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* ---- To-Do Modal ---- */}
        {showTodoModal && (
          <div className="modal-backdrop" onClick={() => setShowTodoModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">
                {editIndex !== null ? "체크리스트 수정" : "체크리스트 추가"}
              </div>

              <div className="modal-body">
                <label className="field">
                  <span>항목 이름</span>
                  <input
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>메모</span>
                  <textarea
                    rows={4}
                    value={todoMemo}
                    onChange={(e) => setTodoMemo(e.target.value)}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button className="btn secondary" onClick={() => setShowTodoModal(false)}>
                  취소
                </button>
                <button className="btn primary" onClick={saveTodo}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- Diary Modal ---- */}
        {showDiaryModal && (
          <div className="modal-backdrop" onClick={() => setShowDiaryModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">한 줄 일기</div>

              <div className="modal-body">
                <label className="field">
                  <span>제목</span>
                  <input
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>내용</span>
                  <textarea
                    rows={6}
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button className="btn secondary" onClick={() => setShowDiaryModal(false)}>
                  취소
                </button>
                <button className="btn primary" onClick={saveDiary}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
