import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NoticeTab() {
  const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([
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
  ]);

  const [originalNoticeList, setOriginalNoticeList] = useState([]);
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

  // 원본 데이터 저장
  useEffect(() => {
  if (originalNoticeList.length === 0) {
    setOriginalNoticeList(noticeList);
  }
}, [noticeList, originalNoticeList.length]);

  // 검색 버튼 클릭 시 필터링
  const handleSearchClick = () => {
    if (!search.trim()) {
      setNoticeList(originalNoticeList); // 검색어 없으면 전체 복원
      return;
    }

    const filtered = originalNoticeList.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );
    setNoticeList(filtered);
  };

  // 검색어 공란이면 자동 복원
  useEffect(() => {
    if (!search.trim()) {
      setNoticeList(originalNoticeList);
    }
  }, [search, originalNoticeList]);

  // 상세 페이지 이동
  const handleViewNotice = (item) => {
    navigate("/user/community/notice-detail", { state: { item, noticeList } });
  };

  // 최신순 정렬
  const sortedList = [...noticeList]
    .sort((a, b) => parseDate(b.time) - parseDate(a.time))
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));
  
  return (
    <div className="tab-inner notice-tab">
      <h2>공지사항</h2>

      {/* 검색창 */}
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

      {/* 목록 */}
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
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
              <td>{item.no}</td>
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
