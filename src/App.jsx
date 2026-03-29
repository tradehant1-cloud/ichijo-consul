import { useState, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1cWkXiCtMbzt9LG9CFgs2WxZ1JbL5ll7a1iS9bRpWpc3WNFBGGnIUxAb4c_jYrXroMw/exec";
const STRIPE_URL = "https://buy.stripe.com/test_4gM9AS7nw5Ii9Ew5HZ33W00"; // 本番時はURLを変更
const INSTAGRAM_ICON = "data:image/png;base64,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";
const INSTAGRAM_URL = "https://www.instagram.com/"; // ← 開設後にURLを変更してください
const CALENDAR_URL = "https://calendar.app.google/o7mArhfZ9icHBu5b7";
const MEET_URL = "https://meet.google.com/mfn-xjkn-eqm";

const SERVICE_TYPES = ["家づくり相談", "トラブル相談", "調停・訴訟相談", "外構相談", "株の始め方相談", "NISA・株主優待相談", "照明計画相談", "壁紙・クロス計画相談"];
const TOPICS_BY_SERVICE = {
  "家づくり相談": ["間取り", "オプション", "見積もり", "土地・外構", "契約・手続き", "住み心地", "その他"],
  "トラブル相談": ["施工不具合", "アフターサービス", "営業対応", "近隣トラブル", "その他"],
  "調停・訴訟相談": ["調停の始め方", "申立書の書き方", "当日の進め方", "和解交渉", "その他"],
  "外構相談": ["業者選び", "見積もり比較", "DIY相談", "トラブル対応", "その他"],
  "株の始め方相談": ["口座開設の手順", "証券会社の選び方", "最初の一歩の考え方", "その他"],
  "NISA・株主優待相談": ["NISAの使い方", "つみたて投資枠・成長投資枠", "株主優待の仕組み", "クロス取引の基本", "その他"],
};
const BUDGETS = ["2000万円台", "3000万円台", "3500万円台", "4000万円台", "4500万円以上", "未定", "該当なし"];
const TIMELINES = ["3ヶ月以内", "半年以内", "1年以内", "2026年中", "2027年以降", "未定", "該当なし"];

const SERVICES = [
  {
    id: "homebuilding", num: "01", title: "家づくり相談", sub: "HOME BUILDING", icon: "🏠",
    tagline: "後悔しない家づくりを、経験者と一緒に。",
    desc: "忖度なし。我が家をまるごと見せながら、本音でお答えします。WEB入居宅訪問はテンプレ質問が多く聞きたいことが聞けなかったり、細かい部分はわからなかったり、営業さんの前では聞けないことも多いですよね。マンツーマンだから、何でも聞いてください。間取り・オプション・見積もり・契約など、一条工務店での家づくり全般を相談できます。",
    points: ["間取り・動線・収納のアドバイス", "本当に必要なオプションの仕分け", "見積もりの見方・交渉ポイント", "スマホカメラで実際の我が家をZoomご案内"],
  },
  {
    id: "exterior", num: "02", title: "外構相談", sub: "EXTERIOR DESIGN", icon: "🌿",
    tagline: "業者選びからDIYまで。100坪の外構を自分で作り上げた経験者が教える。",
    desc: "外構業者の探し方・見積もり比較・DIYでできること・トラブル対応まで、100坪の土地の外構を自分で手がけた経験をもとにアドバイスします。",
    points: ["外構業者の選び方・比較ポイント", "DIYでコストを抑える方法", "一条工務店との外構工事の調整", "外構トラブルの対処法"],
  },
  {
    id: "lighting", num: "03", title: "照明計画相談", sub: "LIGHTING PLAN", icon: "💡",
    tagline: "後悔しやすい照明計画を、経験者と一緒に考えよう。",
    desc: "ダウンライトの位置・数・スイッチの配置は、住んでみて初めて後悔することが多いポイントです。実際の我が家の照明を見せながら、失敗しない照明計画のアドバイスをします。",
    points: ["ダウンライトの配置・数の考え方", "スイッチ・調光の位置決め", "リビング・寝室・キッチンの照明", "実際の我が家の照明を見せながら解説"],
  },
  {
    id: "wallpaper", num: "04", title: "壁紙・クロス計画相談", sub: "WALLPAPER PLAN", icon: "🎨",
    tagline: "選びすぎて沼にはまる前に、経験者に相談しよう。",
    desc: "壁紙・アクセントクロス選びは選択肢が多すぎて沼にはまりがちです。実際の我が家のクロスを見せながら、後悔しない選び方・アクセントの入れ方をアドバイスします。",
    points: ["アクセントクロスの選び方・入れ方", "部屋別のクロスの考え方", "実際の我が家のクロスを見せながら解説", "後悔しないための注意ポイント"],
  },
  {
    id: "trouble", num: "05", title: "トラブル相談", sub: "TROUBLE SUPPORT", icon: "⚖️",
    tagline: "不具合・対応不備。一人で抱え込まないで。",
    desc: "施工不具合や一条工務店との対応トラブルに悩む方へ。実際に不具合を発見し、調停で和解を勝ち取った経験をもとに、具体的な対処法をアドバイスします。",
    points: ["不具合の記録・証拠の残し方", "一条工務店への効果的な交渉術", "調停・法的手段の検討", "実体験をもとにした具体的アドバイス"],
  },
  {
    id: "mediation", num: "06", title: "調停・訴訟相談", sub: "MEDIATION & LAWSUIT", icon: "📋",
    tagline: "弁護士なしで調停を戦い、和解を勝ち取った経験者が教える。",
    desc: "一条工務店との不具合トラブルを、弁護士を使わず自力で調停申立を行い、和解を勝ち取った経験をもとに、調停の始め方から当日の進め方・訴訟への移行まで丁寧にサポートします。",
    points: ["調停申立書の書き方", "必要書類・証拠の準備方法", "調停当日の立ち振る舞い", "和解交渉・訴訟移行のポイント"],
  },
  {
    id: "stock_start", num: "07", title: "株の始め方相談", sub: "HOW TO START", icon: "📈",
    tagline: "何から始めればいい？投資家が一緒に考えます。",
    desc: "株を始めたいけど何からすればいいかわからない方へ。証券口座の選び方・開設手順・最初に買うべきものの考え方など、投資の第一歩をサポートします。※銘柄推奨は行いません。",
    points: ["証券会社・口座の選び方", "口座開設の手順", "最初の一歩の考え方", "初心者のよくある疑問"],
  },
  {
    id: "stock_nisa_yutai", num: "08", title: "NISA・株主優待相談", sub: "NISA & BENEFITS", icon: "💰",
    tagline: "NISAの使い方から優待のお得な取り方まで。",
    desc: "新NISAのつみたて投資枠・成長投資枠の使い分けや、株主優待をお得に取るクロス取引の基本など、投資をうまく活用するための考え方をお伝えします。※銘柄推奨は行いません。",
    points: ["つみたて投資枠・成長投資枠の違い", "NISAの使い方・優先順位", "株主優待・権利確定日の仕組み", "クロス取引（つなぎ売り）の基本"],
  },
];

const FAQS = [
  { q: "どんな人に向けたサービスですか？", a: "一条工務店での家づくりを検討している方、現在打ち合わせ中の方、引渡し後にトラブルが発生した方などが主な対象です。" },
  { q: "相談はどんな形式ですか？", a: "ZoomまたはGoogle Meetでのオンライン相談です。家づくり相談ではスマホカメラで実際のI-CUBEの室内をリアルタイムでご案内することもできます。" },
  { q: "調停相談は弁護士の代わりになりますか？", a: "法律の専門家ではありませんが、実際に一人で調停を行い和解した経験をもとにアドバイスします。法的判断が必要な場合は弁護士への相談をお勧めします。" },
  { q: "相談料金はいつ支払いますか？", a: "日程確定後にPayPayにてお支払いをお願いします。PayPay ID（tradehant1）は日程確定のメールにてご案内します。" },
  { q: "一条工務店以外の相談はできますか？", a: "現在は一条工務店専門のサービスとなっております。" },
];

export default function App() {
  const [view, setView] = useState("service");
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openService, setOpenService] = useState(null);
  const [referralForm, setReferralForm] = useState({ name: "", address: "", phone: "", email: "" });
  const [referralSubmitted, setReferralSubmitted] = useState(false);
  const [referralSending, setReferralSending] = useState(false);

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

  const handleConsultClick = async (consultant, serviceName) => {
    try {
      await fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consult_click",
          consultant,
          serviceName,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("ja-JP"),
        })
      });
    } catch (e) { console.error(e); }
    window.open(CALENDAR_URL, "_blank");
  };

  const handlePayment = () => {
    window.open(STRIPE_URL, "_blank");
  };

  const handleReferralSubmit = async () => {
    if (!referralForm.name || !referralForm.phone) return;
    setReferralSending(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...referralForm, type: "referral", date: new Date().toISOString().split("T")[0] })
      });
    } catch (e) { console.error(e); }
    setReferralSending(false);
    setReferralSubmitted(true);
    setReferralForm({ name: "", address: "", phone: "", email: "" });
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=Noto+Sans+JP:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { overflow-x: hidden; max-width: 100%; }
    :root {
      --blue: #4a6274;
      --blue-dark: #3a5060;
      --blue-light: #f2ece8;
      --accent: #2a7d5f;
      --text: #1a1a2e;
      --text-sub: #5a6478;
      --border: #e5dfd8;
      --bg: #f5f2ee;
      --bg-soft: #ede8e2;
      --bg-card: #fafbfc;
    }
    .fade-in { animation: fadeIn 0.6s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .nav-link { transition: color 0.2s; cursor: pointer; }
    .nav-link:hover { color: var(--blue) !important; }
    .svc-card { transition: all 0.25s ease; cursor: pointer; border: 1px solid var(--border); }
    .svc-card:hover { border-color: var(--blue); box-shadow: 0 4px 20px rgba(42,125,95,0.1); transform: translateY(-2px); }
    .btn-primary { transition: all 0.2s; }
    .btn-primary:hover { background: var(--blue-dark) !important; }
    .btn-outline { transition: all 0.2s; }
    .btn-outline:hover { background: var(--blue-light) !important; }
    .faq-item { border-bottom: 1px solid var(--border); }
    .profile-card { transition: box-shadow 0.2s; }
    .profile-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    @media (max-width: 768px) {
      .hero-inner { flex-direction: column !important; padding: 2.5rem 1rem !important; gap: 24px !important; }
      .hero-title { font-size: 30px !important; line-height: 1.5 !important; word-break: keep-all !important; }
      .services-grid { grid-template-columns: 1fr 1fr !important; }
      .profile-grid { grid-template-columns: 1fr !important; }
      .form-row-2 { grid-template-columns: 1fr !important; }
      .form-row-3 { grid-template-columns: 1fr !important; }
      .nav-desktop { display: none !important; }
      .mobile-btn { display: flex !important; }
      .story-cta { flex-direction: column !important; }
      .story-grid { grid-template-columns: 1fr !important; }
      .services-grid-2col { grid-template-columns: 1fr !important; }
      .stats-bar { gap: 20px !important; }
      .hero-cards-wrap { flex-direction: row !important; }
    }
  `;

  const navItems = [["service", "サービス"], ["referral_page", "紹介制度"], ["profile", "プロフィール"], ["faq", "よくある質問"]];

  const go = (v) => { const next = v === "top" ? "service" : v; setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#e8e2d9", color: "#1a1a2e", minHeight: "100vh" }}>
      <style>{css}</style>

      {/* ===== HEADER ===== */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(232,226,217,0.97)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => go("top")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#4a6274", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>一</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: 1, color: "#1a1a2e", lineHeight: 1.2 }}>一条コンサル</div>
              <div style={{ fontSize: 9, color: "#5a6478", letterSpacing: 1, fontWeight: 300 }}>ICHIJO CONSULTING</div>
            </div>
          </div>
          <nav className="nav-desktop" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navItems.map(([id, label]) => (
              <span key={id} className="nav-link" onClick={() => go(id)}
                style={{ fontSize: 15, fontWeight: 400, color: view === id ? "#4a6274" : "#5a6478", borderBottom: view === id ? "2px solid #2a7d5f" : "2px solid transparent", paddingBottom: 2, transition: "all 0.2s" }}>
                {label}
              </span>
            ))}
<a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, textDecoration: "none" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
                <defs>
                  <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497"/>
                    <stop offset="10%" stopColor="#fdf497"/>
                    <stop offset="30%" stopColor="#fd5949"/>
                    <stop offset="60%" stopColor="#d6249f"/>
                    <stop offset="90%" stopColor="#285AEB"/>
                  </radialGradient>
                </defs>
                <rect x="1" y="1" width="22" height="22" rx="6" ry="6" fill="url(#ig1)"/>
                <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2"/>
                <circle cx="17.8" cy="6.2" r="1.3" fill="#fff"/>
              </svg>
            </a>
            <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary"
              style={{ background: "#4a6274", color: "#fff", padding: "10px 24px", fontSize: 15, textDecoration: "none", fontWeight: 500, borderRadius: 2 }}>
              予約する
            </a>
          </nav>
          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#ede8e0", borderTop: "1px solid #e2e8f0", padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20 }}>
            {navItems.map(([id, label]) => (
              <span key={id} onClick={() => go(id)} style={{ fontSize: 15, cursor: "pointer", color: "#1a1a2e", fontWeight: 300 }}>{label}</span>
            ))}
            <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
              style={{ background: "#4a6274", color: "#fff", padding: "12px 20px", fontSize: 14, textDecoration: "none", fontWeight: 500, textAlign: "center" }}>
              📅 予約する
            </a>
          </div>
        )}
      </header>

      <div style={{ paddingTop: 60 }}>

        {/* ===== TOP ===== */}
        {view === "top" && (
          <div className="fade-in">

            {/* Hero */}
            <section style={{ background: "#e4ddd3", borderBottom: "1px solid #e2e8f0", padding: "4rem 1.5rem" }}>
              <div className="hero-inner" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 48 }}>
                {/* 左：テキスト */}
                <div className="hero-text" style={{ flex: "1 1 auto", minWidth: 0, width: "100%" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f2ece8", padding: "5px 14px", marginBottom: 24, borderRadius: 2 }}>
                    <div style={{ width: 6, height: 6, background: "#4a6274", borderRadius: "50%" }}></div>
                    <span style={{ fontSize: 11, color: "#4a6274", letterSpacing: 2, fontWeight: 500 }}>一条工務店 施主による相談サービス</span>
                  </div>
                  <h1 className="hero-title" style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 42, fontWeight: 500, lineHeight: 1.5, marginBottom: 16, color: "#1a1a2e" }}>
                    投資家パパ<br />× 子育てママ
                  </h1>
                  <p style={{ fontSize: 16, color: "#4a6274", fontWeight: 500, marginBottom: 12 }}>忖度なし、リアルをお届け。</p>
                  <p style={{ fontSize: 14, color: "#5a6478", fontWeight: 300, lineHeight: 2, marginBottom: 32 }}>
                    良いことも悪いことも、経験者だから言える本音をお伝えします。<br />
                    調停で和解を勝ち取ったパパと、2人の子どもを育てるママが、<br />
                    家づくり・トラブル・お金のことをサポートします。
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary"
                      style={{ background: "#4a6274", color: "#fff", padding: "14px 32px", fontSize: 14, textDecoration: "none", fontWeight: 500, display: "inline-block" }}>
                      📅 日程を予約する
                    </a>
                    <button onClick={() => go("service")} className="btn-outline"
                      style={{ background: "#ede8e0", color: "#4a6274", border: "1px solid #2a7d5f", padding: "14px 32px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 400 }}>
                      サービスを見る →
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12, fontWeight: 300 }}>パパ ¥3,000 / ママ ¥2,000 / PayPay・クレカ払い</p>
                </div>

                {/* 右：紹介制度ミニフォーム */}
                <div className="hero-cards-wrap" style={{ flexShrink: 0, width: 280 }}>
                  <div style={{ background: "#ede8e0", border: "1px solid #e2e8f0", padding: "24px 20px", borderTop: "3px solid #2a7d5f" }}>
                    <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 2, fontWeight: 500, marginBottom: 8 }}>REFERRAL</p>
                    <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: "#1a1a2e" }}>一条工務店の紹介制度</h3>
                    <p style={{ fontSize: 12, color: "#5a6478", fontWeight: 300, lineHeight: 1.8, marginBottom: 8 }}>一条が恐れる施主からの紹介だから安心。</p>
                    <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 16, display: "inline-block", borderBottom: "2px solid #e63946", color: "#1a1a2e" }}>紹介制度を使うと豪華オプション設備が貰えます！</p>
                    {referralSubmitted ? (
                      <div style={{ textAlign: "center", padding: "16px 0" }}>
                        <div style={{ fontSize: 32, color: "#4a6274", marginBottom: 8 }}>✓</div>
                        <p style={{ fontSize: 13, color: "#5a6478", fontWeight: 300 }}>送信完了しました！</p>
                        <button onClick={() => setReferralSubmitted(false)}
                          style={{ marginTop: 12, background: "none", border: "1px solid #e2e8f0", padding: "6px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#5a6478" }}>
                          別の方を紹介する
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                          ["name", "お名前 *", "text", "山田 太郎"],
                          ["address", "住所", "text", "栃木県..."],
                          ["phone", "電話番号 *", "tel", "090-0000-0000"],
                          ["email", "メールアドレス", "email", "example@gmail.com"],
                        ].map(([key, label, type, ph]) => (
                          <div key={key}>
                            <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 4 }}>{label}</label>
                            <input
                              value={referralForm[key]}
                              onChange={e => setReferralForm({ ...referralForm, [key]: e.target.value })}
                              type={type} placeholder={ph}
                              style={{ width: "100%", border: "none", borderBottom: "1px solid #ccc", padding: "6px 0", fontFamily: "inherit", fontSize: 13, outline: "none", background: "transparent", color: "#1a1a2e", fontWeight: 300 }}
                            />
                          </div>
                        ))}
                        <button
                          onClick={handleReferralSubmit}
                          disabled={!referralForm.name || !referralForm.phone || referralSending}
                          style={{ background: (!referralForm.name || !referralForm.phone) ? "#e0e0e0" : "#4a6274", color: (!referralForm.name || !referralForm.phone) ? "#aaa" : "#ede8e0", border: "none", padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                          {referralSending ? "送信中..." : "送信する →"}
                        </button>
                        <p style={{ fontSize: 10, color: "#ccc", textAlign: "center" }}>※ 紹介制度の手続き目的のみに使用します</p>
                      </div>
                    )}
                  </div>
                  <span onClick={() => go("profile")} style={{ fontSize: 11, color: "#4a6274", borderBottom: "1px solid #2a7d5f", cursor: "pointer", fontWeight: 300, display: "block", textAlign: "center", marginTop: 12 }}>
                    プロフィール詳細を見る →
                  </span>
                </div>
              </div>
            </section>

            {/* 実績バー */}
            <section style={{ background: "#4a6274", padding: "1.5rem" }}>
              <div className="stats-bar" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
                {[["I-CUBE", "33坪 2025年入居"], ["調停和解", "弁護士なしで実現"], ["FP資格", "個人投資家"], ["外構", "100坪DIY中"]].map(([label, val]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 500, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 300 }}>{val}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* サービス一覧 */}
            <section style={{ padding: "5rem 1.5rem", background: "#ede8e0" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                  <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>SERVICES</p>
                  <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 32, fontWeight: 500, color: "#1a1a2e" }}>相談サービス</h2>
                </div>
                <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                  {SERVICES.map((s) => (
                    <div key={s.id} className="svc-card" onClick={() => go("service")}
                      style={{ background: "#ede8e0", padding: "24px 20px", borderTop: "none" }}>
                      <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 2, marginBottom: 6 }}>{s.sub}</div>
                      <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, color: "#1a1a2e" }}>{s.title}</h3>
                      <p style={{ fontSize: 12, color: "#5a6478", lineHeight: 1.7, fontWeight: 300, marginBottom: 16 }}>{s.tagline}</p>
                      <div style={{ fontSize: 13, color: "#4a6274", fontWeight: 500 }}>¥3,000 / 30分</div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: 36 }}>
                  <button onClick={() => go("service")} className="btn-outline"
                    style={{ background: "#ede8e0", color: "#4a6274", border: "1px solid #2a7d5f", padding: "12px 32px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 400 }}>
                    サービス詳細を見る →
                  </button>
                </div>
              </div>
            </section>

            {/* ストーリー */}
            <section style={{ padding: "5rem 1.5rem", background: "#e4ddd3", borderTop: "1px solid #e2e8f0" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                  <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>STORY</p>
                  <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 32, fontWeight: 500, color: "#1a1a2e" }}>なぜこのサービスを始めたか</h2>
                </div>
                <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                  {[
                    ["在宅ワークのパパが、一人で家づくりを完遂", "共働きで忙しい中、家づくりの打ち合わせから引渡しまでほぼ一人でこなしました。I-CUBEの特性を活かした間取りや、オプション選びのノウハウを伝えたいと思っています。"],
                    ["引渡し後に不具合が発覚。一条工務店と対峙した", "入居後、施工不具合が発覚。一条工務店との交渉が難航し、最終的に弁護士なしで調停を申し立てました。"],
                    ["一人で調停を戦い、和解を勝ち取った", "慣れない法的手続きも、準備と記録を徹底することで乗り越えました。同じ境遇の方に、その経験を活かしたいと思っています。"],
                  ].map(([title, text], i) => (
                    <div key={i} style={{ background: "#ede8e0", border: "1px solid #e2e8f0", padding: "32px 28px" }}>
                      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 36, color: "#e2e8f0", fontWeight: 500, marginBottom: 16 }}>0{i + 1}</div>
                      <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12, color: "#1a1a2e", lineHeight: 1.6 }}>{title}</h3>
                      <p style={{ fontSize: 13, color: "#5a6478", lineHeight: 1.9, fontWeight: 300 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 紹介制度セクション */}
            {/* CTA バナー */}
            <section style={{ padding: "5rem 1.5rem", background: "#4a6274" }}>
              <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 3, marginBottom: 16 }}>FIRST STEP</p>
                <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 32, fontWeight: 500, color: "#fff", marginBottom: 16 }}>まずはお気軽に相談から</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 300, lineHeight: 2, marginBottom: 36 }}>
                  カレンダーから直接日程を予約できます。<br />パパ ¥3,000 / ママ ¥2,000 / PayPay・クレカ払い
                </p>
                <a href={CALENDAR_URL} target="_blank" rel="noreferrer"
                  style={{ background: "#ede8e0", color: "#4a6274", padding: "16px 48px", fontSize: 15, textDecoration: "none", fontWeight: 600, display: "inline-block" }}>
                  📅 日程を予約する
                </a>
              </div>
            </section>
          </div>
        )}

        {/* ===== SERVICE ===== */}
        {view === "service" && (
          <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 1.5rem" }}>

            {/* ヒーロー説明 */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 8 }}>ICHIJO CONSULTING</p>
                <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 500, color: "#1a1a2e" }}>こだわりパパ × おおらかママ<br />忖度なしの家づくり相談</h1>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 10, fontWeight: 300 }}>パパ 30分 ¥3,000 ／ ママ 30分 ¥2,000 ／ PayPay・クレカ払い ／ Zoom・Google Meet</p>
              </div>

              <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* パパ */}
                <div style={{ background: "#e4ddd3", border: "1px solid #e2e8f0", padding: "28px 24px", borderTop: "3px solid #2a7d5f" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: "#f2ece8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a2e" }}>パパ（五十嵐）</div>
                      <div style={{ fontSize: 11, color: "#4a6274", fontWeight: 400 }}>FP資格 / 個人投資家</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {["打ち合わせの進め方", "コスパ・おすすめ設備", "住み心地・実体験", "月々の電気代・売電額", "株・資産形成"].map(t => (
                      <div key={t} style={{ fontSize: 13, color: "#5a6478", fontWeight: 300, display: "flex", gap: 8 }}>
                        <span style={{ color: "#4a6274" }}>✓</span>{t}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleConsultClick("パパ", s.title)}
                    style={{ marginTop: 20, width: "100%", background: "#4a6274", color: "#fff", border: "none", padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                    📅 パパに相談する
                  </button>
                </div>

                {/* ママ */}
                <div style={{ background: "#e4ddd3", border: "1px solid #e2e8f0", padding: "28px 24px", borderTop: "3px solid #3a9e7a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, background: "#f2ece8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a2e" }}>ママ</div>
                      <div style={{ fontSize: 11, color: "#b5694a", fontWeight: 400 }}>主婦 / 4歳・6歳子育て中</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {["キッチンの使い勝手", "子育てしながらの家事", "家事動線・収納", "おすすめ設備・オプション", "ママ目線のリアル"].map(t => (
                      <div key={t} style={{ fontSize: 13, color: "#5a6478", fontWeight: 300, display: "flex", gap: 8 }}>
                        <span style={{ color: "#b5694a" }}>✓</span>{t}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleConsultClick("ママ", s.title)}
                    style={{ marginTop: 20, width: "100%", background: "#b5694a", color: "#fff", border: "none", padding: "10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                    📅 ママに相談する ¥2,000
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 48 }}>
              {SERVICES.map((s) => (
                <div key={s.id} style={{ background: "#ede8e0", border: "1px solid #d8d0c5" }}>
                  {/* 常時表示：タイトル行 */}
                  <div style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div
                      onClick={() => setOpenService(openService === s.id ? null : s.id)}
                      style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer", flex: 1 }}>
                      <span style={{ fontSize: 26 }}>{s.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>{s.title}</h3>
                        <p style={{ fontSize: 12, color: "#5a6478", fontWeight: 300 }}>{s.tagline}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      {/* パパ価格 */}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 300 }}>パパ</div>
                        <div style={{ fontSize: 18, fontWeight: 500, color: "#4a6274" }}>¥3,000</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>30分</div>
                      </div>
                      {/* ママ価格（4サービスのみ） */}
                      {["homebuilding", "exterior", "lighting", "wallpaper"].includes(s.id) && (
                        <button
                          onClick={() => handleConsultClick("ママ", s.title)}
                          style={{ background: "#b5694a", color: "#fff", border: "none", padding: "10px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, lineHeight: 1.5, textAlign: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 300, opacity: 0.85 }}>ママ / 30分</div>
                          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>¥2,000</div>
                        </button>
                      )}
                      <span
                        onClick={() => setOpenService(openService === s.id ? null : s.id)}
                        style={{ fontSize: 18, color: "#4a6274", transition: "transform 0.2s", transform: openService === s.id ? "rotate(45deg)" : "none", display: "block", cursor: "pointer" }}>+</span>
                    </div>
                  </div>

                  {/* 展開：詳細 */}
                  {openService === s.id && (
                    <div style={{ padding: "0 28px 28px", borderTop: "1px solid #e2e8f0" }}>
                      <p style={{ fontSize: 14, color: "#5a6478", lineHeight: 1.9, fontWeight: 300, margin: "20px 0 16px" }}>{s.desc}</p>
                      <div className="svc-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                        {s.points.map((pt, i) => (
                          <div key={i} style={{ fontSize: 13, color: "#5a6478", fontWeight: 300, display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ color: "#4a6274", marginTop: 2 }}>✓</span>{pt}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <button onClick={() => handleConsultClick("パパ", s.title)}
                          style={{ background: "#4a6274", color: "#fff", border: "none", padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                          📅 {s.id === "homebuilding" || s.id === "lighting" || s.id === "wallpaper" ? "パパに相談する" : "相談する"}
                        </button>

                        <a href={STRIPE_URL} target="_blank" rel="noreferrer"
                          style={{ background: "#635bff", color: "#fff", padding: "10px 20px", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "inline-block" }}>
                          💳 カードで支払う
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 相談の流れ */}
            <div style={{ background: "#e4ddd3", border: "1px solid #e2e8f0", padding: "32px", marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 24, color: "#1a1a2e" }}>相談の流れ</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {["Googleカレンダーで日程を直接予約", "予約確認メールが届きます", "日程確定後、PayPay（tradehant1）またはクレジットカードにてお支払い（¥3,000）", "ZoomまたはGoogle Meetで相談（30分）"].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, background: "#4a6274", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 300, paddingTop: 4, color: "#5a6478", lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary"
              style={{ background: "#4a6274", color: "#fff", padding: "14px 40px", fontSize: 14, textDecoration: "none", fontWeight: 500, display: "inline-block" }}>
              📅 日程を予約する
            </a>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {view === "profile" && (
          <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 1.5rem" }}>
            <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>PROFILE</p>
            <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 500, marginBottom: 48, color: "#1a1a2e" }}>プロフィール</h1>
            <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* 五十嵐 */}
              <div className="profile-card" style={{ border: "1px solid #e2e8f0", padding: "36px 32px", borderTop: "3px solid #2a7d5f" }}>
                <div style={{ width: 80, height: 80, background: "#f2ece8", borderRadius: "50%", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>👤</div>
                <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, color: "#1a1a2e" }}>五十嵐（パパ）</div>
                <div style={{ fontSize: 12, color: "#4a6274", fontWeight: 400, marginBottom: 20 }}>在宅ワーク / FP資格 / 個人投資家</div>
                <p style={{ fontSize: 14, lineHeight: 2, fontWeight: 300, color: "#5a6478", marginBottom: 24 }}>
                  家づくりの打ち合わせから引渡しまで一人で完遂。引渡し後に施工不具合が発覚し、弁護士なしで調停を申し立て和解を勝ち取りました。FP資格保有の投資家で、投資で貯めた資金でI-CUBEを建てました。
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[["モデル", "I-CUBE 33坪 2025年入居"], ["調停", "弁護士なし → 和解勝ち取り"], ["外構", "100坪DIY中"], ["資格", "FP資格 / 個人投資家"]].map(([l, v]) => (
                    <div key={l} style={{ background: "#e4ddd3", padding: "10px 16px", display: "flex", gap: 16, borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 48, flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 400, color: "#1a1a2e" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* ママ */}
              <div className="profile-card" style={{ border: "1px solid #e2e8f0", padding: "36px 32px", borderTop: "3px solid #3a9e7a" }}>
                <div style={{ width: 80, height: 80, background: "#f2ece8", borderRadius: "50%", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>👤</div>
                <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, color: "#1a1a2e" }}>おおらかママ</div>
                <div style={{ fontSize: 12, color: "#b5694a", fontWeight: 400, marginBottom: 20 }}>主婦 / 4歳・6歳子育て中</div>
                <p style={{ fontSize: 14, lineHeight: 2, fontWeight: 300, color: "#5a6478", marginBottom: 24 }}>
                  パートをしながら2人の子どもを育てる普通のママ。キッチンや家事動線、子育てしやすい間取りにこだわりました。プロではないからこそ、同じ目線でリアルな感想をお伝えします。
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[["キッチン", "使い勝手・収納・動線"], ["家事動線", "洗濯・掃除がラクな間取り"], ["子育て", "子どもがいる家ならではの視点"], ["相談", "気軽に何でも聞いてOK"]].map(([l, v]) => (
                    <div key={l} style={{ background: "#e4ddd3", padding: "10px 16px", display: "flex", gap: 16, borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 48, flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 400, color: "#1a1a2e" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 紹介制度 */}
            <div style={{ marginTop: 48, background: "#ede8e0", border: "1px solid #e2e8f0", padding: "36px 32px", borderTop: "3px solid #2a7d5f" }}>
              <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>REFERRAL</p>
              <h2 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 24, fontWeight: 500, marginBottom: 12, color: "#1a1a2e" }}>一条工務店の紹介制度</h2>
              <p style={{ fontSize: 14, color: "#5a6478", fontWeight: 300, lineHeight: 2, marginBottom: 28 }}>
                一条工務店と調停で和解を勝ち取った施主からの紹介。<br />
                忖度なしでリアルを話す私たちからの紹介だから、安心して一条の家づくりを始められます。<br />
                <br />
                興味がある知人・友人がいれば、お名前・連絡先を教えてください。
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e", marginBottom: 28, display: "inline-block", borderBottom: "2px solid #e63946", paddingBottom: 2 }}>紹介制度を使うと豪華オプション設備が貰えます！</p>
              {referralSubmitted ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 48, color: "#4a6274", marginBottom: 12 }}>✓</div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>送信完了しました</h3>
                  <p style={{ fontSize: 14, color: "#5a6478", fontWeight: 300 }}>情報をお受け取りしました。ありがとうございます！</p>
                  <button onClick={() => setReferralSubmitted(false)}
                    style={{ marginTop: 16, background: "none", border: "1px solid #e2e8f0", padding: "8px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#5a6478" }}>
                    別の方を紹介する
                  </button>
                </div>
              ) : (
                <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[
                    ["name", "お名前 *", "text", "山田 太郎"],
                    ["phone", "電話番号 *", "tel", "090-0000-0000"],
                    ["address", "住所", "text", "栃木県那須塩原市..."],
                    ["email", "メールアドレス", "email", "example@gmail.com"],
                  ].map(([key, label, type, ph]) => (
                    <div key={key}>
                      <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: 1 }}>{label}</label>
                      <input
                        value={referralForm[key]}
                        onChange={e => setReferralForm({ ...referralForm, [key]: e.target.value })}
                        type={type} placeholder={ph}
                        style={{ width: "100%", border: "none", borderBottom: "1px solid #ccc", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "transparent", color: "#1a1a2e", fontWeight: 300 }}
                      />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <button
                      onClick={handleReferralSubmit}
                      disabled={!referralForm.name || !referralForm.phone || referralSending}
                      className="btn-primary"
                      style={{ background: (!referralForm.name || !referralForm.phone) ? "#e0e0e0" : "#4a6274", color: (!referralForm.name || !referralForm.phone) ? "#aaa" : "#ede8e0", border: "none", padding: "14px 40px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                      {referralSending ? "送信中..." : "送信する →"}
                    </button>
                    <p style={{ fontSize: 11, color: "#ccc", marginTop: 8, fontWeight: 300 }}>※ いただいた情報は紹介制度の手続き目的のみに使用します</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REFERRAL PAGE ===== */}
        {view === "referral_page" && (
          <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "5rem 1.5rem" }}>
            <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>REFERRAL</p>
            <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 500, marginBottom: 16, color: "#1a1a2e" }}>一条工務店の紹介制度</h1>
            <p style={{ fontSize: 14, color: "#5a6478", fontWeight: 300, lineHeight: 2, marginBottom: 12 }}>
              一条工務店と調停で和解を勝ち取った施主からの紹介。<br />
              忖度なしでリアルを話す私たちからの紹介だから、安心して一条の家づくりを始められます。<br />
              一条工務店に興味がある知人・友人がいれば、お名前・連絡先を教えてください。
            </p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", marginBottom: 40, display: "inline-block", borderBottom: "2px solid #e63946", paddingBottom: 2 }}>
              紹介制度を使うと豪華オプション設備が貰えます！
            </p>

            {referralSubmitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 56, color: "#4a6274", marginBottom: 16 }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12 }}>送信完了しました</h3>
                <p style={{ fontSize: 14, color: "#5a6478", fontWeight: 300, lineHeight: 2 }}>情報をお受け取りしました。<br />ありがとうございます！</p>
                <button onClick={() => setReferralSubmitted(false)}
                  style={{ marginTop: 20, background: "none", border: "1px solid #ccc", padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#5a6478" }}>
                  別の方を紹介する
                </button>
              </div>
            ) : (
              <div style={{ background: "#ede8e0", border: "1px solid #d8d0c5", padding: "36px 32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {[
                    ["name", "お名前 *", "text", "山田 太郎"],
                    ["address", "住所", "text", "栃木県那須塩原市..."],
                    ["phone", "電話番号 *", "tel", "090-0000-0000"],
                    ["email", "メールアドレス", "email", "example@gmail.com"],
                  ].map(([key, label, type, ph]) => (
                    <div key={key}>
                      <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 8, letterSpacing: 1 }}>{label}</label>
                      <input
                        value={referralForm[key]}
                        onChange={e => setReferralForm({ ...referralForm, [key]: e.target.value })}
                        type={type} placeholder={ph}
                        style={{ width: "100%", border: "none", borderBottom: "1px solid #bbb", padding: "8px 0", fontFamily: "inherit", fontSize: 14, outline: "none", background: "transparent", color: "#1a1a2e", fontWeight: 300 }}
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleReferralSubmit}
                    disabled={!referralForm.name || !referralForm.phone || referralSending}
                    style={{ background: (!referralForm.name || !referralForm.phone) ? "#ccc" : "#4a6274", color: (!referralForm.name || !referralForm.phone) ? "#888" : "#fff", border: "none", padding: "14px", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                    {referralSending ? "送信中..." : "送信する →"}
                  </button>
                  <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", fontWeight: 300 }}>※ いただいた情報は紹介制度の手続き目的のみに使用します</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== FAQ ===== */}
        {view === "faq" && (
          <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "5rem 1.5rem" }}>
            <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>FAQ</p>
            <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 500, marginBottom: 48, color: "#1a1a2e" }}>よくある質問</h1>
            <div>
              {FAQS.map((faq, i) => (
                <div key={i} className="faq-item">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", background: "none", border: "none", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit", textAlign: "left", gap: 16 }}>
                    <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.5, color: "#1a1a2e" }}>{faq.q}</span>
                    <span style={{ fontSize: 20, color: "#4a6274", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none", display: "block" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ paddingBottom: 24, fontSize: 14, color: "#5a6478", lineHeight: 1.9, fontWeight: 300 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 52, padding: "36px", background: "#e4ddd3", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#5a6478", marginBottom: 20, fontWeight: 300 }}>他にご質問があればお気軽にどうぞ</p>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary"
                style={{ background: "#4a6274", color: "#fff", padding: "14px 36px", fontSize: 14, textDecoration: "none", fontWeight: 500, display: "inline-block" }}>
                📅 日程を予約する
              </a>
            </div>
          </div>
        )}

        {/* ===== PRIVACY ===== */}
        {view === "privacy" && (
          <div className="fade-in" style={{ maxWidth: 700, margin: "0 auto", padding: "5rem 1.5rem" }}>
            <p style={{ fontSize: 11, color: "#4a6274", letterSpacing: 3, fontWeight: 500, marginBottom: 12 }}>PRIVACY POLICY</p>
            <h1 style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 40, fontWeight: 500, marginBottom: 48, color: "#1a1a2e" }}>プライバシーポリシー</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              {[
                ["個人情報の取得について", "当サービスでは、相談予約および一条工務店紹介制度のご利用にあたり、お名前・メールアドレス・電話番号・住所等の個人情報をご入力いただく場合があります。"],
                ["個人情報の利用目的", "取得した個人情報は以下の目的のみに使用します。\n・相談予約の確認・日程調整のご連絡\n・一条工務店の紹介制度に関する手続き\n・サービスに関するご案内"],
                ["第三者への提供", "取得した個人情報は、一条工務店の紹介制度の手続きに必要な範囲において、一条工務店へ提供する場合があります。それ以外の第三者への提供は行いません。"],
                ["個人情報の管理", "取得した個人情報はGoogleが提供するサービス（Google スプレッドシート）上で管理し、適切なアクセス制限を設けて保護します。"],
                ["個人情報の開示・訂正・削除", "ご本人からの個人情報の開示・訂正・削除のご要望については、合理的な範囲で対応いたします。お問い合わせはGoogleカレンダーの予約フォームよりご連絡ください。"],
                ["Cookieの使用について", "当サービスでは現在Cookieによる個人情報の取得は行っておりません。"],
                ["プライバシーポリシーの変更", "本ポリシーは予告なく変更する場合があります。変更後はこのページに掲載します。"],
                ["お問い合わせ", "個人情報の取り扱いに関するお問い合わせは、Googleカレンダーの予約フォームよりご連絡ください。"],
              ].map(([title, text]) => (
                <div key={title} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 28 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12, color: "#1a1a2e" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "#5a6478", fontWeight: 300, lineHeight: 2, whiteSpace: "pre-line" }}>{text}</p>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 300 }}>制定日：2026年3月</p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{ background: "#1a1a2e", padding: "3rem 1.5rem", marginTop: 0 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 }}>一条コンサル</div>
              <div style={{ fontSize: 11, color: "#5a6478", fontWeight: 300 }}>ICHIJO CONSULTING</div>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, textDecoration: "none" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <defs>
                  <radialGradient id="ig2" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497"/>
                    <stop offset="10%" stopColor="#fdf497"/>
                    <stop offset="30%" stopColor="#fd5949"/>
                    <stop offset="60%" stopColor="#d6249f"/>
                    <stop offset="90%" stopColor="#285AEB"/>
                  </radialGradient>
                </defs>
                <rect x="1" y="1" width="22" height="22" rx="6" ry="6" fill="url(#ig2)"/>
                <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2"/>
                <circle cx="17.8" cy="6.2" r="1.3" fill="#fff"/>
              </svg>
            </a>
            <p style={{ fontSize: 11, color: "#5a6478", fontWeight: 300 }}><span onClick={() => go('privacy')} style={{ color: "#94a3b8", cursor: "pointer", borderBottom: "1px solid #5a6478", paddingBottom: 1, marginRight: 16 }}>プライバシーポリシー</span>© 2026 五十嵐 / 一条コンサル. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
