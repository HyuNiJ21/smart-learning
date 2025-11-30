import React from "react";
import "./Footer.css";

function Footer() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  let footerClass = "footer footer-default";

  if (isLoggedIn) {
    footerClass = role === "admin" ? "footer footer-admin" : "footer footer-user";
  }

  return (
    <footer className={footerClass}>
      <p> © 2025 갓생제작소 2학기 융합프로젝트 </p>
    </footer>
  );
}

export default Footer;
