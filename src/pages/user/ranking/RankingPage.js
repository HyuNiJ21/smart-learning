import React, { useEffect } from "react"; 
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { sortedRanking } from "../../../data/rankingData";
import "../../../styles/ranking/RankingPage.css";

function RankingPage(){

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="page-content" style={{paddingTop: "93px", minHeight: "calc(100vh-93px)", boxSizing: "border-box"}}>
        <div className="ranking-page">
          <div className="ranking-container">
            <h2>사용자 레벨 순위</h2>

            <div className="ranking-scroll-box">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>닉네임</th>
                    <th>캐릭터 레벨</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRanking.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.nickname}</td>
                      <td>Lv.{user.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default RankingPage;
