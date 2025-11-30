import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/profile/ProfileView.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./tabs/ProfileTab";
import PasswordTab from "./tabs/PasswordTab";
import NotificationTab from "./tabs/NotificationTab";
import SettingsTab from "./tabs/SettingsTab";

function ProfileView() {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "profile";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(getTabFromURL());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // URL이 바뀔 때마다 tab 동기화
  useEffect(() => {
    setActiveTab(getTabFromURL());
  }, [location.search, getTabFromURL]);

  // 로그인 여부
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeColor");
    if (savedTheme) {
      document.documentElement.style.setProperty("--theme-color", savedTheme);
    }
  }, []);

  // 공통 탭 이동 함수
  const goToTab = (tabName) => {
    navigate(`/user/profile/view?tab=${tabName}`);
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            onNavigatePassword={() => setActiveTab("password")}
            setActiveTab={setActiveTab}
          />
        );
      case "password":
        return <PasswordTab onBack={() => setActiveTab("profile")} />;
      case "setting":
        return <SettingsTab setActiveTab={setActiveTab} />;
      case "notification":
        return <NotificationTab />;
      default:
        return <ProfileTab setActiveTab={setActiveTab} />;
    }
  };

  const isNotification = activeTab === "notification";

  return (
    <>
      <Header1
        isLoggedIn={isLoggedIn}
        onOpenProfile={() => goToTab("profile")}
        onOpenSetting={() => goToTab("setting")}
        onOpenNotification={() => goToTab("notification")}
      />
      <Header2 isLoggedIn={isLoggedIn} />

      <div
        className="page-content"
        style={{
          paddingTop: "93px",
          minHeight: "calc(100vh - 93px)",
          boxSizing: "border-box",
        }}
      >
        <div
          className="profile-wrapper"
          style={
            isNotification
              ? {
                  display: "flex",
                  justifyContent: "center",
                }
              : {}
          }
        >
          {/* 알림이 아닐 때만 사이드바 표시 */}
          {!isNotification && (
            <aside className="profile-sidebar-container">
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                goToTab={goToTab}
              />
            </aside>
          )}

          {/* 알림일 때 폭 줄여서 가운데 정렬 */}
          <main
            className="profile-main-content"
            style={
              isNotification
                ? {
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }
                : {}
            }
          >
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
}

export default ProfileView;
