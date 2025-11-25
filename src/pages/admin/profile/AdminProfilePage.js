import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/profile/ProfileView.css";
import "../../../styles/profile/Tabs.css";
import AdminHeader1 from "../../../components/common/AdminHeader1";
import AdminHeader2 from "../../../components/common/AdminHeader2";
import AdminSidebar from "./AdminSidebar";
import AdminProfileTab from "./AdminProfileTab";
import AdminNotificationTab from "./AdminNotificationTab";
import AdminSettingsTab from "./AdminSettingsTab";
import AdminPasswordTab from "./AdminPasswordTab";

export default function AdminProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 로그인 상태 확인
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  // 현재 URL에 따라 activeTab 동기화
  useEffect(() => {
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");

    if (tabParam === "notification") {
      setActiveTab("notification");
    } 
    else if (tabParam === "password") {
      setActiveTab("password");
    } 
    else if (path === "/admin/setting") {
      setActiveTab("setting");
    } 
    else {
      setActiveTab("profile");
    }
  }, [location.pathname, location.search]);

  // 탭 이동 공통 함수
  const goToTab = (tabName) => {
    if (tabName === "profile") {
      navigate("/admin/profile");
    } 
    else if (tabName === "setting") {
      navigate("/admin/setting");
    } 
    else if (tabName === "notification") {
      navigate("/admin/profile?tab=notification");
    }
    else if (tabName === "password") {
      navigate("/admin/profile?tab=password");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <AdminProfileTab
            onNavigatePassword={() => goToTab("password")}
          />
        );
      case "password":
        return <AdminPasswordTab goToTab={goToTab} />;
      case "setting":
        return <AdminSettingsTab />;
      case "notification":
        return <AdminNotificationTab />;
      default:
        return (
          <AdminProfileTab onNavigatePassword={() => goToTab("password")} />
        );
    }
  };

  const isNotification = activeTab === "notification";

  return (
    <>
      <AdminHeader1
        isLoggedIn={isLoggedIn}
        onOpenProfile={() => goToTab("profile")}
        onOpenSetting={() => goToTab("setting")}
        onOpenNotification={() => goToTab("notification")}
      />
      <AdminHeader2 isLoggedIn={isLoggedIn} />

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
              <AdminSidebar activeTab={activeTab} goToTab={goToTab} />
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
