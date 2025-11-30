import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainBeforeLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";

function MainBeforeLogin() {
  return (
    <>
      <Header1 isLoggedIn={false} />
      <Header2 isLoggedIn={false} />
      
      <div className="before-login-page">

        <div className="before-login-container">
          <div className="before-login-content">
            <h1>로그인 하고 이용해주세요!</h1>
            <p>로그인하고 이용</p>
            <div className="btn-group">
              <Link to="/user/auth/Login" className="common-btn">로그인</Link>
              <Link to="/user/auth/Register" className="common-btn">회원 가입</Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default MainBeforeLogin;
