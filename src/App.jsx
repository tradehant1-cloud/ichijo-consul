import { useState, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1cWkXiCtMbzt9LG9CFgs2WxZ1JbL5ll7a1iS9bRpWpc3WNFBGGnIUxAb4c_jYrXroMw/exec";
const CALENDAR_URL = "https://calendar.app.google/o7mArhfZ9icHBu5b7";
const MEET_URL = "https://meet.google.com/mfn-xjkn-eqm";

const SERVICE_TYPES = ["家づくり相談", "トラブル相談", "調停相談", "外構相談", "株のお話"];
const TOPICS_BY_SERVICE = {
  "家づくり相談": ["間取り", "オプション", "見積もり", "土地・外構", "契約・手続き", "住み心地", "その他"],
  "トラブル相談": ["施工不具合", "アフターサービス", "営業対応", "近隣トラブル", "その他"],
  "調停相談": ["調停の始め方", "申立書の書き方", "当日の進め方", "和解交渉", "その他"],
  "外構相談": ["業者選び", "見積もり比較", "DIY相談", "トラブル対応", "その他"],
  "株のお話": ["投資の始め方", "NISAの仕組み", "株・投資信託の基礎", "口座開設の手順", "資産形成の考え方", "投資家との雑談", "その他"],
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
  { q: "相談料金はいつ支払いますか？", a: "日程確定後にPayPayにてお支払いをお願いします。PayPay IDは日程確定のメールにてご案内します。" },
  { q: "一条工務店以外の相談はできますか？", a: "現在は一条工務店専門のサービスとなっております。" },
];

export default function App() {
  const [view, setView] = useState("top");
  const [form, setForm] = useState({ name: "", email: "", phone: "", consultant: "", serviceType: "", topic: "", budget: "", timeline: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
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
    try {
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, date: new Date().toISOString().split("T")[0] }) });
    } catch (e) { console.error(e); }
    setSending(false);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", consultant: "", serviceType: "", topic: "", budget: "", timeline: "", message: "" });
  };

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

  const navItems = [["service", "サービス"], ["profile", "プロフィール"], ["faq", "よくある質問"]];

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
          </nav>
          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", fontSize: 20, cursor: "pointer", alignItems: "center", justifyContent: "center", width: 36, height: 36 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #ececec", padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20 }}>
            {navItems.map(([id, label]) => (
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
                  <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                    style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "16px 24px", fontSize: 14, fontFamily: "inherit", fontWeight: 500, letterSpacing: 1, textDecoration: "none", display: "block", textAlign: "center" }}>
                    📅 日程を予約する
                  </a>
                  <p style={{ fontSize: 11, color: "#5a7aaa", fontWeight: 300, textAlign: "center" }}>全サービス 30分 ¥3,000 / PayPay払い</p>
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
                    <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                      style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "15px 36px", fontSize: 14, fontFamily: "inherit", fontWeight: 500, textDecoration: "none", display: "block", textAlign: "center" }}>
                      📅 日程を予約する
                    </a>
                  </div>
                  <p style={{ marginTop: 16, fontSize: 12, color: "#aaa", fontWeight: 300 }}>全サービス 30分 ¥3,000 / PayPay払い</p>
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
                {["フォームからサービスを選んで内容を送信 または カレンダーで日程を直接予約", "2〜3営業日以内にメールでご返信・日程確認", "PayPayにてお支払い（¥3,000）※日程確定後にIDをご案内", "ZoomまたはGoogle Meetで相談（30分）"].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#ccc", minWidth: 24 }}>0{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 300, paddingTop: 2, lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "14px 36px", fontSize: 14, textDecoration: "none", fontFamily: "inherit", display: "inline-block", fontWeight: 500 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* 五十嵐 */}
              <div style={{ border: "1px solid #ececec", padding: "36px 32px" }}>
                <img src="https://placehold.co/80x80/3a4f7a/c9a84c?text=Photo" alt="五十嵐"
                  style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 16, display: "block" }} />
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>五十嵐（パパ）</div>
                <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 300, marginBottom: 20 }}>在宅ワーク / FP資格 / 個人投資家</div>
                <p style={{ fontSize: 14, lineHeight: 2, fontWeight: 300, color: "#555", marginBottom: 20 }}>
                  家づくりの打ち合わせから引渡しまで一人で完遂。引渡し後に施工不具合が発覚し、弁護士なしで調停を申し立て和解を勝ち取りました。FP資格保有の投資家で、投資で貯めた資金でI-CUBEを建てました。
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec" }}>
                  {[["モデル", "I-CUBE 33坪 2025年入居"], ["調停", "弁護士なし → 和解勝ち取り"], ["外構", "100坪DIY中"], ["資格", "FP資格 / 個人投資家"]].map(([l, v]) => (
                    <div key={l} style={{ background: "#fff", padding: "10px 16px", display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 11, color: "#bbb", minWidth: 48, flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 300 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* ママ */}
              <div style={{ border: "1px solid #ececec", padding: "36px 32px" }}>
                <img src="https://placehold.co/80x80/3a4f7a/e8c96d?text=Photo" alt="ママ"
                  style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 16, display: "block" }} />
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>ママ</div>
                <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 300, marginBottom: 20 }}>主婦 / 4歳・6歳子育て中</div>
                <p style={{ fontSize: 14, lineHeight: 2, fontWeight: 300, color: "#555", marginBottom: 20 }}>
                  パートをしながら2人の子どもを育てる普通のママ。キッチンや家事動線、子育てしやすい間取りにこだわりました。プロではないからこそ、同じ目線でリアルな感想をお伝えします。
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#ececec" }}>
                  {[["キッチン", "使い勝手・収納・動線"], ["家事動線", "洗濯・掃除がラクな間取り"], ["子育て", "子どもがいる家ならではの視点"], ["相談", "気軽に何でも聞いてOK"]].map(([l, v]) => (
                    <div key={l} style={{ background: "#fff", padding: "10px 16px", display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 11, color: "#bbb", minWidth: 48, flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 300 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                    <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.5, color: "#333" }}>{faq.q}</span>
                    <span style={{ fontSize: 20, color: "#c9a84c", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none", display: "block" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ paddingBottom: 24, fontSize: 14, color: "#555", lineHeight: 1.9, fontWeight: 300 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 52, padding: "32px", background: "#f8f6f1", border: "1px solid #e8e4da", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 20, fontWeight: 300 }}>他にご質問があればお気軽にどうぞ</p>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                style={{ background: "#c9a84c", color: "#1a2744", border: "none", padding: "14px 32px", fontSize: 14, textDecoration: "none", fontFamily: "inherit", display: "inline-block", fontWeight: 500 }}>
                📅 日程を予約する
              </a>
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
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>2〜3営業日以内にメールにてご連絡いたします。</p>
                <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.9, fontWeight: 300, marginBottom: 32 }}>
                  日程確定後、PayPay IDをメールにてご案内します。<br />相談前日までにお支払いをお願いします（¥3,000）。
                </p>
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

        <footer style={{ borderTop: "1px solid #ececec", padding: "3rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, letterSpacing: 3, marginBottom: 10 }}>ICHIJO CONSULTING</div>
            <p style={{ fontSize: 11, color: "#ccc", fontWeight: 300 }}>© 2026 五十嵐 / 一条コンサル. All rights reserved.</p>
          </footer>
      </div>
    </div>
  );
}
