import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import userIcon from "../../assets/basicUser.png";
import { Bell } from "lucide-react";

function Header1({
  isLoggedIn = false,
  onOpenProfile,
  onOpenSetting,
  onOpenNotification,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const loggedIn =
    isLoggedIn || localStorage.getItem("isLoggedIn") === "true";

  const role = localStorage.getItem("role");

  /* 사용자 테마 적용 */
  useEffect(() => {
    if (role === "admin") return;

    document.documentElement.classList.add("user-mode");
    document.documentElement.classList.remove("admin-mode");

    const userBg = localStorage.getItem("userThemeBg");
    const userAccent = localStorage.getItem("userThemeAccent");

    if (userBg) {
      document.documentElement.style.setProperty("--user-theme-bg", userBg);
    }

    if (userAccent) {
      document.documentElement.style.setProperty("--user-theme-accent", userAccent);
    }
  }, [role]);

  const handleLogoClick = () => {
    if (loggedIn) navigate("/home/after");
    else navigate("/home/before");
  };

  const handleToggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/home/before");
  };

  // 관리자일 경우 사용자 헤더는 숨김
  if (role === "admin") return null;

  return (
    <header className="header1">
      <div className="logo" onClick={handleLogoClick}>
        스마트 학습 도우미
      </div>

      <nav className="menu" ref={dropdownRef}>
        {loggedIn ? (
          <>
            <Bell
              size={22}
              className="alarm-icon"
              onClick={() => {
                if (onOpenNotification) onOpenNotification();
                else navigate("/user/profile/view?tab=notification");
              }}
            />

            <img
              src={userIcon}
              alt="user"
              className="user-icon"
              onClick={handleToggleDropdown}
            />

            {open && (
              <div className="dropdown-menu">
                <p
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    else navigate("/user/profile/view?tab=profile");
                    setOpen(false);
                  }}
                >
                  프로필
                </p>

                <p
                  onClick={() => {
                    if (onOpenSetting) onOpenSetting();
                    else navigate("/user/profile/view?tab=setting");
                    setOpen(false);
                  }}
                >
                  설정
                </p>

                <p onClick={handleLogout}>로그아웃</p>
              </div>
            )}
          </>
        ) : (
          <>
            <button className="menu-btn" onClick={() => navigate("/user/auth/Login")}>
              로그인
            </button>
            <button className="menu-btn" onClick={() => navigate("/user/auth/Register")}>
              회원가입
            </button>
            <img src={userIcon} alt="user" className="user-icon disabled" />
          </>
        )}
      </nav>
    </header>
  );
}

export default Header1;
