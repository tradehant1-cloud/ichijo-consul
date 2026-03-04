import { useState, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDHjUqwrJ_T1ocDNnSVo3kP--vJT8fr3UAsTDREsxfkddIxROFTFy_nx9GJomp5Vxyew/exec";

const INITIAL_CASES = [
  { id: 1, name: "田中 花子", email: "tanaka@example.com", phone: "090-1234-5678", topic: "間取り", budget: "3500万円台", timeline: "2026年中", message: "アイスマート2で30坪前後を検討中です。", status: "新規", date: "2026-03-01", memo: "" },
  { id: 2, name: "鈴木 一郎", email: "suzuki@example.com", phone: "080-9876-5432", topic: "オプション", budget: "4000万円台", timeline: "2025年中", message: "全館床暖房とロスガード90について聞きたいです。", status: "対応中", date: "2026-02-25", memo: "3/5にZoom予定" },
];

const TOPICS = ["間取り", "オプション", "見積もり", "土地・外構", "契約・手続き", "住み心地", "その他"];
const STATUSES = ["新規", "対応中", "完了", "保留"];
const STATUS_COLORS = {
  新規: { bg: "#f0f0f0", text: "#111", border: "#ccc" },
  対応中: { bg: "#111", text: "#fff", border: "#111" },
  完了: { bg: "#e8e8e8", text: "#444", border: "#bbb" },
  保留: { bg: "#fff", text: "#999", border: "#ddd" },
};
const BUDGETS = ["2000万円台", "3000万円台", "3500万円台", "4000万円台", "4500万円以上", "未定"];
const TIMELINES = ["3ヶ月以内", "半年以内", "1年以内", "2026年中", "2027年以降", "未定"];

const SERVICES = [
  { icon: "01", title: "間取り相談", desc: "実際の住まいをもとに、後悔しない間取りのポイントをアドバイス。吹き抜け・収納・動線など。", price: "3,000円 / 30分" },
  { icon: "02", title: "オプション選び", desc: "本当に必要なオプションと不要なものを仕分け。優先順位の付け方を一緒に考えます。", price: "3,000円 / 30分" },
  { icon: "03", title: "見積もり確認", desc: "見積書の見方・交渉ポイント・追加費用の罠など、契約前に知っておくべきことを解説。", price: "3,000円 / 30分" },
  { icon: "04", title: "住み心地レポート", desc: "電気代・メンテナンス・冬夏の快適さなど、実際に住んでわかったリアルな情報を共有。", price: "3,000円 / 30分" },
];

const FAQS = [
  { q: "どんな人に向けたサービスですか？", a: "一条工務店での家づくりを検討している方、または現在打ち合わせ中の方が主な対象です。" },
  { q: "相談はどんな形式ですか？", a: "ZoomまたはGoogle Meetでのオンライン相談です。画面共有で図面や見積書を一緒に確認することもできます。" },
  { q: "相談料金はいつ支払いますか？", a: "相談確定後にお振込み先をご案内します。事前払いとなります。" },
  { q: "一条工務店以外の相談はできますか？", a: "申し訳ありませんが、現在は一条工務店専門のサービスとなっております。" },
];

export default function App() {
  const [view, setView] = useState("top");
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", budget: "", timeline: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.topic || !form.message) return;
    setSending(true);
    const newCase = { id: Date.now(), ...form, status: "新規", date: new Date().toISOString().split("T")[0], memo: "" };
    setCases((prev) => [newCase, ...prev]);
    try {
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, date: newCase.date }) });
    } catch (e) { console.error(e); }
    setSending(false);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", topic: "", budget: "", timeline: "", message: "" });
  };

  const updateCase = (id, field, value) => {
    setCases(cases.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    if (selected?.id === id) setSelected({ ...selected, [field]: value });
  };

  const filtered = cases.filter((c) => {
    const matchStatus = filterStatus === "すべて" || c.status === filterStatus;
    const matchSearch = search === "" || c.name.includes(search) || c.topic.includes(search) || c.email.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = STATUSES.reduce((acc, s) => { acc[s] = cases.filter((c) => c.status === s).length; return acc; }, {});

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Noto+Sans+JP:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .fade-in { animation: fadeIn 0.8s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .service-card:hover { background: #111 !important; color: #fff !important; transform: translateY(-4px); }
    .service-card:hover .svc-icon { color: #555 !important; border-color: #333 !important; }
    .service-card:hover .svc-price { background: #222 !important; color: #ccc !important; }
    .service-card { transition: all 0.3s ease; }
    .nav-link { transition: opacity 0.2s; cursor: pointer; }
    .nav-link:hover { opacity: 0.4; }
    .btn-main { transition: all 0.2s; }
    .btn-main:hover { background: #333 !important; }
    .btn-outline:hover { background: #f5f5f5 !important; }
    .faq-item { border-bottom: 1px solid #ececec; }
    .case-row:hover { background: #fafafa !important; }
    @media (max-width: 768px) {
      .hero-title { font-size: 34px !important; line-height: 1.4 !important; }
      .services-grid { grid-template-columns: 1fr !important; }
      .profile-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      .form-grid-2 { grid-template-columns: 1fr !important; }
      .form-grid-3 { grid-template-columns: 1fr !important; }
      .nav-desktop { display: none !important; }
      .mobile-menu-btn { display: flex !important; }
      .stats-row { grid-template-columns: 1fr 1fr !important; }
      .admin-stats { grid-template-columns: 1fr 1fr !important; }
    }
  `;

  const navItems = [["service", "サービス"], ["profile", "プロフィール"], ["faq", "よくある質問"], ["contact", "相談する"]];

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#fff", color: "#111", minHeight: "100vh" }}>
      <style>{css}</style>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #ececec", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => { setView("top"); setMenuOpen(false); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, letterSpacing: 3 }}>ICHIJO</span>
            <span style={{ fontSize: 9, color: "#bbb", letterSpacing: 2, fontWeight: 300, paddingTop: 2 }}>CONSULTING</span>
          </div>
          <nav className="nav-desktop" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {navItems.map(([id, label]) => (
              <span key={id} className="nav-link" onClick={() => { setView(id); setMenuOpen(false); }}
                style={{ fontSize: 13, fontWeight: view === id ? 500 : 300, borderBottom: view === id ? "1px solid #111" : "1px solid transparent", paddingBottom: 2 }}>
                {label}
              </span>
            ))}
            <span className="nav-link" onClick={() => { setView("admin"); setMenuOpen(false); }} style={{ fontSize: 11, color: "#ccc", letterSpacing: 1 }}>管理</span>
          </nav>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", fontSize: 20, cursor: "pointer", alignItems: "center", justifyContent: "center", width: 36, height: 36 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #ececec", padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20 }}>
            {[...navItems, ["admin", "管理"]].map(([id, label]) => (
              <span key={id} onClick={() => { setView(id); setMenuOpen(false); }}
                style={{ fontSize: 15, cursor: "pointer", fontWeight: 300, color: id === "admin" ? "#ccc" : "#111" }}>{label}</span>
            ))}
          </div>
        )}
      </header>

      <div style={{ paddingTop: 58 }}>

        {/* ===== TOP ===== */}
        {view === "top" && (
          <div>
            {/* Hero */}
            <section style={{ minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", padding: "5rem 1.5rem", textAlign: "center" }}>
              <div className="fade-in">
                <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 28, fontWeight: 300 }}>ONE-ON-ONE CONSULTING</p>
                <h1 className="hero-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, lineHeight: 1.4, marginBottom: 28, letterSpacing: 1, color: "#111" }}>
                  一条工務店で<br />後悔しない家を建てる
                </h1>
                <p style={{ fontSize: 15, color: "#777", fontWeight: 300, lineHeight: 2, marginBottom: 44, maxWidth: 440, margin: "0 auto 44px" }}>
                  実際に建てた経験者が、間取り・オプション・<br />見積もりを一緒に考えます。
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-main" onClick={() => setView("contact")}
                    style={{ background: "#111", color: "#fff", border: "none", padding: "15px 40px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, letterSpacing: 1 }}>
                    無料で相談してみる
                  </button>
                  <button className="btn-outline" onClick={() => setView("service")}
                    style={{ background: "#fff", color: "#111", border: "1px solid #ddd", padding: "15px 40px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 300 }}>
                    サービスを見る
                  </button>
                </div>
                <p style={{ marginTop: 20, fontSize: 12, color: "#ccc", fontWeight: 300 }}>初回相談 30分 ¥3,000</p>
              </div>
            </section>

            {/* Stats */}
            <section style={{ padding: "4rem 1.5rem", borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec" }}>
              <div className="stats-row" style={{ maxWidth: 700, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, textAlign: "center" }}>
                {[["2022年", "入居"], ["35坪", "延床面積"], ["i-smart 2", "モデル"]].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, letterSpacing: 1, marginBottom: 6 }}>{val}</div>
                    <div style={{ fontSize: 11, color: "#bbb", letterSpacing: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section style={{ padding: "5rem 1.5rem", borderBottom: "1px solid #ececec" }}>
              <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14, fontWeight: 300 }}>SERVICES</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, marginBottom: 44, letterSpacing: 1 }}>相談できること</h2>
                <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#ececec" }}>
                  {SERVICES.map((s, i) => (
                    <div key={i} className="service-card" style={{ background: "#fff", padding: "36px 32px" }}>
                      <div className="svc-icon" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: "#ccc", border: "1px solid #ececec", display: "inline-block", padding: "3px 10px", marginBottom: 20, letterSpacing: 2 }}>{s.icon}</div>
                      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>{s.title}</h3>
                      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.9, fontWeight: 300, marginBottom: 20 }}>{s.desc}</p>
                      <span className="svc-price" style={{ fontSize: 12, background: "#f5f5f5", padding: "4px 12px", letterSpacing: 0.5 }}>{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "6rem 1.5rem", background: "#111", color: "#fff", textAlign: "center" }}>
              <p style={{ fontSize: 10, letterSpacing: 5, color: "#555", marginBottom: 20 }}>FIRST STEP</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, marginBottom: 16, letterSpacing: 1 }}>まずは気軽に相談から</h2>
              <p style={{ fontSize: 14, color: "#888", fontWeight: 300, marginBottom: 36, lineHeight: 1.9 }}>フォームからご連絡いただければ、2〜3営業日以内にご返信します。</p>
              <button onClick={() => setView("contact")}
                style={{ background: "#fff", color: "#111", border: "none", padding: "15px 40px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, transition: "background 0.2s" }}>
                相談フォームへ →
              </button>
            </section>
          </div>
        )}

        {/* ===== SERVICE ===== */}
        {view === "service" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>SERVICES</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 48, letterSpacing: 1 }}>サービス内容・料金</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec", marginBottom: 48 }}>
              {SERVICES.map((s, i) => (
                <div key={i} style={{ background: "#fff", padding: "36px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: "#ccc", letterSpacing: 2 }}>{s.icon}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 500 }}>{s.title}</h3>
                    </div>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.9, fontWeight: 300 }}>{s.desc}</p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 100 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300 }}>¥3,000</div>
                    <div style={{ fontSize: 11, color: "#bbb", letterSpacing: 1 }}>30分 / 回</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fafafa", border: "1px solid #ececec", padding: "28px 32px", marginBottom: 40 }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 20, letterSpacing: 1 }}>相談の流れ</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["フォームから相談内容を送信", "2〜3営業日以内にメールでご返信", "日程調整・料金お振込み（¥3,000）", "ZoomまたはGoogle Meetで相談（30分）"].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#ccc", minWidth: 24 }}>0{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 300, paddingTop: 2, lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-main" onClick={() => setView("contact")}
              style={{ background: "#111", color: "#fff", border: "none", padding: "14px 36px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              相談する →
            </button>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {view === "profile" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>PROFILE</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 48, letterSpacing: 1 }}>プロフィール</h1>
            <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 52, marginBottom: 52, alignItems: "start" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 110, height: 110, background: "#f0f0f0", borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🏠</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>一条住まい相談</div>
                <div style={{ fontSize: 12, color: "#bbb", fontWeight: 300 }}>栃木県 那須塩原市</div>
              </div>
              <div>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444", marginBottom: 20 }}>
                  2022年に一条工務店（i-smart2）で35坪の注文住宅を建てました。家づくりの打ち合わせから引渡しまで約1年、たくさんの失敗と学びを経験しました。
                </p>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444" }}>
                  全館床暖房の実際の電気代、ロスガード90のメンテナンス、オプションで本当に良かったもの・後悔したもの——こういったリアルな情報を、これから建てる方に伝えたいと思ってこのサービスを始めました。
                </p>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, marginBottom: 20, letterSpacing: 1 }}>実績・経験</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec" }}>
              {[["建築モデル", "i-smart 2（アイスマート2）"], ["延床面積", "35坪（4LDK）"], ["入居", "2022年"], ["得意分野", "間取り・オプション選び・電気代の実績・メンテナンス費用"], ["相談実績", "累計10名以上"]].map(([label, val]) => (
                <div key={label} style={{ background: "#fff", padding: "18px 28px", display: "flex", gap: 32, alignItems: "baseline" }}>
                  <span style={{ fontSize: 11, color: "#bbb", minWidth: 90, fontWeight: 300, letterSpacing: 1, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 300 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== FAQ ===== */}
        {view === "faq" && (
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>FAQ</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 48, letterSpacing: 1 }}>よくある質問</h1>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {FAQS.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 16 }}>
                    <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.5 }}>{faq.q}</span>
                    <span style={{ fontSize: 20, color: "#ccc", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none", display: "block" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ paddingBottom: 24, fontSize: 14, color: "#666", lineHeight: 1.9, fontWeight: 300 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 52, padding: "32px", background: "#fafafa", border: "1px solid #ececec", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 20, fontWeight: 300 }}>他にご質問があればお気軽にどうぞ</p>
              <button className="btn-main" onClick={() => setView("contact")}
                style={{ background: "#111", color: "#fff", border: "none", padding: "13px 32px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                相談フォームへ →
              </button>
            </div>
          </div>
        )}

        {/* ===== CONTACT ===== */}
        {view === "contact" && (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>CONTACT</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 12, letterSpacing: 1 }}>相談フォーム</h1>
            <p style={{ fontSize: 14, color: "#888", fontWeight: 300, marginBottom: 44, lineHeight: 1.9 }}>お気軽にご相談ください。2〜3営業日以内にご返信します。<br />初回相談 30分 ¥3,000</p>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, marginBottom: 24, fontWeight: 300, color: "#111" }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 400, marginBottom: 12 }}>送信が完了しました</h3>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.9, fontWeight: 300, marginBottom: 32 }}>2〜3営業日以内にメールにてご連絡いたします。</p>
                <button onClick={() => setSubmitted(false)}
                  style={{ background: "none", border: "1px solid #ddd", padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#888" }}>
                  別の相談を送る
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[["name", "お名前 *", "text", "山田 太郎"], ["email", "メールアドレス *", "email", "example@gmail.com"]].map(([name, label, type, ph]) => (
                    <div key={name}>
                      <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>{label}</label>
                      <input name={name} value={form[name]} onChange={handleFormChange} type={type} placeholder={ph}
                        style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "none", fontWeight: 300 }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>電話番号（任意）</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} type="tel" placeholder="090-0000-0000"
                    style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "none", fontWeight: 300 }} />
                </div>
                <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                  {[["topic", "相談カテゴリ *", TOPICS], ["budget", "予算", BUDGETS], ["timeline", "検討時期", TIMELINES]].map(([name, label, opts]) => (
                    <div key={name}>
                      <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>{label}</label>
                      <select name={name} value={form[name]} onChange={handleFormChange}
                        style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 13, outline: "none", background: "none", fontWeight: 300, cursor: "pointer" }}>
                        <option value="">選択</option>
                        {opts.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>相談内容 *</label>
                  <textarea name="message" value={form.message} onChange={handleFormChange} placeholder="ご相談内容を自由にお書きください。"
                    style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "none", resize: "none", minHeight: 100, fontWeight: 300 }} />
                </div>
                <button onClick={handleSubmit} disabled={!form.name || !form.email || !form.topic || !form.message || sending}
                  className="btn-main"
                  style={{ background: (!form.name || !form.email || !form.topic || !form.message) ? "#e0e0e0" : "#111", color: (!form.name || !form.email || !form.topic || !form.message) ? "#aaa" : "#fff", border: "none", padding: "16px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>
                  {sending ? "送信中..." : "送信する →"}
                </button>
                <p style={{ fontSize: 11, color: "#ccc", textAlign: "center", fontWeight: 300 }}>※ いただいた情報はコンサルティング目的のみに使用します</p>
              </div>
            )}
          </div>
        )}

        {/* ===== ADMIN ===== */}
        {view === "admin" && !selected && (
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 10 }}>ADMIN</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, marginBottom: 32 }}>案件管理</h1>
            <div className="admin-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 28 }}>
              {[["総数", cases.length], ...STATUSES.map((s) => [s, counts[s]])].map(([label, val]) => (
                <div key={label} style={{ border: "1px solid #ececec", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300 }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#bbb", letterSpacing: 1, marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="検索..."
                style={{ border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", flex: 1, minWidth: 180, background: "none" }} />
              {["すべて", ...STATUSES].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{ border: `1px solid ${filterStatus === s ? "#111" : "#ddd"}`, background: filterStatus === s ? "#111" : "#fff", color: filterStatus === s ? "#fff" : "#888", padding: "5px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ border: "1px solid #ececec" }}>
              {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#ccc", fontSize: 14 }}>該当なし</div>}
              {filtered.map((c, i) => (
                <div key={c.id} className="case-row" onClick={() => setSelected(c)}
                  style={{ padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #ececec" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "#fff", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: "#bbb" }}>{c.topic}</span>
                      {c.budget && <span style={{ fontSize: 12, color: "#ccc" }}>{c.budget}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#ccc", fontWeight: 300 }}>{c.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: "#ccc" }}>{c.date}</span>
                    <span style={{ fontSize: 11, padding: "4px 12px", background: STATUS_COLORS[c.status].bg, color: STATUS_COLORS[c.status].text, border: `1px solid ${STATUS_COLORS[c.status].border}` }}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "admin" && selected && (
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 1.5rem" }}>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#bbb", fontFamily: "inherit", marginBottom: 24, padding: 0 }}>← 一覧に戻る</button>
            <div style={{ border: "1px solid #ececec", padding: "36px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300 }}>{selected.name}</h2>
                  <div style={{ fontSize: 11, color: "#ccc", marginTop: 4, fontWeight: 300, letterSpacing: 1 }}>{selected.date}</div>
                </div>
                <select value={selected.status} onChange={(e) => updateCase(selected.id, "status", e.target.value)}
                  style={{ border: `1px solid ${STATUS_COLORS[selected.status].border}`, background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text, padding: "6px 14px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                {[["メール", selected.email], ["電話", selected.phone || "—"], ["カテゴリ", selected.topic], ["予算", selected.budget || "—"], ["時期", selected.timeline || "—"]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: "#ccc", marginBottom: 5, letterSpacing: 1 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 300 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, color: "#ccc", marginBottom: 8, letterSpacing: 1 }}>相談内容</div>
                <div style={{ fontSize: 14, lineHeight: 1.9, color: "#444", fontWeight: 300, background: "#fafafa", padding: "16px 20px" }}>{selected.message}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#ccc", marginBottom: 8, letterSpacing: 1 }}>メモ</div>
                <textarea value={selected.memo} onChange={(e) => updateCase(selected.id, "memo", e.target.value)} placeholder="対応メモ..."
                  style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "none", resize: "none", minHeight: 80, fontWeight: 300 }} />
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {view !== "admin" && (
          <footer style={{ borderTop: "1px solid #ececec", padding: "3rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: 3, marginBottom: 10 }}>ICHIJO CONSULTING</div>
            <p style={{ fontSize: 11, color: "#ccc", fontWeight: 300 }}>© 2026 一条コンサル. All rights reserved.</p>
          </footer>
        )}
      </div>
    </div>
  );
}
