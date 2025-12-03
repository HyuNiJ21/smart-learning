import React, { useState } from "react";
import "../../../styles/community/Tabs.css";
import WriteTab from "./AdminWriteTab";

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
    content: "마이페이지에서 가능합니다.",
    time: "2025년 11월 1일 11:15",
  },
];

function AdminFaqTab() {
  const [sort, setSort] = useState("new");
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [editPost, setEditPost] = useState(null);

  // 원본 / 표시 리스트 분리
  const [faqList, setFaqList] = useState(initialFaqList);
  const [displayFaqList, setDisplayFaqList] = useState(initialFaqList);

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

  // 검색
  const handleSearch = () => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      setDisplayFaqList(faqList);
      return;
    }

    const filtered = faqList.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        (item.content && item.content.toLowerCase().includes(keyword))
    );
    setDisplayFaqList(filtered);
  };

  // 정렬
  const sortedFaq = [...displayFaqList]
    .sort((a, b) =>
      sort === "new"
        ? parseDate(b.time) - parseDate(a.time)
        : parseDate(a.time) - parseDate(b.time)
    )
    .map((item, idx, arr) => ({ ...item, no: arr.length - idx }));

  // 삭제
  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const updated = faqList.filter((i) => i.id !== id);
    setFaqList(updated);
    setDisplayFaqList(updated);
  };

  // 글쓰기/수정 모드
  if (isWriting || editPost) {
    return (
      <WriteTab
        editPost={editPost}
        onBack={() => {
          setIsWriting(false);
          setEditPost(null);
        }}
        onSubmit={(newPost) => {
          let updated;
          if (editPost) {
            updated = faqList.map((i) =>
              i.id === newPost.id ? newPost : i
            );
          } else {
            updated = [{ id: Date.now(), ...newPost }, ...faqList];
          }
          setFaqList(updated);
          setDisplayFaqList(updated);
          setIsWriting(false);
          setEditPost(null);
        }}
      />
    );
  }

  return (
    <div className="admin-community-tab">
      <h2>FAQ 관리</h2>

      {/* 검색 */}
      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          검색
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

      {/* 목록 */}
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {sortedFaq.map((item) => (
            <tr key={item.id}>
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>{item.time}</td>
              <td className="action-cell">
                <button
                  className="action-btn edit-btn"
                  onClick={() => setEditPost(item)}
                >
                  수정
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="btn-right">
        <button className="common-btn" onClick={() => setIsWriting(true)}>
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default AdminFaqTab;
