import React, { useState } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import WriteTab from "./WriteTab";

const initialFaqList = [
  {
    id: 1,
    title: "비밀번호 변경 방법은?",
    content: "프로필 설정에서 변경 가능합니다.",
    time: "2025년 11월 2일 09:40",
  },
  {
    id: 2,
    title: "회원탈퇴는 어떻게 하나요?",
    content: "마이페이지에서 탈퇴 요청이 가능합니다.",
    time: "2025년 11월 1일 11:15",
  },
];

const initialQnaList = [
  {
    id: 1,
    title: "첫번째 문의",
    content: "테스트 문의입니다.",
    userTime: "2025년 11월 3일 13:10",
    userUpdatedTime: "",
    answer: "안녕하세요! 문의 주셔서 감사합니다.",
    answerTime: "2025년 11월 3일 14:00",
    answerUpdatedTime: "",
  },
];

function FaqQnaTab() {
  const [activeSubTab, setActiveSubTab] = useState("faq");

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sort, setSort] = useState("new");

  const [replyText, setReplyText] = useState("");

  const [faqList] = useState(initialFaqList);
  const [qnaList, setQnaList] = useState(initialQnaList);

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

  const hasAdminReply = (item) => !!item.answer;

  const applySearchKeyword = () => {
    setSearchKeyword(searchInput);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") applySearchKeyword();
  };

  const filteredFaq = faqList.filter((item) => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.toLowerCase();
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
    );
  });

  const sortedFaq = [...filteredFaq].sort((a, b) =>
    sort === "new"
      ? parseDate(b.time) - parseDate(a.time)
      : parseDate(a.time) - parseDate(b.time)
  );

  const filteredQna = qnaList.filter((item) => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.toLowerCase();
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword) ||
      (item.answer && item.answer.toLowerCase().includes(keyword))
    );
  });

  const sortedQna = [...filteredQna].sort((a, b) =>
    sort === "new"
      ? parseDate(b.userTime) - parseDate(a.userTime)
      : parseDate(a.userTime) - parseDate(b.userTime)
  );

  const listToShow = activeSubTab === "faq" ? sortedFaq : sortedQna;

  const handleViewPost = (item) => {
    if (activeSubTab !== "qna") return;
    setSelectedPost(item);
    setReplyText(item.content);
    setIsEditing(false);
  };

  const handleAddQna = (newPost) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}년 ${String(
      now.getMonth() + 1
    ).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일 ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newItem = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      userTime: timeStr,
      userUpdatedTime: "",
      answer: "",
      answerTime: "",
      answerUpdatedTime: "",
    };

    setQnaList([newItem, ...qnaList]);
    setIsWriting(false);
  };

  const handleUserEditSubmit = () => {
    if (!replyText.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    const now = new Date();
    const updatedTime = `${now.getFullYear()}년 ${String(
      now.getMonth() + 1
    ).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일 ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated = qnaList.map((item) =>
      item.id === selectedPost.id
        ? { ...item, content: replyText, userUpdatedTime: updatedTime }
        : item
    );

    setQnaList(updated);
    setSelectedPost(updated.find((i) => i.id === selectedPost.id));
    setIsEditing(false);
    alert("문의가 수정되었습니다.");
  };

  const handleDelete = (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setQnaList(qnaList.filter((item) => item.id !== postId));
    setSelectedPost(null);
  };

  if (selectedPost) {
    return (
      <div className="tab-inner faq-tab">
        <div className="write-form">
          <h2>{selectedPost.title}</h2>
          <p style={{ color: "#777" }}>작성시간: {selectedPost.userTime}</p>
          {selectedPost.userUpdatedTime && (
            <p style={{ color: "#777" }}>수정됨: {selectedPost.userUpdatedTime}</p>
          )}

          <hr />

          {/* 사용자 문의 내용 */}
          <h3>문의 내용</h3>

          {!isEditing ? (
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
              {selectedPost.content}
            </p>
          ) : (
            <textarea
              className="answer-textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          )}

          {/* 관리자 답변 */}
          {selectedPost.answer && (
            <>
              <h3 style={{ marginTop: "20px" }}>관리자 답변</h3>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {selectedPost.answer}
              </p>
              <p style={{ color: "#777" }}>
                {selectedPost.answerUpdatedTime
                  ? `수정됨: ${selectedPost.answerUpdatedTime}`
                  : selectedPost.answerTime
                  ? `작성시간: ${selectedPost.answerTime}`
                  : ""}
              </p>
            </>
          )}

          {/* 버튼 영역 */}
          <div className="btn-right" style={{ marginTop: "20px" }}>
            {!isEditing ? (
              <>
                <button
                  className="common-btn"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </button>
                <button
                  className="common-btn"
                  onClick={() => handleDelete(selectedPost.id)}
                >
                  삭제
                </button>
              </>
            ) : (
              <button className="common-btn" onClick={handleUserEditSubmit}>
                저장
              </button>
            )}

            <button
              className="cancel-btn"
              onClick={() => {
                setSelectedPost(null);
                setIsEditing(false);
              }}
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isWriting) {
    return (
      <WriteTab
        onBack={() => setIsWriting(false)}
        onSubmit={handleAddQna}
      />
    );
  }

  return (
    <div className="tab-inner faq-tab">
      <h2>{activeSubTab === "faq" ? "자주 묻는 질문" : "1:1 문의"}</h2>

      {/* FAQ / QnA 전환 */}
      <div className="faq-tabs">
        <button
          className={activeSubTab === "faq" ? "active" : ""}
          onClick={() => setActiveSubTab("faq")}
        >
          FAQ
        </button>
        <button
          className={activeSubTab === "qna" ? "active" : ""}
          onClick={() => setActiveSubTab("qna")}
        >
          Q&A
        </button>
      </div>

      {/* 검색 */}
      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button className="search-btn" onClick={applySearchKeyword}>
          <Search size={18} />
        </button>
      </div>

      {/* 정렬 버튼 */}
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
          오래된 순
        </button>
      </div>

      {/* 목록 테이블 */}
      <table className="table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성시간</th>
            {activeSubTab === "qna" && <th>답변상태</th>}
          </tr>
        </thead>
        <tbody>
          {listToShow.map((item) => (
            <tr
              key={item.id}
              style={{
                cursor: activeSubTab === "qna" ? "pointer" : "default",
              }}
              onClick={() => handleViewPost(item)}
            >
              <td>{item.title}</td>
              <td>{activeSubTab === "faq" ? item.time : item.userTime}</td>
              {activeSubTab === "qna" && (
                <td
                  className={
                    hasAdminReply(item)
                      ? "status-complete"
                      : "status-pending"
                  }
                >
                  {hasAdminReply(item) ? "답변완료" : "미답변"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {activeSubTab === "qna" && (
        <div className="btn-right">
          <button
            className="common-btn"
            onClick={() => setIsWriting(true)}
          >
            글쓰기
          </button>
        </div>
      )}
    </div>
  );
}

export default FaqQnaTab;
