import { useState } from "react";

const INITIAL_CASES = [
  {
    id: 1,
    name: "田中 花子",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    topic: "間取り",
    budget: "3500万円台",
    timeline: "2026年中",
    message: "アイスマート2で30坪前後を検討中です。吹き抜けのある間取りを相談したいです。",
    status: "新規",
    date: "2026-03-01",
    memo: "",
  },
  {
    id: 2,
    name: "鈴木 一郎",
    email: "suzuki@example.com",
    phone: "080-9876-5432",
    topic: "オプション",
    budget: "4000万円台",
    timeline: "2025年中",
    message: "全館床暖房とロスガード90について詳しく聞きたいです。",
    status: "対応中",
    date: "2026-02-25",
    memo: "3/5にZoom予定",
  },
];

const TOPICS = ["間取り", "オプション", "見積もり", "土地・外構", "契約・手続き", "住み心地", "その他"];
const STATUSES = ["新規", "対応中", "完了", "保留"];
const STATUS_COLORS = {
  新規: { bg: "#e8f4fd", text: "#1a6fa3", border: "#90caf9" },
  対応中: { bg: "#fff8e1", text: "#a07800", border: "#ffe082" },
  完了: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  保留: { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
};

const BUDGETS = ["2000万円台", "3000万円台", "3500万円台", "4000万円台", "4500万円以上", "未定"];
const TIMELINES = ["3ヶ月以内", "半年以内", "1年以内", "2026年中", "2027年以降", "未定"];

export default function App() {
  const [view, setView] = useState("dashboard");
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", budget: "", timeline: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [search, setSearch] = useState("");

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.topic || !form.message) return;
    const newCase = {
      id: Date.now(),
      ...form,
      status: "新規",
      date: new Date().toISOString().split("T")[0],
      memo: "",
    };
    setCases([newCase, ...cases]);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", topic: "", budget: "", timeline: "", message: "" });
  };

  const updateCase = (id, field, value) => {
    setCases(cases.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    if (selected?.id === id) setSelected({ ...selected, [field]: value });
  };

  const filtered = cases.filter((c) => {
    const matchStatus = filterStatus === "すべて" || c.status === filterStatus;
    const matchSearch =
      search === "" ||
      c.name.includes(search) ||
      c.topic.includes(search) ||
      c.email.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = cases.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Noto Serif JP', 'Georgia', serif", minHeight: "100vh", background: "#f7f3ee", color: "#2c2418" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ background: "#1a1208", color: "#f0e6d3", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, letterSpacing: 2, fontWeight: 700 }}>🏠 一条コンサル</span>
          <span style={{ fontSize: 11, background: "#c8a96e", color: "#1a1208", borderRadius: 4, padding: "2px 8px", fontWeight: 700, letterSpacing: 1 }}>副業管理</span>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          {[["dashboard", "📊 ダッシュボード"], ["cases", "📋 案件一覧"], ["form", "📝 相談フォーム"]].map(([v, label]) => (
            <button key={v} onClick={() => { setView(v); setSelected(null); setSubmitted(false); }}
              style={{ background: view === v ? "#c8a96e" : "transparent", color: view === v ? "#1a1208" : "#f0e6d3", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: "#1a1208" }}>📊 ダッシュボード</h2>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[["総案件数", cases.length, "#1a1208", "📁"], ...STATUSES.map((s) => [s, counts[s], STATUS_COLORS[s].text, "●"])].map(([label, val, color, icon]) => (
                <div key={label} style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 12, padding: "20px 16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 13, color: "#6b5a47", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Recent */}
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1a1208" }}>🕐 最近の相談</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cases.slice(0, 5).map((c) => (
                <div key={c.id} onClick={() => { setSelected(c); setView("cases"); }}
                  style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div>
                    <span style={{ fontWeight: 700, marginRight: 10 }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: "#8c7a6b", background: "#f3ece3", padding: "2px 8px", borderRadius: 4 }}>{c.topic}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#8c7a6b" }}>{c.date}</span>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: STATUS_COLORS[c.status].bg, color: STATUS_COLORS[c.status].text, border: `1px solid ${STATUS_COLORS[c.status].border}`, fontWeight: 600 }}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{ marginTop: 32, background: "linear-gradient(135deg, #1a1208, #3d2b14)", borderRadius: 14, padding: "20px 24px", color: "#f0e6d3" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>💡 一条コンサルのポイント</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, lineHeight: 1.8 }}>
                {["全館床暖房の電気代の実績を共有する", "ロスガード90の実際のメンテナンス費用を説明", "オプション金額の優先順位付けをアドバイス", "営業担当との交渉ポイントを伝授", "土地の形状による間取り制約を解説", "実際の住み心地（冬・夏）を詳しく説明"].map((tip) => (
                  <div key={tip} style={{ display: "flex", gap: 6 }}><span style={{ color: "#c8a96e" }}>✓</span>{tip}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASES */}
        {view === "cases" && !selected && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📋 案件一覧</h2>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="名前・メール・カテゴリで検索..."
                style={{ border: "1px solid #d5c8b8", borderRadius: 8, padding: "8px 14px", fontFamily: "inherit", fontSize: 14, flex: 1, minWidth: 200, background: "#fff" }} />
              {["すべて", ...STATUSES].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{ border: `1px solid ${filterStatus === s ? "#c8a96e" : "#d5c8b8"}`, background: filterStatus === s ? "#c8a96e" : "#fff", color: filterStatus === s ? "#1a1208" : "#6b5a47", borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: filterStatus === s ? 700 : 400 }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#8c7a6b" }}>該当する案件がありません</div>}
              {filtered.map((c) => (
                <div key={c.id} onClick={() => setSelected(c)}
                  style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 12, padding: "16px 20px", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</span>
                        <span style={{ fontSize: 12, color: "#8c7a6b", background: "#f3ece3", padding: "2px 8px", borderRadius: 4 }}>{c.topic}</span>
                        {c.budget && <span style={{ fontSize: 12, color: "#8c7a6b" }}>💰 {c.budget}</span>}
                      </div>
                      <div style={{ fontSize: 13, color: "#6b5a47", marginBottom: 4 }}>{c.email} {c.phone && `・${c.phone}`}</div>
                      <div style={{ fontSize: 13, color: "#8c7a6b", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 500 }}>{c.message}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", minWidth: 100 }}>
                      <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: STATUS_COLORS[c.status].bg, color: STATUS_COLORS[c.status].text, border: `1px solid ${STATUS_COLORS[c.status].border}`, fontWeight: 700 }}>{c.status}</span>
                      <span style={{ fontSize: 12, color: "#8c7a6b" }}>{c.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASE DETAIL */}
        {view === "cases" && selected && (
          <div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c8a96e", fontSize: 14, fontFamily: "inherit", marginBottom: 16, padding: 0, fontWeight: 600 }}>← 一覧に戻る</button>
            <div style={{ background: "#fff", border: "1px solid #e8ddd0", borderRadius: 14, padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{selected.name}</h2>
                  <div style={{ fontSize: 14, color: "#8c7a6b", marginTop: 4 }}>相談日: {selected.date}</div>
                </div>
                <select value={selected.status} onChange={(e) => updateCase(selected.id, "status", e.target.value)}
                  style={{ border: `1.5px solid ${STATUS_COLORS[selected.status].border}`, background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text, borderRadius: 20, padding: "6px 14px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[["📧 メール", selected.email], ["📞 電話", selected.phone || "未記入"], ["🏷️ カテゴリ", selected.topic], ["💰 予算", selected.budget || "未記入"], ["📅 時期", selected.timeline || "未記入"]].map(([label, val]) => (
                  <div key={label} style={{ background: "#f7f3ee", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 12, color: "#8c7a6b", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#8c7a6b", marginBottom: 6 }}>💬 相談内容</div>
                <div style={{ background: "#f7f3ee", borderRadius: 8, padding: "14px 16px", fontSize: 14, lineHeight: 1.8 }}>{selected.message}</div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#8c7a6b", marginBottom: 6 }}>📝 メモ（自分用）</div>
                <textarea value={selected.memo} onChange={(e) => updateCase(selected.id, "memo", e.target.value)}
                  placeholder="対応メモ、次のアクションなど..."
                  style={{ width: "100%", minHeight: 100, border: "1px solid #d5c8b8", borderRadius: 8, padding: "12px 14px", fontFamily: "inherit", fontSize: 14, resize: "vertical", background: "#fffdf9", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>
        )}

        {/* FORM */}
        {view === "form" && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ background: "linear-gradient(135deg, #1a1208, #3d2b14)", borderRadius: 14, padding: "24px 32px", color: "#f0e6d3", marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🏠</div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>一条工務店 住まい相談</h2>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "#c8a96e" }}>実際に一条工務店で建てた経験者がアドバイスします</p>
            </div>

            {submitted ? (
              <div style={{ background: "#fff", borderRadius: 14, padding: "48px 32px", textAlign: "center", border: "1px solid #e8ddd0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontWeight: 700, fontSize: 20 }}>相談を受け付けました！</h3>
                <p style={{ color: "#6b5a47", lineHeight: 1.8 }}>通常2〜3営業日以内にご連絡いたします。<br />お気軽にお待ちください。</p>
                <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: "#c8a96e", color: "#1a1208", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  別の相談を送る
                </button>
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px 32px", border: "1px solid #e8ddd0", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["name", "お名前 *", "text", "山田 太郎"], ["email", "メールアドレス *", "email", "example@mail.com"], ["phone", "電話番号（任意）", "tel", "090-0000-0000"]].map(([name, label, type, ph]) => (
                    <div key={name} style={name === "email" ? {} : {}}>
                      <label style={{ fontSize: 13, color: "#6b5a47", fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                      <input name={name} value={form[name]} onChange={handleFormChange} type={type} placeholder={ph}
                        style={{ width: "100%", border: "1px solid #d5c8b8", borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: 14, boxSizing: "border-box", background: "#fffdf9" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
                  {[["topic", "相談カテゴリ *", TOPICS], ["budget", "おおよその予算", BUDGETS], ["timeline", "ご検討時期", TIMELINES]].map(([name, label, opts]) => (
                    <div key={name}>
                      <label style={{ fontSize: 13, color: "#6b5a47", fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                      <select name={name} value={form[name]} onChange={handleFormChange}
                        style={{ width: "100%", border: "1px solid #d5c8b8", borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", fontSize: 14, background: "#fffdf9", boxSizing: "border-box" }}>
                        <option value="">選択してください</option>
                        {opts.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 13, color: "#6b5a47", fontWeight: 600, display: "block", marginBottom: 6 }}>相談内容 *</label>
                  <textarea name="message" value={form.message} onChange={handleFormChange} placeholder="ご相談内容を自由にお書きください。検討中の間取り、気になるオプション、予算のことなど何でも歓迎です。"
                    style={{ width: "100%", minHeight: 120, border: "1px solid #d5c8b8", borderRadius: 8, padding: "12px 14px", fontFamily: "inherit", fontSize: 14, resize: "vertical", background: "#fffdf9", boxSizing: "border-box" }} />
                </div>

                <button onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.topic || !form.message}
                  style={{ marginTop: 20, width: "100%", background: (!form.name || !form.email || !form.topic || !form.message) ? "#d5c8b8" : "#1a1208", color: "#f0e6d3", border: "none", borderRadius: 10, padding: "14px", fontFamily: "inherit", fontSize: 16, fontWeight: 700, cursor: (!form.name || !form.email || !form.topic || !form.message) ? "not-allowed" : "pointer", transition: "background 0.2s", letterSpacing: 1 }}>
                  相談を送信する →
                </button>

                <p style={{ fontSize: 12, color: "#8c7a6b", textAlign: "center", marginTop: 12 }}>※ いただいた情報はコンサルティング目的のみに使用します</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
