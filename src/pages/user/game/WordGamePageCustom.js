import React, { useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";
import { useWordSets } from "../../../context/WordSetContext";
import * as XLSX from "xlsx";

export default function WordGamePageCustom() {
  const navigate = useNavigate();
  const { userSets, addUserSet, deleteUserSet } = useWordSets();

  const [customName, setCustomName] = useState("");
  const [pendingFile, setPendingFile] = useState(null);

  // 알림 모달
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 삭제 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPendingFile(file);
  };

  // 셀 내용 자동 정리 (줄바꿈/여러 공백 제거)
  const normalizeCell = (v) =>
    String(v ?? "")
      .replace(/\r?\n/g, " ") // 줄바꿈 -> 공백으로
      .replace(/\s+/g, " ") // 여러 공백 -> 1개
      .trim();

  // 엑셀 다운로드
  const downloadExcelTemplate = () => {
    const rows = [
      { word: "sample", correct: "예시" },
      { word: "rain", correct: "비" },
    ];

    const ws = XLSX.utils.json_to_sheet(rows, {
      header: ["word", "correct"],
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Words");
    XLSX.writeFile(wb, "WordSetTemplate.xlsx");
  };

  const openAlert = (msg) => {
    setAlertMessage(msg);
    setShowAlertModal(true);
  };

  const closeAlert = () => {
    setShowAlertModal(false);
    setAlertMessage("");
  };

  // 삭제
  const openDeleteConfirm = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  const confirmDelete = () => {
    deleteUserSet(deleteTargetId);
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // 세트 등록
  const handleRegisterSet = async () => {
    if (!customName.trim()) {
      openAlert("세트 이름을 입력해주세요.");
      return;
    }

    if (!pendingFile) {
      openAlert("엑셀 파일을 선택해주세요.");
      return;
    }

    // 이름 중복
    const isDuplicateName = userSets.some(
      (s) => s.setName === customName.trim()
    );
    if (isDuplicateName) {
      openAlert("이미 존재하는 세트 이름입니다.");
      return;
    }

    try {
      const ext = pendingFile.name.toLowerCase().split(".").pop();
      if (ext !== "xlsx" && ext !== "xls") {
        openAlert("엑셀(.xlsx, .xls) 파일만 업로드할 수 있습니다.");
        return;
      }

      // 엑셀 읽기
      const data = await pendingFile.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rowsRaw = XLSX.utils.sheet_to_json(ws, { defval: "" });

      // 셀 값 정리
      const rows = rowsRaw.map((r) => ({
        word: normalizeCell(r.word),
        correct: normalizeCell(r.correct),
      }));

      // 모든 correct 값 모으기
      const allCorrects = rows
        .map((r) => r.correct)
        .filter(Boolean);

      // 단어 리스트 만들기
      const wordList = rows
        .map((r) => {
          const word = r.word;
          const correct = r.correct;

          if (!word || !correct) return null;

          // 정답 제외 오답 후보
          const wrongCandidates = allCorrects.filter((c) => c !== correct);

          // 오답 섞기
          const shuffled = [...wrongCandidates].sort(() => Math.random() - 0.5);
          const wrongOptions = shuffled.slice(0, 3);

          // 보기
          const options = [correct, ...wrongOptions].sort(
            () => Math.random() - 0.5
          );

          return { word, correct, options };
        })
        .filter(Boolean);

      if (!wordList.length) {
        openAlert("유효한 단어 목록이 없습니다.");
        return;
      }

      // 등록
      addUserSet(customName.trim(), wordList);

      // 초기화
      setCustomName("");
      setPendingFile(null);

      openAlert("엑셀 단어 세트가 등록되었습니다!");
    } catch (err) {
      console.error(err);
      openAlert("엑셀 파일 처리 중 오류가 발생했습니다.\n템플릿 형식을 확인해주세요.");
    }
  };

  // 게임 실행
  const startUserSet = (setObj) => {
    navigate("/user/game/quiz", {
      state: {
        setName: setObj.setName,
        wordList: setObj.wordList,
        origin: "custom",
        id: setObj.id,
      },
    });
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <h2 className="wordgame-title">내 단어 맞추기</h2>

        <div className="wordgame-header-section">
          <input
            className="wordgame-name-input"
            type="text"
            placeholder="세트 이름"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />

          <label className="wordgame-upload-card">
            <div className="wordgame-upload-inner">
              <span className="wordgame-plus-icon">+</span>
              <span>
                {pendingFile ? "파일 선택 완료" : "엑셀 파일 선택"}
              </span>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button className="wordgame-nav-btn" onClick={handleRegisterSet}>
            등록하기
          </button>

          <button
            className="wordgame-nav-btn"
            onClick={downloadExcelTemplate}
          >
            엑셀 다운로드
          </button>
        </div>

        <section style={{ width: "100%", maxWidth: "800px" }}>
          <div className="wordgame-folder-container">
            {userSets.length === 0 ? (
              <p style={{ gridColumn: "1 / span 3", color: "#555" }}>
                아직 등록한 세트가 없습니다.
              </p>
            ) : (
              userSets.map((setObj) => (
                <div className="wordgame-folder-card" key={setObj.id}>
                  <div
                    className="wordgame-folder-left"
                    onClick={() => startUserSet(setObj)}
                  >
                    <img src={folderIcon} alt="folder" />
                    <p>{setObj.setName}</p>
                  </div>

                  <button
                    className="wordgame-delete-btn"
                    onClick={() => openDeleteConfirm(setObj.id)}
                  >
                    <img
                      src={deleteIcon}
                      alt="delete"
                      className="wordgame-delete-icon"
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* 알림 모달 */}
      {showAlertModal && (
        <div className="modal-overlay" onClick={closeAlert}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-text">{alertMessage}</div>
            <div className="modal-btn-row">
              <button className="modal-btn" onClick={closeAlert}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-text">정말 지우시겠습니까?</div>
            <div className="modal-btn-row">
              <button className="modal-btn-cancel" onClick={cancelDelete}>
                취소
              </button>
              <button className="modal-btn-danger" onClick={confirmDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
