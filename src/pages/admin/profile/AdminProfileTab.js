import React, { useState } from "react";
import "../../../styles/profile/Tabs.css";
import adminImg from "../../../assets/basicUser.png";

function AdminProfileTab({ onNavigatePassword }) {
  const [nickname, setNickname] = useState("관리자");
  const [profileImg, setProfileImg] = useState(adminImg);
  
  const adminEmail = localStorage.getItem("adminEmail") || "admin@smart.com";

  const handleNicknameChange = () => {
    alert("관리자 닉네임이 변경되었습니다.");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="tab-inner profile-main">

      <div className="profile-box">
        {/* 프로필 이미지 + 닉네임 */}
        <div className="profile-header">
          <div className="profile-photo">
            <img src={profileImg} alt="admin" />
          </div>

          <div className="profile-nickname">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />

            <div className="nickname-btns">
              <label htmlFor="imgUpload" className="small-btn gray">
                사진변경
              </label>

              <input
                type="file"
                id="imgUpload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <button className="small-btn" onClick={handleNicknameChange}>
                닉네임 변경
              </button>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="profile-info">
          <div className="profile-info-row horizontal">
            <label>Email</label>
            <div>{adminEmail}</div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="profile-btns">
          <button className="yellow-btn" onClick={onNavigatePassword}>
            비밀번호 재설정
          </button>
          <button className="gray-btn">취소</button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfileTab;
