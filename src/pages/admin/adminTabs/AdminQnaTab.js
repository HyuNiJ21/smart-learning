import React, { useState, useMemo } from "react";
import "../../../styles/community/Tabs.css";
import { Search } from "lucide-react";

const initialAdminQnaList = [
  {
    id: 1,
    title: "로그인이 안됩니다",
    user: "user01",
    time: "2025년 11월 3일 13:10",
    content: "로그인이 자꾸 실패합니다.",
    answer: "",
    answerTime: "",
    answerUpdatedTime: "",
  },
  {
    id: 2,
    title: "비밀번호 변경 문의",
    user: "user02",
    time: "2025년 11월 2일 10:20",
    content: "비밀번호 변경이 안돼요.",
    answer: "안녕하세요! 비밀번호 정책이 변경되었습니다.",
    answerTime: "2025년 11월 2일 11:00",
    answerUpdatedTime: "",
  },
];

function AdminQnaTab() {
  const [qnaList, setQnaList] = useState(initialAdminQnaList);

  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const parseDate = (t) => {
    if (!t) return 0;
    const [y, mo, d, h, mi] = t
      .replace("년", "")
      .replace("월", "")
      .replace("일", "")
      .trim()
      .split(/[\s:]+/)
      .map(Number);
    return new Date(y, mo - 1, d, h, mi).getTime();
  };

  const hasAdminReply = (item) => !!item.answer && item.answer.trim() !== "";

  const unansweredCount = qnaList.filter((item) => !hasAdminReply(item)).length;

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchKeyword(searchInput);
  };

  // 검색 + 필터 + 정렬
  const processedList = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    let list = qnaList.filter((item) => {
      if (!keyword) return true;

      const inTitle = item.title.toLowerCase().includes(keyword);
      const inUser = item.user.toLowerCase().includes(keyword);
      const inContent = item.content.toLowerCase().includes(keyword);
      const inAnswer = item.answer.toLowerCase().includes(keyword);

      return inTitle || inUser || inContent || inAnswer;
    });

    if (filter === "unanswered") {
      list = list.filter((item) => !hasAdminReply(item));
    }

    list = list.slice().sort((a, b) =>
      sort === "new"
        ? parseDate(b.time) - parseDate(a.time)
        : parseDate(a.time) - parseDate(b.time)
    );

    return list;
  }, [qnaList, searchKeyword, filter, sort]);

  // 문의 선택
  const handleSelectRow = (item) => {
    setSelected(item);
    setAnswerText(item.answer || "");
  };

  // 답변 저장/수정
  const handleSaveAnswer = () => {
    if (!answerText.trim()) {
      alert("답변을 입력하세요.");
      return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}년 ${
      String(now.getMonth() + 1).padStart(2, "0")
    }월 ${String(now.getDate()).padStart(2, "0")}일 ${
      String(now.getHours()).padStart(2, "0")
    }:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated = qnaList.map((item) => {
      if (item.id !== selected.id) return item;

      if (!item.answer || item.answer.trim() === "") {
        return {
          ...item,
          answer: answerText,
          answerTime: timeStr,
          answerUpdatedTime: "",
        };
      } else {
        // 수정
        return {
          ...item,
          answer: answerText,
          answerUpdatedTime: timeStr,
        };
      }
    });

    setQnaList(updated);
    setSelected(updated.find((i) => i.id === selected.id));

    alert("저장되었습니다.");
  };

  const handleBackToList = () => {
    setSelected(null);
    setAnswerText("");
  };

  if (!selected) {
    return (
      <div className="tab-inner admin-qna-tab">
        <h2>1:1 문의 답변</h2>

        {/* 검색 */}
        <div className="search-box">
          <input
            type="text"
            placeholder="검색하세요."
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          />
          <button className="search-btn" onClick={handleSearchClick}>
            <Search size={18} />
          </button>
        </div>

        {/* 정렬 */}
        <div className="sort-row">
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
            오래된순
          </button>
        </div>

        {/* 총 문의 / 미답변 */}
        <div className="qna-stats-box">
          <div
            className="qna-tag total"
            onClick={() => setFilter("all")}
            style={{ cursor: "pointer" }}
          >
            총 문의 <span>{qnaList.length}</span>
          </div>

          <div
            className="qna-tag unanswered"
            onClick={() => setFilter("unanswered")}
            style={{ cursor: "pointer" }}
          >
            미답변 <span>{unansweredCount}</span>
          </div>
        </div>

        {/* 목록 */}
        <table className="table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
              <th>답변상태</th>
            </tr>
          </thead>

          <tbody>
            {processedList.map((q) => (
              <tr
                key={q.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectRow(q)}
              >
                <td>{q.title}</td>
                <td>{q.user}</td>
                <td>{q.time}</td>
                <td
                  className={
                    hasAdminReply(q)
                      ? "status-complete"
                      : "status-pending"
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

  const answerTimeLabel = selected.answerUpdatedTime
    ? `수정됨: ${selected.answerUpdatedTime}`
    : selected.answerTime
    ? `작성시간: ${selected.answerTime}`
    : "";

  return (
    <div className="tab-inner admin-qna-tab">
      <div className="write-form">
        {/* 제목 */}
        <h3>
          [{selected.user}] {selected.title}
        </h3>

        <p style={{ color: "#777", marginTop: "4px" }}>
          최초 작성시간: {selected.time}
        </p>

        <hr style={{ margin: "16px 0" }} />

        {/* 문의 내용 */}
        <h3 style={{ marginBottom: "8px" }}>문의 내용</h3>
        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
            marginBottom: "20px",
          }}
        >
          {selected.content}
        </div>

        {/* 관리자 답변 */}
        <h3 style={{ marginBottom: "8px" }}>관리자 답변</h3>
        {answerTimeLabel && (
          <p style={{ color: "#777", fontSize: "13px", marginBottom: "6px" }}>
            {answerTimeLabel}
          </p>
        )}

        <textarea
          className="answer-textarea"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="답변을 입력하세요."
        />

        <div className="btn-right" style={{ marginTop: "10px" }}>
          {!selected.answer || selected.answer.trim() === "" ? (
            <button className="common-btn" onClick={handleSaveAnswer}>
              답변
            </button>
          ) : (
            <button className="common-btn" onClick={handleSaveAnswer}>
              수정
            </button>
          )}

          <button className="cancel-btn" onClick={handleBackToList}>
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminQnaTab;
