import React, { useState } from "react";
import "../../../styles/community/Tabs.css";

// 관리자용 1:1 문의 초기 데이터 (대화 여러 번)
const initialAdminQnaList = [
  {
    id: 1,
    title: "로그인이 안됩니다",
    user: "user01",
    time: "2025년 11월 3일 13:10",
    messages: [
      {
        id: 1,
        sender: "user",
        text: "로그인이 자꾸 실패합니다.",
        time: "2025년 11월 3일 13:10",
      },
      {
        id: 2,
        sender: "admin",
        text: "안녕하세요! 사용 중인 브라우저를 알려주실 수 있을까요?",
        time: "2025년 11월 3일 13:40",
      },
    ],
  },
  {
    id: 2,
    title: "비밀번호 변경 문의",
    user: "user02",
    time: "2025년 11월 2일 10:20",
    messages: [
      {
        id: 1,
        sender: "user",
        text: "비밀번호 변경이 안돼요.",
        time: "2025년 11월 2일 10:20",
      },
      {
        id: 2,
        sender: "admin",
        text: "안녕하세요! 비밀번호 정책이 변경되었습니다. 새 비밀번호 조건을 확인해 주세요.",
        time: "2025년 11월 2일 11:00",
      },
      {
        id: 3,
        sender: "user",
        text: "조건에 맞게 입력해도 오류가 납니다.",
        time: "2025년 11월 2일 11:10",
      },
    ],
  },
];

function AdminQnaTab() {
  const [qnaList, setQnaList] = useState(initialAdminQnaList);
  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);
  const [sort, setSort] = useState("new"); // new | old

  const parseDate = (t) => {
    if (!t) return 0;
    const [year, month, day, hour, minute] = t
      .replace("년", "")
      .replace("월", "")
      .replace("일", "")
      .trim()
      .split(/[\s:]+/)
      .map(Number);
    return new Date(year, month - 1, day, hour, minute).getTime();
  };

  const hasAdminReply = (item) =>
    item.messages && item.messages.some((m) => m.sender === "admin");

  // 미답변 개수
  const unansweredCount = qnaList.filter((item) => !hasAdminReply(item)).length;

  // 필터링 + 정렬
  const filteredList = qnaList.filter((item) =>
    showUnansweredOnly ? !hasAdminReply(item) : true
  );

  const sortedList = [...filteredList]
    .sort((a, b) =>
      sort === "new"
        ? parseDate(b.time) - parseDate(a.time)
        : parseDate(a.time) - parseDate(b.time)
    )
    .map((item, idx, arr) => ({ ...item, no: arr.length - idx }));

  // 관리자 답변 전송 (여러 번 가능)
  const handleSendAnswer = () => {
    if (!selected) return;
    if (!answerText.trim()) {
      alert("답변을 입력하세요.");
      return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}년 ${String(
      now.getMonth() + 1
    ).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일 ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated = qnaList.map((item) => {
      if (item.id !== selected.id) return item;

      const nextId =
        item.messages.length > 0
          ? item.messages[item.messages.length - 1].id + 1
          : 1;

      const newMsg = {
        id: nextId,
        sender: "admin",
        text: answerText,
        time: timeStr,
      };

      return {
        ...item,
        messages: [...item.messages, newMsg],
      };
    });

    setQnaList(updated);

    // 상세 선택 중인 것도 갱신
    const updatedSelected = updated.find((i) => i.id === selected.id);
    setSelected(updatedSelected);
    setAnswerText("");
  };

  /* 목록 화면 */
  if (!selected) {
    return (
      <div className="tab-inner admin-qna-tab">
        <h2>1:1 문의 답변</h2>

        {/* 정렬 버튼 */}
        <div className="sort-row" style={{ marginBottom: "10px" }}>
          <button
            className={`sort-btn ${sort === "new" ? "active" : ""}`}
            onClick={() => setSort("new")}
          >
            최신순
          </button>
          <button
            className={`sort-btn ${sort === "old" ? "active" : ""}`}
            onClick={() => setSort("old")}
          >
            오래된 순
          </button>
        </div>

        {/* 통계 + 미답변 필터 */}
        <div className="qna-stats-box">
          <div className="qna-tag total">
            총 문의 개수 <span>{qnaList.length}</span>
          </div>
          <div className="qna-tag unanswered">
            미답변 <span>{unansweredCount}</span>
          </div>

          <button
            className="filter-btn"
            onClick={() => setShowUnansweredOnly((prev) => !prev)}
          >
            {showUnansweredOnly ? "전체 보기" : "미답변만 보기"}
          </button>
        </div>

        {/* 목록 테이블 */}
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((q) => (
              <tr
                key={q.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelected(q);
                  setAnswerText("");
                }}
              >
                <td>{q.no}</td>
                <td>{q.title}</td>
                <td>{q.user}</td>
                <td>{q.time}</td>
                <td
                  className={
                    hasAdminReply(q) ? "status-complete" : "status-pending"
                  }
                >
                  {hasAdminReply(q) ? "답변완료" : "미답변"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* 상세 화면 */
  return (
    <div className="tab-inner admin-qna-tab">
      <div className="write-form">
        <h3>
          [{selected.user}] {selected.title}
        </h3>
        <p style={{ color: "#777", marginTop: "4px" }}>
          최초 작성시간: {selected.time}
        </p>
        <hr style={{ margin: "16px 0" }} />

        {/* 대화 내역 */}
        <h3 style={{ marginBottom: "10px" }}>대화 내역</h3>
        {selected.messages.map((msg) => (
          <div className="answer-box" key={msg.id}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {msg.sender === "admin" ? "관리자" : "사용자"}
              </span>
              <span style={{ fontSize: "12px", color: "#777" }}>
                {msg.time}
              </span>
            </div>
            <p
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              {msg.text}
            </p>
          </div>
        ))}

        {/* 관리자 답변 입력 */}
        <h3 style={{ marginTop: "24px", marginBottom: "8px" }}>
          관리자 답변
        </h3>
        <textarea
          className="answer-textarea"
          placeholder="답변을 입력하세요."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />

        <div className="btn-right">
          <button className="common-btn" onClick={handleSendAnswer}>
            {hasAdminReply(selected) ? "추가 답변 보내기" : "답변 보내기"}
          </button>
          <button className="cancel-btn" onClick={() => setSelected(null)}>
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminQnaTab;
