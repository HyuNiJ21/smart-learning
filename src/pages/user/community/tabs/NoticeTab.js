import React, { useState } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialNoticeList = [
  {
    id: 1,
    title: "업데이트 공지",
    time: "2025년 11월 3일 14:20",
    content: "업데이트가 완료되었습니다. 새로운 기능을 확인해 주세요!",
  },
  {
    id: 2,
    title: "점검 안내",
    time: "2025년 11월 2일 10:15",
    content: "내일 오전 10시부터 시스템 점검이 예정되어 있습니다.",
  },
];

function NoticeTab() {
  const [sort, setSort] = useState("new");

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [noticeList] = useState(initialNoticeList);

  const navigate = useNavigate();

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

  const applySearchKeyword = () => {
    setSearchKeyword(searchInput);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      applySearchKeyword();
    }
  };

  const filteredList = noticeList.filter((item) => {
    if (!searchKeyword.trim()) return true;

    const keyword = searchKeyword.toLowerCase();
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword)
    );
  });

  const sortedList = [...filteredList].sort((a, b) =>
    sort === "new"
      ? parseDate(b.time) - parseDate(a.time)
      : parseDate(a.time) - parseDate(b.time)
  );

  // 상세 페이지 이동
  const handleViewNotice = (item) => {
    navigate("/user/community/notice-detail", {
      state: { item, noticeList },
    });
  };

  return (
    <div className="tab-inner notice-tab">
      <h2>공지사항</h2>

      {/* 검색창 */}
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

      {/* 목록 */}
      <table className="table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleViewNotice(item)}
            >
              <td>{item.title}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeTab;
