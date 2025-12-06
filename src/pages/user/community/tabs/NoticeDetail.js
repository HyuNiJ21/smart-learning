import React from "react";
import "../../../../styles/community/Community.css";
import "../../../../styles/community/Tabs.css";
import Header1 from "../../../../components/common/Header1";
import Header2 from "../../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";

function NoticeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, noticeList } = location.state || {};

  if (!item) {
    navigate("/user/community", { state: { defaultTab: "notice" } });
    return null;
  }

  const index = noticeList.findIndex((n) => n.id === item.id);

  // 이전글
  const handlePrev = () => {
    if (index === noticeList.length - 1) {
      alert("이전글이 없습니다.");
      return;
    }
    navigate("/user/community/notice-detail", {
      state: { item: noticeList[index + 1], noticeList },
    });
  };

  // 다음글
  const handleNext = () => {
    if (index === 0) {
      alert("다음글이 없습니다.");
      return;
    }
    navigate("/user/community/notice-detail", {
      state: { item: noticeList[index - 1], noticeList },
    });
  };

  const goList = () => {
    navigate("/user/community", { state: { defaultTab: "notice" } });
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div
        className="page-content"
        style={{
          paddingTop: "93px",
          minHeight: "calc(100vh - 93px)",
          boxSizing: "border-box",
        }}
      >
        {/* 전체 커뮤니티 구조 */}
        <div className="community-wrapper">
          {/* 사이드바 */}
          <div className="community-sidebar-container">
            <div className="profile-sidebar">
              <p className="sidebar-title">공지 및 문의</p>
              <ul>
                <li
                  className="active"
                  onClick={goList}
                >
                  공지사항
                </li>
                <li onClick={() => navigate("/user/community")}>
                  FAQ & 1:1 문의
                </li>
              </ul>
            </div>
          </div>

          {/* 오른쪽 내용 */}
          <div className="community-main-content">
            <div className="tab-inner notice-tab">
              <div className="write-form">
                <h2>{item.title}</h2>
                <p style={{ color: "#777", marginTop: "6px" }}>
                  작성시간: {item.time}
                </p>
                <hr />
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.6",
                    marginTop: "14px",
                  }}
                >
                  {item.content}
                </p>
              </div>

              {/* 버튼 영역 */}
              <div
                className="btn-right"
                style={{ gap: "6px", marginTop: "12px" }}
              >
                <button
                  className="common-btn small-btn"
                  onClick={handlePrev}
                >
                  {"< 이전글"}
                </button>
                <button
                  className="common-btn small-btn"
                  onClick={handleNext}
                >
                  {"다음글 >"}
                </button>
                <button
                  className="cancel-btn small-btn"
                  onClick={goList}
                >
                  목록으로
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoticeDetail;
