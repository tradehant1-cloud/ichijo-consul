import { useState, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1cWkXiCtMbzt9LG9CFgs2WxZ1JbL5ll7a1iS9bRpWpc3WNFBGGnIUxAb4c_jYrXroMw/exec";
const STRIPE_URL = "https://buy.stripe.com/test_4gM9AS7nw5Ii9Ew5HZ33W00"; // 本番時はURLを変更
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
                style={{ fontSize: 13, fontWeight: 400, color: view === id ? "#4a6274" : "#5a6478", borderBottom: view === id ? "2px solid #2a7d5f" : "2px solid transparent", paddingBottom: 2, transition: "all 0.2s" }}>
                {label}
              </span>
            ))}
<a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", textDecoration: "none" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary"
              style={{ background: "#4a6274", color: "#fff", padding: "8px 20px", fontSize: 13, textDecoration: "none", fontWeight: 500, borderRadius: 2 }}>
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

            <div className="services-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginBottom: 48 }}>
              {SERVICES.map((s) => (
                <div key={s.id} style={{ background: "#ede8e0", border: "1px solid #d8d0c5" }}>
                  {/* 常時表示：タイトル行 */}
                  <div
                    onClick={() => setOpenService(openService === s.id ? null : s.id)}
                    style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 16 }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ fontSize: 26 }}>{s.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>{s.title}</h3>
                        <p style={{ fontSize: 12, color: "#5a6478", fontWeight: 300 }}>{s.tagline}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 500, color: "#4a6274" }}>¥3,000</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>30分</div>
                      </div>
                      <span style={{ fontSize: 18, color: "#4a6274", transition: "transform 0.2s", transform: openService === s.id ? "rotate(45deg)" : "none", display: "block" }}>+</span>
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
                        {(s.id === "homebuilding" || s.id === "lighting" || s.id === "wallpaper") && (
                          <button onClick={() => handleConsultClick("ママ", s.title)}
                            style={{ background: "#b5694a", color: "#fff", border: "none", padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                            📅 ママに相談する ¥2,000
                          </button>
                        )}
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
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", textDecoration: "none" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <p style={{ fontSize: 11, color: "#5a6478", fontWeight: 300 }}><span onClick={() => go('privacy')} style={{ color: "#94a3b8", cursor: "pointer", borderBottom: "1px solid #5a6478", paddingBottom: 1, marginRight: 16 }}>プライバシーポリシー</span>© 2026 五十嵐 / 一条コンサル. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
