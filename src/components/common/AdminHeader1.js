import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import adminIcon from "../../assets/basicUser.png";
import { Bell } from "lucide-react";

function AdminHeader1({
  isLoggedIn = true,
  onOpenProfile,
  onOpenSetting,
  onOpenNotification,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/admin/main");
  };

  const handleToggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/home/before");
  };

  return (
    <header className="header1">
      {/* 로고 */}
      <div className="logo" onClick={handleLogoClick}>
        스마트 학습 도우미
      </div>

      {/* 오른쪽 메뉴 */}
      <nav className="menu" ref={dropdownRef}>
        {isLoggedIn ? (
          <>
            {/* 알림 아이콘 */}
            <Bell
              size={22}
              className="alarm-icon"
              onClick={() => {
                if (onOpenNotification) {
                  onOpenNotification();
                } else {
                  navigate("/admin/profile?tab=notification");
                }
              }}
            />

            {/* 프로필 아이콘 */}
            <img
              src={adminIcon}
              alt="admin"
              className="user-icon"
              onClick={handleToggleDropdown}
            />

            {/* 드롭다운 메뉴 */}
            {open && (
              <div className="dropdown-menu">
                <p
                  onClick={() => {
                    if (onOpenProfile) {
                      onOpenProfile();
                    } else {
                      navigate("/admin/profile");
                    }
                    setOpen(false);
                  }}
                >
                  프로필
                </p>
                <p
                  onClick={() => {
                    if (onOpenSetting) {
                      onOpenSetting();
                    } else {
                      navigate("/admin/setting");
                    }
                    setOpen(false);
                  }}
                >
                  설정
                </p>
                <p
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  로그아웃
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* (거의 안 쓰이지만 비로그인 대비) */}
            <button
              className="menu-btn"
              onClick={() => navigate("/user/auth/Login")}
            >
              로그인
            </button>
            <img src={adminIcon} alt="admin" className="user-icon disabled" />
          </>
        )}
      </nav>
    </header>
  );
}

export default AdminHeader1;
