import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import WriteTab from "./WriteTab";

// FAQ 초기 데이터
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

// 1:1 문의 초기 데이터 (대화 여러 번 가능)
const initialQnaList = [
  {
    id: 1,
    title: "첫번째 문의",
    time: "2025년 11월 3일 13:10",
    messages: [
      {
        id: 1,
        sender: "user",
        text: "테스트입니다.",
        time: "2025년 11월 3일 13:10",
      },
      {
        id: 2,
        sender: "admin",
        text: "안녕하세요! 문의 주셔서 감사합니다.",
        time: "2025년 11월 3일 14:00",
      },
    ],
  },
];

function FaqQnaTab() {
  const [activeSubTab, setActiveSubTab] = useState("faq"); // faq | qna
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [sort, setSort] = useState("new"); // new | old

  // 사용자 추가 문의 입력값
  const [replyText, setReplyText] = useState("");

  // 실제 데이터(원본)
  const [faqList] = useState(initialFaqList);
  const [qnaList, setQnaList] = useState(initialQnaList);

  // 날짜 파싱
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

  const handleSearchClick = () => {
    // 필터는 상태(search) 기반으로 항상 적용되기 때문에
    // 이 함수는 "버튼을 눌러 검색한다"는 UX용으로만 존재
    // 굳이 로직을 넣을 필요는 없음
  };

  // 문의 추가
  const handleAddQna = (newPost) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}년 ${String(
      now.getMonth() + 1
    ).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일 ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const firstMessage = {
      id: 1,
      sender: "user",
      text: newPost.content,
      time: timeStr,
    };

    const newItem = {
      id: Date.now(),
      title: newPost.title,
      time: timeStr,
      messages: [firstMessage],
    };

    const updated = [newItem, ...qnaList];
    setQnaList(updated);
    setIsWriting(false);
  };

  // 사용자 추가 문의 등록
  const handleUserReplySubmit = () => {
    if (!selectedPost) return;
    if (!replyText.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    const now = new Date();
    const replyTime = `${now.getFullYear()}년 ${String(
      now.getMonth() + 1
    ).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일 ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updatedQna = qnaList.map((item) => {
      if (item.id !== selectedPost.id) return item;

      const nextId =
        item.messages.length > 0
          ? item.messages[item.messages.length - 1].id + 1
          : 1;

      const newMsg = {
        id: nextId,
        sender: "user",
        text: replyText,
        time: replyTime,
      };

      return {
        ...item,
        messages: [...item.messages, newMsg],
      };
    });

    setQnaList(updatedQna);

    // 상세 보기 중인 글도 최신 상태로 반영
    const updatedSelected = updatedQna.find(
      (item) => item.id === selectedPost.id
    );
    setSelectedPost(updatedSelected);
    setReplyText("");

    alert("추가 문의가 등록되었습니다.");
  };

  // 선택된 글이 바뀌면 입력창 초기화
  useEffect(() => {
    if (selectedPost) {
      setReplyText("");
    }
  }, [selectedPost]);

  // 글 삭제
  const handleDelete = (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const updated = qnaList.filter((item) => item.id !== postId);
    setQnaList(updated);
    setSelectedPost(null);
  };

  // 글 상세 보기
  const handleViewPost = (item) => {
    setSelectedPost(item);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setIsWriting(false);
  };

  // 검색 + 정렬 적용 (FAQ)
  const keyword = search.trim().toLowerCase();

  const filteredFaq = !keyword
    ? faqList
    : faqList.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          (item.content &&
            item.content.toLowerCase().includes(keyword))
      );

  const sortedFaq = [...filteredFaq]
    .sort((a, b) =>
      sort === "new"
        ? parseDate(b.time) - parseDate(a.time)
        : parseDate(a.time) - parseDate(b.time)
    )
    .map((item, idx, arr) => ({ ...item, no: arr.length - idx }));

  // 검색 + 정렬 적용 (QnA)
  const filteredQna = !keyword
    ? qnaList
    : qnaList.filter((item) => {
        const inTitle = item.title.toLowerCase().includes(keyword);
        const inMessages =
          item.messages &&
          item.messages.some((m) =>
            m.text.toLowerCase().includes(keyword)
          );
        return inTitle || inMessages;
      });

  const sortedQna = [...filteredQna]
    .sort((a, b) =>
      sort === "new"
        ? parseDate(b.time) - parseDate(a.time)
        : parseDate(a.time) - parseDate(b.time)
    )
    .map((item, idx, arr) => ({ ...item, no: arr.length - idx }));

  const listToShow = activeSubTab === "faq" ? sortedFaq : sortedQna;

  /* 상세 화면 (1:1 문의 상세) */
  if (selectedPost) {
    return (
      <div className="tab-inner faq-tab">
        <div className="write-form">
          <h2>{selectedPost.title}</h2>
          <p style={{ color: "#777", marginTop: "4px" }}>
            최초 작성시간: {selectedPost.time}
          </p>
          <hr style={{ margin: "16px 0" }} />

          {/* 대화 내역  */}
          <h3 style={{ marginBottom: "10px" }}>대화 내역</h3>
          {selectedPost.messages.map((msg) => (
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

          {/* 사용자 추가 문의 입력 영역 */}
          <h3 style={{ marginTop: "24px", marginBottom: "8px" }}>
            추가 문의
          </h3>
          <textarea
            className="answer-textarea"
            placeholder="관리자에게 추가 문의를 남길 수 있어요."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />

          <div className="btn-right">
            <button className="common-btn" onClick={handleUserReplySubmit}>
              추가 문의 보내기
            </button>
          </div>
        </div>

        <div className="btn-right">
          <button
            className="common-btn"
            onClick={() => handleDelete(selectedPost.id)}
          >
            삭제
          </button>
          <button className="cancel-btn" onClick={handleBackToList}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  /* 글쓰기 모드 */
  if (isWriting) {
    return <WriteTab onBack={handleBackToList} onSubmit={handleAddQna} />;
  }

  /* 목록 화면 */
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearchClick}>
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
            <th>No</th>
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
              onClick={() =>
                activeSubTab === "qna" ? handleViewPost(item) : null
              }
            >
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>{item.time}</td>
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
          <button className="common-btn" onClick={() => setIsWriting(true)}>
            글쓰기
          </button>
        </div>
      )}
    </div>
  );
}

export default FaqQnaTab;
