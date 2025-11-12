import React from "react";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";

export default function AdminRanking() {
  return (
    <>
      <AdminHeader1 isLoggedIn={true} />
      <AdminHeader2 isLoggedIn={true} />

      <div style={{ backgroundColor: "#FFEEB5", minHeight: "70vh", textAlign: "center", paddingTop: "100px" }}>
        <h2>레벨 순위 페이지가 아직 준비되지 않았습니다.</h2>
      </div>
    </>
  );
}
