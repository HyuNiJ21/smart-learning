import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import "../../styles/admin/AdminGame.css";
import { Search } from "lucide-react";

export default function AdminGame() {
  const [menu, setMenu] = useState("sets");
  const [defaultSets, setDefaultSets] = useState([
    {
      id: 1,
      title: "기본 영단어 A",
      words: [
        { word: "apple", correct: "사과" },
        { word: "age", correct: "나이" },
        { word: "animal", correct: "동물" },
      ],
    },
    {
      id: 2,
      title: "기본 영단어 B",
      words: [
        { word: "banana", correct: "바나나" },
        { word: "bag", correct: "가방" },
      ],
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [newSetName, setNewSetName] = useState("");
  const [selectedSet, setSelectedSet] = useState(null);

  const [newWord, setNewWord] = useState("");
  const [newCorrect, setNewCorrect] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editWord, setEditWord] = useState("");
  const [editCorrect, setEditCorrect] = useState("");

  const [editingSetId, setEditingSetId] = useState(null);
  const [editingSetTitle, setEditingSetTitle] = useState("");

  const filteredSets = useMemo(() => {
    if (!searchKeyword.trim()) return defaultSets;
    return defaultSets.filter((set) =>
      set.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, defaultSets]);

  const duplicateInfo = useMemo(() => {
    let map = {};
    defaultSets.forEach((set) =>
      set.words.forEach((w) => {
        if (!map[w.word]) map[w.word] = [];
        map[w.word].push(set.title);
      })
    );

    return Object.entries(map)
      .filter(([_, sets]) => sets.length >= 2)
      .map(([word, sets]) => ({ word, sets }));
  }, [defaultSets]);

  const createSet = () => {
    if (!newSetName.trim()) return alert("세트 이름을 입력하세요.");
    setDefaultSets([
      ...defaultSets,
      { id: Date.now(), title: newSetName, words: [] },
    ]);
    setNewSetName("");
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const setName = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const words = json.map((row) => ({
        word: row.word,
        correct: row.correct,
      }));

      setDefaultSets((prev) => [
        ...prev,
        { id: Date.now(), title: setName, words },
      ]);
    };

    reader.readAsArrayBuffer(file);
  };

  const addWord = () => {
    if (!newWord.trim() || !newCorrect.trim())
      return alert("영단어와 뜻을 모두 입력하세요.");

    setDefaultSets((prev) =>
      prev.map((set) =>
        set.id === selectedSet
          ? {
              ...set,
              words: [...set.words, { word: newWord, correct: newCorrect }],
            }
          : set
      )
    );

    setNewWord("");
    setNewCorrect("");
  };

  const deleteWord = (setId, index) => {
    setDefaultSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              words: set.words.filter((_, i) => i !== index),
            }
          : set
      )
    );
  };

  const saveWordEdit = () => {
    setDefaultSets((prev) =>
      prev.map((set) =>
        set.id === selectedSet
          ? {
              ...set,
              words: set.words.map((w, idx) =>
                idx === editingIndex
                  ? { word: editWord, correct: editCorrect }
                  : w
              ),
            }
          : set
      )
    );

    setEditingIndex(null);
    setEditWord("");
    setEditCorrect("");
  };

  const deleteSet = (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    setDefaultSets(defaultSets.filter((s) => s.id !== id));
    if (selectedSet === id) setSelectedSet(null);
  };

  const saveSetTitle = () => {
    if (!editingSetTitle.trim()) return;
    setDefaultSets((prev) =>
      prev.map((s) =>
        s.id === editingSetId ? { ...s, title: editingSetTitle } : s
      )
    );
    setEditingSetId(null);
  };

  const renderStatus = () => (
    <div className="right-card status">
      <h2>단어게임 현황</h2>
      <div className="status-column">
        <div className="stat-box">
          <h3>총 세트 개수</h3>
          <p>{defaultSets.length}개</p>
        </div>
        <div className="stat-box">
          <h3>총 단어 개수</h3>
          <p>{defaultSets.reduce((t, s) => t + s.words.length, 0)}개</p>
        </div>
      </div>
    </div>
  );

  const renderDuplicates = () => (
    <div className="right-card">
      <h2>겹친 단어</h2>

      <table className="word-table duplicate-table">
        <thead>
          <tr>
            <th className="col-word">단어</th>
            <th>겹치는 세트</th>
          </tr>
        </thead>

        <tbody>
          {duplicateInfo.map((item, i) => (
            <tr key={i}>
              <td className="col-word">{item.word}</td>
              <td>{item.sets.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSetManager = () => {
    const target = defaultSets.find((s) => s.id === selectedSet);

    return (
      <div className="right-card">
        <h2>세트 관리</h2>

        <div className="set-control-row">
          <div className="left-part">
            <input
              className="search-input"
              placeholder="세트 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearchKeyword(searchText)}
            />
            <button className="search-btn" onClick={() => setSearchKeyword(searchText)}>
              <Search size={18} />
            </button>
          </div>

          <div className="right-part">
            <input
              className="input-set"
              placeholder="새 세트 이름"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
            />
            <button className="yellow-btn" onClick={createSet}>추가</button>

            <label className="yellow-btn excel-label">
              엑셀 업로드
              <input hidden type="file" accept=".xls,.xlsx" onChange={handleExcelUpload} />
            </label>
          </div>
        </div>

        <div className="set-layout">
          <div className="left-set-column">
            <div className="set-list-title">세트 목록</div>

            <div className="left-set-list">
              {filteredSets.map((set) => (
                <div
                  key={set.id}
                  className={`set-item ${selectedSet === set.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedSet(set.id);
                    setEditingIndex(null);
                  }}
                >
                  <div className="set-row">
                    {editingSetId === set.id ? (
                      <>
                        <input
                          className="set-title-input"
                          value={editingSetTitle}
                          onChange={(e) => setEditingSetTitle(e.target.value)}
                        />
                        <div className="set-btn-group">
                          <button
                            className="yellow-btn small"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveSetTitle();
                            }}
                          >
                            저장
                          </button>
                          <button
                            className="small-btn red"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSetId(null);
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="set-title">{set.title}</span>

                        <div className="set-btn-group">
                          <button
                            className="yellow-btn small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSetId(set.id);
                              setEditingSetTitle(set.title);
                            }}
                          >
                            수정
                          </button>

                          <button
                            className="small-btn red"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSet(set.id);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="set-count">단어 {set.words.length}개</p>
                </div>
              ))}
            </div>
          </div>

          <div className="word-panel">
            {selectedSet ? (
              <>
                <h3>{target.title}</h3>

                <div className="word-add-row">
                  <input
                    className="word-input"
                    placeholder="영단어"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                  />
                  <input
                    className="word-input"
                    placeholder="뜻"
                    value={newCorrect}
                    onChange={(e) => setNewCorrect(e.target.value)}
                  />
                  <button className="yellow-btn" onClick={addWord}>추가</button>
                </div>

                <div className="word-table-wrapper">
                  <table className="word-table">
                    <thead>
                      <tr>
                        <th>영단어</th>
                        <th>뜻</th>
                        <th>관리</th>
                      </tr>
                    </thead>

                    <tbody>
                      {target.words.map((w, idx) => (
                        <tr key={idx}>
                          {editingIndex === idx ? (
                            <>
                              <td>
                                <input
                                  className="word-input"
                                  value={editWord}
                                  onChange={(e) => setEditWord(e.target.value)}
                                  />
                                  </td>
                                  <td>
                                    <input
                                      className="word-input"
                                      value={editCorrect}
                                      onChange={(e) => setEditCorrect(e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <div className="set-btn-group">
                                      <button
                                        className="yellow-btn small"
                                        onClick={saveWordEdit}
                                      >
                                        저장
                                      </button>
                                      <button
                                        className="small-btn red"
                                        onClick={() => setEditingIndex(null)}
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{w.word}</td>
                                  <td>{w.correct}</td>
                                  <td>
                                    <div className="set-btn-group">
                                      <button
                                        className="yellow-btn small"
                                        onClick={() => {
                                          setEditingIndex(idx);
                                          setEditWord(w.word);
                                          setEditCorrect(w.correct);
                                        }}
                                      >
                                        수정
                                      </button>
                                      <button
                                        className="small-btn red"
                                        onClick={() => deleteWord(selectedSet, idx)}
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="empty-text">왼쪽에서 세트를 선택하세요.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AdminHeader1 isLoggedIn={true} />
      <AdminHeader2 isLoggedIn={true} />

      <div className="admin-page">
        <div className="left-sidebar">
          <h2 className="sidebar-title">단어게임 관리</h2>

          <div
            className={`side-btn ${menu === "sets" ? "active" : ""}`}
            onClick={() => setMenu("sets")}
          >
            세트 관리
          </div>

          <div
            className={`side-btn ${menu === "dup" ? "active" : ""}`}
            onClick={() => setMenu("dup")}
          >
            겹친 단어
          </div>

          <div
            className={`side-btn ${menu === "status" ? "active" : ""}`}
            onClick={() => setMenu("status")}
          >
            단어게임 현황
          </div>
        </div>

        <div className="right-content">
          {menu === "sets" && renderSetManager()}
          {menu === "dup" && renderDuplicates()}
          {menu === "status" && renderStatus()}
        </div>
      </div>
    </>
  );
}
