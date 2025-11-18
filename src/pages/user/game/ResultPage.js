import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/game/WordGame.css";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results || [];
  const origin = location.state?.origin || null;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const wordList = location.state?.wordList || [];

  const handleRetry = () => {
    if (origin === "preset") {
      navigate("/user/game/word");
    } else if (origin === "custom") {
      navigate("/user/game/upload");
    } else {
      navigate("/user/game");
    }
  };

  const handleExit = () => {
    navigate("/user/game");
  };
  
  const handleAcidRain = () => {
    if (wordList.length === 0) {
      alert("산성비 모드로 전환할 단어가 없습니다.");
      return;
    }

    navigate("/user/game/acid-rain", {
      state: { wordList, from: origin || "preset" },
    });
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
      <div className="wordgame-result">
          <h2>결과 확인</h2>
          <p>맞은 개수: {correctCount} / {results.length}</p>

          <table className="result-table">
            <thead>
              <tr>
                <th>단어</th>
                <th>정답</th>
                <th>답변</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={r.isCorrect ? "correct-row" : "wrong-row"}>
                  <td>{r.word}</td>
                  <td>{r.correct}</td>
                  <td>{r.selected}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="wordgame-result-btns">
            <button className="wordgame-nav-btn" onClick={handleRetry}>
              다시 풀기
            </button>
            <button className="wordgame-nav-btn" onClick={handleExit}>
              게임 종료
            </button>
            {wordList.length > 0 && (
              <button className="wordgame-nav-btn" onClick={handleAcidRain}>
                산성비
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}