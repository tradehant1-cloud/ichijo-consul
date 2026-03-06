import { useState, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDHjUqwrJ_T1ocDNnSVo3kP--vJT8fr3UAsTDREsxfkddIxROFTFy_nx9GJomp5Vxyew/exec";
const CALENDAR_URL = "https://calendar.app.google/o7mArhfZ9icHBu5b7";

const INITIAL_CASES = [
  { id: 1, name: "田中 花子", email: "tanaka@example.com", phone: "090-1234-5678", serviceType: "家づくり相談", topic: "間取り", budget: "3500万円台", timeline: "2026年中", message: "アイキューブで30坪前後を検討中です。", status: "新規", date: "2026-03-01", memo: "" },
  { id: 2, name: "鈴木 一郎", email: "suzuki@example.com", phone: "080-9876-5432", serviceType: "トラブル相談", topic: "不具合対応", budget: "", timeline: "", message: "引渡し後に床の不具合が発覚しました。対応方法を相談したいです。", status: "対応中", date: "2026-02-25", memo: "3/5にZoom予定" },
];

const SERVICE_TYPES = ["家づくり相談", "トラブル相談", "調停相談", "外構相談", "株のお話"];
const TOPICS_BY_SERVICE = {
  "家づくり相談": ["間取り", "オプション", "見積もり", "土地・外構", "契約・手続き", "住み心地", "その他"],
  "トラブル相談": ["施工不具合", "アフターサービス", "営業対応", "近隣トラブル", "その他"],
  "調停相談": ["調停の始め方", "申立書の書き方", "当日の進め方", "和解交渉", "その他"],
  "外構相談": ["業者選び", "見積もり比較", "DIY相談", "トラブル対応", "その他"],
  "株のお話": ["投資の始め方", "NISAの仕組み", "株・投資信託の基礎", "口座開設の手順", "資産形成の考え方", "投資家との雑談", "その他"],
};
const STATUSES = ["新規", "対応中", "完了", "保留"];
const STATUS_COLORS = {
  新規: { bg: "#f0f0f0", text: "#111", border: "#ccc" },
  対応中: { bg: "#111", text: "#fff", border: "#111" },
  完了: { bg: "#e8e8e8", text: "#444", border: "#bbb" },
  保留: { bg: "#fff", text: "#999", border: "#ddd" },
};
const BUDGETS = ["2000万円台", "3000万円台", "3500万円台", "4000万円台", "4500万円以上", "未定", "該当なし"];
const TIMELINES = ["3ヶ月以内", "半年以内", "1年以内", "2026年中", "2027年以降", "未定", "該当なし"];

const SERVICES = [
  {
    id: "homebuilding",
    num: "01",
    title: "家づくり相談",
    sub: "HOME BUILDING",
    icon: "🏠",
    tagline: "後悔しない家づくりを、経験者と一緒に。",
    desc: "間取り・オプション・見積もり・契約など、一条工務店での家づくり全般を相談できます。ZoomではスマホのカメラでI-CUBEの実際の室内・設備をリアルタイムでご案内します。",
    points: ["間取り・動線・収納のアドバイス", "本当に必要なオプションの仕分け", "見積もりの見方・交渉ポイント", "スマホカメラで実際の我が家をZoomご案内"],
    price: "3,000円 / 30分",
  },
  {
    id: "trouble",
    num: "02",
    title: "トラブル相談",
    sub: "TROUBLE SUPPORT",
    icon: "⚖️",
    tagline: "不具合・対応不備。一人で抱え込まないで。",
    desc: "施工不具合や一条工務店との対応トラブルに悩む方へ。実際に不具合を発見し、一条工務店との調停で和解を勝ち取った経験をもとに、具体的な対処法をアドバイスします。",
    points: ["不具合の記録・証拠の残し方", "一条工務店への効果的な交渉術", "調停・法的手段の検討", "実体験をもとにした具体的アドバイス"],
    price: "3,000円 / 30分",
  },
  {
    id: "mediation",
    num: "03",
    title: "調停相談",
    sub: "MEDIATION GUIDE",
    icon: "📋",
    tagline: "弁護士なしで調停を戦い、和解を勝ち取った経験者が教える。",
    desc: "一条工務店との不具合トラブルを、弁護士を使わず自力で調停申立を行い、和解を勝ち取った経験をもとに、調停の始め方から当日の進め方まで丁寧にサポートします。",
    points: ["調停申立書の書き方", "必要書類・証拠の準備方法", "調停当日の立ち振る舞い", "和解交渉のポイント"],
    price: "3,000円 / 30分",
  },
  {
    id: "exterior",
    num: "04",
    title: "外構相談",
    sub: "EXTERIOR DESIGN",
    icon: "🌿",
    tagline: "業者選びからDIYまで。100坪の外構を自分で作り上げた経験者が教える。",
    desc: "外構業者の探し方・見積もり比較・DIYでできること・トラブル対応まで、100坪の土地の外構を自分で手がけた経験をもとにアドバイスします。今もDIYで外構を作り続けています。",
    points: ["外構業者の選び方・比較ポイント", "DIYでコストを抑える方法", "一条工務店との外構工事の調整", "外構トラブルの対処法"],
    price: "3,000円 / 30分",
  },
  {
    id: "stock",
    num: "05",
    title: "株のお話",
    sub: "INVESTMENT TALK",
    icon: "📈",
    tagline: "FP資格保有の投資家と、投資の基礎や資産形成について気軽に話しませんか。",
    desc: "FP資格を持つ個人投資家として、投資の始め方・NISAの仕組み・株や投資信託の基礎知識などをわかりやすくお伝えします。投資で得た資金でマイホームを購入した経験も交えながら、資産形成の考え方を一緒に整理しましょう。※投資助言・銘柄推奨は行いません。",
    points: ["投資の始め方・口座開設の手順", "NISA・株・投資信託の基礎知識", "資産形成の考え方", "投資家との気軽な雑談"],
    price: "3,000円 / 30分",
  },
];

const FAQS = [
  { q: "どんな人に向けたサービスですか？", a: "一条工務店での家づくりを検討している方、現在打ち合わせ中の方、引渡し後にトラブルが発生した方などが主な対象です。" },
  { q: "相談はどんな形式ですか？", a: "ZoomまたはGoogle Meetでのオンライン相談です。家づくり相談ではスマホカメラで実際のI-CUBEの室内をリアルタイムでご案内することもできます。" },
  { q: "調停相談は弁護士の代わりになりますか？", a: "法律の専門家ではありませんが、実際に一人で調停を行い和解した経験をもとにアドバイスします。法的判断が必要な場合は弁護士への相談をお勧めします。" },
  { q: "相談料金はいつ支払いますか？", a: "相談確定後にお振込み先をご案内します。事前払いとなります。" },
  { q: "一条工務店以外の相談はできますか？", a: "現在は一条工務店専門のサービスとなっております。" },
];

export default function App() {
  const [view, setView] = useState("top");
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", consultant: "", serviceType: "", topic: "", budget: "", timeline: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "serviceType") setForm({ ...form, serviceType: value, topic: "" });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.serviceType || !form.message) return;
    setSending(true);
    const newCase = { id: Date.now(), ...form, status: "新規", date: new Date().toISOString().split("T")[0], memo: "" };
    setCases((prev) => [newCase, ...prev]);
    try {
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, date: newCase.date }) });
    } catch (e) { console.error(e); }
    setSending(false);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", consultant: "", serviceType: "", topic: "", budget: "", timeline: "", message: "" });
  };

  const updateCase = (id, field, value) => {
    setCases(cases.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    if (selected?.id === id) setSelected({ ...selected, [field]: value });
  };

  const filtered = cases.filter((c) => {
    const matchStatus = filterStatus === "すべて" || c.status === filterStatus;
    const matchSearch = search === "" || c.name.includes(search) || (c.topic || "").includes(search) || c.email.includes(search) || (c.serviceType || "").includes(search);
    return matchStatus && matchSearch;
  });

  const counts = STATUSES.reduce((acc, s) => { acc[s] = cases.filter((c) => c.status === s).length; return acc; }, {});

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Noto+Sans+JP:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { overflow-x: hidden; max-width: 100%; font-variant: normal; text-transform: none; }
    :root {
      --navy: #1a2744;
      --navy-light: #243358;
      --gold: #c9a84c;
      --gold-light: #e8c96d;
      --off-white: #f8f6f1;
    }
    .fade-in { animation: fadeIn 0.7s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .svc-card { transition: all 0.3s ease; cursor: pointer; }
    .svc-card:hover { background: var(--navy) !important; color: #fff !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,39,68,0.15); }
    .svc-card:hover p, .svc-card:hover .svc-sub { color: #aaa !important; }
    .svc-card:hover .svc-price-tag { background: var(--navy-light) !important; color: var(--gold-light) !important; }
    .nav-link { transition: opacity 0.2s; cursor: pointer; }
    .nav-link:hover { opacity: 0.4; }
    .btn-main { transition: background 0.2s; }
    .btn-main:hover { background: var(--navy-light) !important; }
    .btn-cal:hover { background: #f0ede6 !important; }
    .faq-item { border-bottom: 1px solid #e8e4da; }
    .case-row:hover { background: var(--off-white) !important; }
    @media (max-width: 768px) {
      .hero-title { font-size: 26px !important; line-height: 1.5 !important; }
      .services-grid { grid-template-columns: 1fr !important; }
      .profile-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      .form-row-2 { grid-template-columns: 1fr !important; }
      .form-row-3 { grid-template-columns: 1fr !important; }
      .nav-desktop { display: none !important; }
      .mobile-btn { display: flex !important; }
      .stats-row { grid-template-columns: 1fr 1fr !important; }
      .admin-stats { grid-template-columns: 1fr 1fr !important; }
      .svc-detail-grid { grid-template-columns: 1fr !important; }
      .cal-banner { flex-direction: column !important; text-align: center !important; gap: 16px !important; }
    }
  `;

  const navItems = [["service", "サービス"], ["profile", "プロフィール"], ["faq", "よくある質問"], ["contact", "相談する"]];

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#fff", color: "#111", minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>
      <style>{css}</style>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(26,39,68,0.97)", borderBottom: "1px solid #243358", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => { setView("top"); setMenuOpen(false); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, letterSpacing: 3, color: "#fff" }}>ICHIJO</span>
            <span style={{ fontSize: 9, color: "#c9a84c", letterSpacing: 2, fontWeight: 300 }}>CONSULTING</span>
          </div>
          <nav className="nav-desktop" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {navItems.map(([id, label]) => (
              <span key={id} className="nav-link" onClick={() => { setView(id); setMenuOpen(false); }}
                style={{ fontSize: 13, fontWeight: view === id ? 500 : 300, color: view === id ? "#c9a84c" : "#ccc", borderBottom: view === id ? "1px solid #c9a84c" : "1px solid transparent", paddingBottom: 2 }}>
                {label}
              </span>
            ))}
            <span className="nav-link" onClick={() => { setView("admin"); setMenuOpen(false); }} style={{ fontSize: 11, color: "#555", letterSpacing: 1 }}>管理</span>
          </nav>
          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)}
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
            <section style={{ background: "#1a2744", padding: "2.5rem 3rem", borderBottom: "1px solid #243358" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 24 }}>
                {/* 左側 */}
                <div className="fade-in" style={{ flex: 2 }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", marginBottom: 12, fontWeight: 300 }}>ONE-ON-ONE CONSULTING</p>
                  <h1 className="hero-title" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 36, fontWeight: 300, lineHeight: 1.6, marginBottom: 16, letterSpacing: 0, color: "#fff" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: 2, color: "#e8c96d", fontSize: 32 }}>一条工務店 施主</span><br />
                    <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 400, fontSize: 34, color: "#fff" }}>投資家パパ × 子育てママ</span>
                  </h1>
                  <p style={{ fontSize: 14, color: "#aab8d4", fontWeight: 300, lineHeight: 1.9, marginBottom: 16 }}>
                    調停で和解を勝ち取り、FP資格を持つ投資家。<br />投資で貯めたお金でI-CUBEを建てた経験者が、<br />家づくり・トラブル・お金のことをサポートします。
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  </div>
                </div>
                {/* 中央：プロフィールカード2人 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* 五十嵐 */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px", border: "1px solid #3a4f7a", background: "#243358" }}>
                    <img src="https://placehold.co/60x60/3a4f7a/c9a84c?text=Photo" alt="五十嵐"
                      style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: "#fff" }}>五十嵐</div>
                      <div style={{ fontSize: 10, color: "#c9a84c", fontWeight: 300, marginBottom: 4 }}>パパ / FP資格 / 投資家</div>
                      <div style={{ fontSize: 10, color: "#aab8d4", fontWeight: 300, lineHeight: 1.6 }}>家づくり・トラブル・調停・外構・株</div>
                    </div>
                  </div>
                  {/* ママ */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px", border: "1px solid #3a4f7a", background: "#243358" }}>
                    <img src="https://placehold.co/60x60/3a4f7a/e8c96d?text=Photo" alt="ママ"
                      style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, color: "#fff" }}>ママ</div>
                      <div style={{ fontSize: 10, color: "#c9a84c", fontWeight: 300, marginBottom: 4 }}>主婦 / 4歳・6歳子育て中</div>
                      <div style={{ fontSize: 10, color: "#aab8d4", fontWeight: 300, lineHeight: 1.6 }}>キッチン・家事動線・子育て目線</div>
                    </div>
                  </div>
                  <span onClick={() => setView("profile")} style={{ fontSize: 11, color: "#c9a84c", borderBottom: "1px solid #c9a84c", cursor: "pointer", fontWeight: 300, textAlign: "center" }}>プロフィール詳細 →</span>
                </div>
                {/* 右側 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, alignItems: "stretch" }}>
                  <button className="btn-main" onClick={() => setView("contact")}
                    style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "16px 24px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, letterSpacing: 1 }}>
                    相談フォームへ
                  </button>
                  <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                    style={{ background: "transparent", color: "#fff", border: "1px solid #3a4f7a", padding: "16px 24px", fontSize: 14, fontFamily: "inherit", fontWeight: 300, textDecoration: "none", display: "block", textAlign: "center" }}>
                    📅 日程を予約する
                  </a>
                  <p style={{ fontSize: 11, color: "#5a7aaa", fontWeight: 300, textAlign: "center" }}>全サービス 30分 ¥3,000</p>
                </div>
              </div>
            </section>

            {/* Services */}
            <section style={{ padding: "2rem 1.5rem 0", borderBottom: "1px solid #e8e4da", background: "#f8f6f1" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, background: "#e8e4da", border: "1px solid #e8e4da" }}>
                  {SERVICES.map((s) => (
                    <div key={s.id} className="svc-card" onClick={() => setView("service")} style={{ background: "#fff", padding: "20px 24px", borderTop: "3px solid #c9a84c" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{s.title}</h3>
                      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, fontWeight: 300, marginBottom: 12 }}>{s.tagline}</p>
                      <span className="svc-price-tag" style={{ fontSize: 12, background: "#f5f5f5", padding: "3px 10px" }}>{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Calendar Banner */}
            <section style={{ padding: "3rem 1.5rem", background: "#1a2744", borderBottom: "1px solid #243358" }}>
              <div className="cal-banner" style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 4, color: "#c9a84c", marginBottom: 8 }}>BOOKING</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: "#fff", marginBottom: 6 }}>Googleカレンダーで日程予約</h3>
                  <p style={{ fontSize: 13, color: "#aab8d4", fontWeight: 300 }}>空き状況をリアルタイムで確認して、好きな時間を予約できます。</p>
                </div>
                <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                  className="btn-cal"
                  style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "14px 32px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, display: "inline-block", transition: "background 0.2s" }}>
                  📅 空き日程を確認する →
                </a>
              </div>
            </section>

            {/* Story + CTA 左右レイアウト */}
            <section style={{ borderBottom: "1px solid #e8e4da", background: "#f8f6f1" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", minHeight: 400 }}>
                {/* 左：ストーリー */}
                <div style={{ flex: 1, padding: "4rem 3rem", background: "#f8f6f1", borderRight: "1px solid #e8e4da" }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", marginBottom: 14, fontWeight: 300 }}>STORY</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, marginBottom: 28, letterSpacing: 1 }}>なぜこのサービスを始めたか</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[
                      ["在宅ワークのパパが、一人で家づくりを完遂", "共働きで忙しい中、家づくりの打ち合わせから引渡しまで、ほぼ一人でこなしました。I-CUBEの特性を活かした間取りや、オプション選びのノウハウを、これから建てる方に伝えたいと思っています。"],
                      ["引渡し後に不具合が発覚。一条工務店と対峙した", "入居後、施工不具合が発覚。一条工務店との交渉が難航し、最終的に弁護士なしで調停を申し立てました。"],
                      ["一人で調停を戦い、和解を勝ち取った", "慣れない法的手続きも、準備と記録を徹底することで乗り越えました。同じ境遇の方に、その経験を活かしたいと思っています。"],
                    ].map(([title, text], i) => (
                      <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#e0e0e0", fontWeight: 300, lineHeight: 1, minWidth: 28 }}>0{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{title}</div>
                          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8, fontWeight: 300 }}>{text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 右：CTA */}
                <div style={{ flex: 1, padding: "4rem 3rem", background: "#f0ede6", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                  <p style={{ fontSize: 10, letterSpacing: 5, color: "#c9a84c", marginBottom: 16 }}>FIRST STEP</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 300, marginBottom: 16, letterSpacing: 1, color: "#1a2744" }}>まずはお気軽に<br />相談から</h2>
                  <p style={{ fontSize: 14, color: "#666", fontWeight: 300, marginBottom: 36, lineHeight: 1.9 }}>フォームから内容を送るか、<br />カレンダーで直接日程を予約してください。</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 260 }}>
                    <button className="btn-main" onClick={() => setView("contact")}
                      style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "15px 36px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                      相談フォームへ →
                    </button>
                    <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                      style={{ background: "transparent", color: "#1a2744", border: "1px solid #1a2744", padding: "15px 36px", fontSize: 14, fontFamily: "inherit", fontWeight: 300, textDecoration: "none", display: "block", textAlign: "center" }}>
                      📅 日程を予約する
                    </a>
                  </div>
                  <p style={{ marginTop: 16, fontSize: 12, color: "#aaa", fontWeight: 300 }}>全サービス 30分 ¥3,000</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== SERVICE ===== */}
        {view === "service" && (
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>SERVICES</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 52, letterSpacing: 1 }}>サービス内容・料金</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec", marginBottom: 40 }}>
              {SERVICES.map((s) => (
                <div key={s.id} style={{ background: "#fff", padding: "40px 36px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 32 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#ccc", letterSpacing: 2, marginBottom: 4 }}>{s.num} — {s.sub}</div>
                        <h3 style={{ fontSize: 20, fontWeight: 500 }}>{s.title}</h3>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300 }}>¥3,000</div>
                      <div style={{ fontSize: 11, color: "#bbb", letterSpacing: 1 }}>30分 / 回</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.9, fontWeight: 300, marginBottom: 20 }}>{s.desc}</p>
                  <div className="svc-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {s.points.map((pt, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#666", fontWeight: 300, display: "flex", gap: 8 }}>
                        <span style={{ color: "#ccc" }}>—</span>{pt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar CTA */}
            <div style={{ background: "#fafafa", border: "1px solid #ececec", padding: "28px 32px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>📅 Googleカレンダーで日程予約</div>
                <div style={{ fontSize: 13, color: "#888", fontWeight: 300 }}>空き状況をリアルタイムで確認して予約できます</div>
              </div>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                style={{ background: "#111", color: "#fff", padding: "12px 28px", fontSize: 13, textDecoration: "none", fontFamily: "inherit", fontWeight: 400, display: "inline-block" }}>
                空き日程を確認する →
              </a>
            </div>

            <div style={{ background: "#fafafa", border: "1px solid #ececec", padding: "28px 32px", marginBottom: 40 }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 20, letterSpacing: 1 }}>相談の流れ</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["フォームからサービスを選んで内容を送信 または カレンダーで日程を直接予約", "2〜3営業日以内にメールでご返信・日程確認", "料金お振込み（¥3,000）", "ZoomまたはGoogle Meetで相談（30分）"].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#ccc", minWidth: 24 }}>0{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 300, paddingTop: 2, lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-main" onClick={() => setView("contact")}
                style={{ background: "#111", color: "#fff", border: "none", padding: "14px 36px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                相談フォームへ →
              </button>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                style={{ background: "#fff", color: "#111", border: "1px solid #ddd", padding: "14px 36px", fontSize: 14, textDecoration: "none", fontFamily: "inherit", display: "inline-block" }}>
                📅 日程を予約する
              </a>
            </div>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {view === "profile" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>PROFILE</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 48, letterSpacing: 1 }}>プロフィール</h1>

            {/* 五十嵐 */}
            <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 52, marginBottom: 52, alignItems: "start" }}>
              <div style={{ textAlign: "center" }}>
                <img src="https://placehold.co/110x110/3a4f7a/c9a84c?text=Photo" alt="五十嵐"
                  style={{ width: 110, height: 110, borderRadius: "50%", margin: "0 auto 16px", display: "block", objectFit: "cover" }} />
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>五十嵐</div>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 300, background: "#f5f5f5", padding: "4px 10px", display: "inline-block", letterSpacing: 1 }}>在宅ワーク / パパ</div>
              </div>
              <div>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444", marginBottom: 20 }}>
                  在宅ワークをしながら、家づくりの打ち合わせから引渡しまでをほぼ一人でこなしました。2025年に一条工務店（I-CUBE）で33坪の注文住宅を建て、現在も実際に住んでいます。
                </p>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444", marginBottom: 20 }}>
                  引渡し後に施工不具合が発覚し、一条工務店との交渉が難航。弁護士を使わず自力で調停を申し立て、和解を勝ち取りました。
                </p>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444" }}>
                  FP資格を持つ個人投資家としても活動しており、投資で貯めた資金でマイホームを購入しました。
                </p>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, marginBottom: 20, letterSpacing: 1 }}>実績・経験</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec", marginBottom: 64 }}>
              {[
                ["建築モデル", "I-CUBE（アイキューブ）"],
                ["延床面積", "33坪（4LDK）"],
                ["土地面積", "100坪"],
                ["入居", "2025年"],
                ["家づくり", "打ち合わせから引渡しまで一人で完遂"],
                ["トラブル対応", "施工不具合を発見・記録・交渉"],
                ["調停実績", "弁護士なしで調停申立 → 和解勝ち取り"],
                ["資格", "FP資格保有 / 個人投資家"],
                ["外構", "100坪の土地をDIY中・業者選び・トラブル解決経験あり"],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "#fff", padding: "18px 28px", display: "flex", gap: 32, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#bbb", minWidth: 90, fontWeight: 300, letterSpacing: 1, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 300 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* ママ */}
            <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 52, marginBottom: 52, alignItems: "start" }}>
              <div style={{ textAlign: "center" }}>
                <img src="https://placehold.co/110x110/3a4f7a/e8c96d?text=Photo" alt="ママ"
                  style={{ width: 110, height: 110, borderRadius: "50%", margin: "0 auto 16px", display: "block", objectFit: "cover" }} />
                <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>ママ</div>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 300, background: "#f5f5f5", padding: "4px 10px", display: "inline-block", letterSpacing: 1 }}>主婦 / 子育て中</div>
              </div>
              <div>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444", marginBottom: 20 }}>
                  4歳と6歳の子どもを育てながら、パートをしている普通のママです。
                </p>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444", marginBottom: 20 }}>
                  家づくりでは主にキッチンや家事動線、子育てしやすい間取りにこだわりました。プロではないからこそ、同じ目線でリアルな感想をお伝えできます。
                </p>
                <p style={{ fontSize: 15, lineHeight: 2.1, fontWeight: 300, color: "#444" }}>
                  「こんなこと聞いていいのかな」と思うような些細なことでも、気軽に相談してください😊
                </p>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, marginBottom: 20, letterSpacing: 1 }}>得意な相談</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec", marginBottom: 52 }}>
              {[
                ["キッチン", "I-CUBEのキッチンの使い勝手・収納・動線"],
                ["家事動線", "洗濯・掃除・料理がラクになる間取りのポイント"],
                ["子育て目線", "子どもがいる家庭ならではの間取りや設備選び"],
                ["主婦目線", "毎日使う場所のリアルな感想"],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "#fff", padding: "18px 28px", display: "flex", gap: 32, alignItems: "baseline", flexWrap: "wrap" }}>
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
            <div>
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
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-main" onClick={() => setView("contact")}
                  style={{ background: "#111", color: "#fff", border: "none", padding: "13px 28px", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  相談フォームへ →
                </button>
                <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                  style={{ background: "#fff", color: "#111", border: "1px solid #ddd", padding: "13px 28px", fontSize: 14, textDecoration: "none", fontFamily: "inherit", display: "inline-block" }}>
                  📅 日程を予約する
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===== CONTACT ===== */}
        {view === "contact" && (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 1.5rem" }}>
            <p style={{ fontSize: 10, letterSpacing: 5, color: "#bbb", marginBottom: 14 }}>CONTACT</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, marginBottom: 12, letterSpacing: 1 }}>相談フォーム</h1>
            <p style={{ fontSize: 14, color: "#888", fontWeight: 300, marginBottom: 24, lineHeight: 1.9 }}>
              お気軽にご相談ください。2〜3営業日以内にご返信します。<br />全サービス 30分 ¥3,000
            </p>

            {/* Calendar link */}
            <div style={{ background: "#fafafa", border: "1px solid #ececec", padding: "16px 20px", marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 13, color: "#666", fontWeight: 300 }}>先に日程を決めたい方はこちら</div>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                style={{ fontSize: 13, color: "#111", fontWeight: 400, textDecoration: "none", borderBottom: "1px solid #111" }}>
                📅 Googleカレンダーで予約 →
              </a>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, marginBottom: 24, fontWeight: 300 }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 400, marginBottom: 12 }}>送信が完了しました</h3>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.9, fontWeight: 300, marginBottom: 32 }}>2〜3営業日以内にメールにてご連絡いたします。</p>
                <button onClick={() => setSubmitted(false)}
                  style={{ background: "none", border: "1px solid #ddd", padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#888" }}>
                  別の相談を送る
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
                <div>
                  <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 12, letterSpacing: 1 }}>相談相手を選ぶ *</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["五十嵐", "家づくり・トラブル・調停・外構・株"], ["ママ", "キッチン・家事動線・子育て目線"]].map(([name, desc]) => (
                      <button key={name} onClick={() => handleFormChange({ target: { name: "consultant", value: name } })}
                        style={{ flex: 1, border: `1px solid ${form.consultant === name ? "#1a2744" : "#ddd"}`, background: form.consultant === name ? "#1a2744" : "#fff", color: form.consultant === name ? "#fff" : "#888", padding: "12px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, transition: "all 0.15s", textAlign: "left" }}>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>{name}</div>
                        <div style={{ fontSize: 11, opacity: 0.7 }}>{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 12, letterSpacing: 1 }}>相談サービス *</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SERVICE_TYPES.map((s) => (
                      <button key={s} onClick={() => handleFormChange({ target: { name: "serviceType", value: s } })}
                        style={{ border: `1px solid ${form.serviceType === s ? "#111" : "#ddd"}`, background: form.serviceType === s ? "#111" : "#fff", color: form.serviceType === s ? "#fff" : "#888", padding: "8px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, transition: "all 0.15s" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {form.serviceType && (
                  <div className="form-row-3" style={{ display: "grid", gridTemplateColumns: form.serviceType === "家づくり相談" ? "1fr 1fr 1fr" : "1fr", gap: 20 }}>
                    <div>
                      <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>相談カテゴリ</label>
                      <select name="topic" value={form.topic} onChange={handleFormChange}
                        style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 13, outline: "none", background: "none", fontWeight: 300, cursor: "pointer" }}>
                        <option value="">選択</option>
                        {(TOPICS_BY_SERVICE[form.serviceType] || []).map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    {form.serviceType === "家づくり相談" && (
                      <>
                        <div>
                          <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>予算</label>
                          <select name="budget" value={form.budget} onChange={handleFormChange}
                            style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 13, outline: "none", background: "none", fontWeight: 300 }}>
                            <option value="">選択</option>
                            {BUDGETS.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>検討時期</label>
                          <select name="timeline" value={form.timeline} onChange={handleFormChange}
                            style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 13, outline: "none", background: "none", fontWeight: 300 }}>
                            <option value="">選択</option>
                            {TIMELINES.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 11, color: "#bbb", display: "block", marginBottom: 10, letterSpacing: 1 }}>相談内容 *</label>
                  <textarea name="message" value={form.message} onChange={handleFormChange}
                    placeholder={form.serviceType === "調停相談" ? "調停の状況や困っていることをご記入ください。" : form.serviceType === "トラブル相談" ? "不具合の内容や現在の状況をご記入ください。" : "ご相談内容を自由にお書きください。"}
                    style={{ width: "100%", border: "none", borderBottom: "1px solid #ddd", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "none", resize: "none", minHeight: 100, fontWeight: 300 }} />
                </div>
                <button onClick={handleSubmit} disabled={!form.name || !form.email || !form.serviceType || !form.message || sending}
                  className="btn-main"
                  style={{ background: (!form.name || !form.email || !form.serviceType || !form.message) ? "#e0e0e0" : "#111", color: (!form.name || !form.email || !form.serviceType || !form.message) ? "#aaa" : "#fff", border: "none", padding: "16px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}>
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
                      {c.serviceType && <span style={{ fontSize: 11, border: "1px solid #ececec", padding: "2px 8px", color: "#888" }}>{c.serviceType}</span>}
                      {c.topic && <span style={{ fontSize: 12, color: "#bbb" }}>{c.topic}</span>}
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
                  <div style={{ fontSize: 11, color: "#ccc", marginTop: 4, fontWeight: 300 }}>{selected.date}{selected.serviceType && ` — ${selected.serviceType}`}</div>
                </div>
                <select value={selected.status} onChange={(e) => updateCase(selected.id, "status", e.target.value)}
                  style={{ border: `1px solid ${STATUS_COLORS[selected.status].border}`, background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text, padding: "6px 14px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                {[["メール", selected.email], ["電話", selected.phone || "—"], ["サービス", selected.serviceType || "—"], ["カテゴリ", selected.topic || "—"], ["予算", selected.budget || "—"], ["時期", selected.timeline || "—"]].map(([label, val]) => (
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

        {view !== "admin" && (
          <footer style={{ borderTop: "1px solid #ececec", padding: "3rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: 3, marginBottom: 10 }}>ICHIJO CONSULTING</div>
            <p style={{ fontSize: 11, color: "#ccc", fontWeight: 300 }}>© 2026 五十嵐 / 一条コンサル. All rights reserved.</p>
          </footer>
        )}
      </div>
    </div>
  );
}
