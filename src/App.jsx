import { useState } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1cWkXiCtMbzt9LG9CFgs2WxZ1JbL5ll7a1iS9bRpWpc3WNFBGGnIUxAb4c_jYrXroMw/exec";
const STRIPE_URL = "https://buy.stripe.com/test_4gM9AS7nw5Ii9Ew5HZ33W00";
const INSTAGRAM_URL = "https://www.instagram.com/";
const CALENDAR_URL = "https://calendar.app.google/o7mArhfZ9icHBu5b7";

const SERVICES = [
  {
    id: "homebuilding", num: "01", title: "家づくり相談", sub: "HOME BUILDING",
    tagline: "忖度なし。我が家をまるごと見せながら、本音でお答えします。",
    desc: "WEB入居宅訪問はテンプレ質問が多く聞きたいことが聞けなかったり、営業さんの前では聞けないことも多いですよね。マンツーマンだから、何でも聞いてください。間取り・オプション・見積もり・契約など、一条工務店での家づくり全般を相談できます。",
    points: ["間取り・動線・収納のアドバイス", "本当に必要なオプションの仕分け", "見積もりの見方・交渉ポイント", "スマホカメラで実際の我が家をZoomご案内", "打ち合わせの進め方", "全館空調と床暖の違い", "月々の電気代・売電額", "キッチンの使い勝手", "子育てしながらの家事", "家事動線・収納", "おすすめ設備・オプション"],
    mama: true,
  },
  {
    id: "lighting", num: "02", title: "照明計画・リンクプラス相談", sub: "LIGHTING PLAN",
    tagline: "後悔しやすい照明計画を、経験者と一緒に考えよう。",
    desc: "ダウンライトの位置・数・スイッチの配置は、住んでみて初めて後悔することが多いポイントです。実際の我が家の照明を見せながら、失敗しない照明計画のアドバイスをします。",
    points: ["ダウンライトの配置・数の考え方", "スイッチ・調光の位置決め", "リビング・寝室・キッチンの照明", "実際の我が家の照明を見せながら解説"],
    mama: true,
  },
  {
    id: "wallpaper", num: "03", title: "壁紙・クロス計画相談", sub: "WALLPAPER PLAN",
    tagline: "選びすぎて沼にはまる前に、経験者に相談しよう。",
    desc: "壁紙・アクセントクロス選びは選択肢が多すぎて沼にはまりがちです。実際の我が家のクロスを見せながら、後悔しない選び方・アクセントの入れ方をアドバイスします。",
    points: ["アクセントクロスの選び方・入れ方", "部屋別のクロスの考え方", "実際の我が家のクロスを見せながら解説", "後悔しないための注意ポイント"],
    mama: true,
  },
  {
    id: "exterior", num: "04", title: "外構・DIY相談", sub: "EXTERIOR & DIY",
    tagline: "業者選びからDIYまで。100坪の外構を自分で作り上げた経験者が教える。",
    desc: "外構業者の探し方・見積もり比較・DIYでできること・トラブル対応まで、100坪の土地の外構を自分で手がけた経験をもとにアドバイスします。",
    points: ["外構業者の選び方・比較ポイント", "DIYでコストを抑える方法", "一条工務店との外構工事の調整", "外構トラブルの対処法"],
    mama: false,
  },
  {
    id: "trouble", num: "05", title: "トラブル対応・調停・訴訟相談", sub: "TROUBLE & LAWSUIT",
    tagline: "不具合・対応不備から調停・訴訟まで。一人で抱え込まないで。",
    desc: "施工不具合や一条工務店との対応トラブルに悩む方へ。弁護士を使わず自力で調停申立を行い、現在も戦い続けている経験をもとに、トラブル対応から調停・訴訟への移行まで具体的にアドバイスします。",
    points: ["不具合の記録・証拠の残し方", "一条工務店への効果的な交渉術", "調停申立書の書き方・必要書類", "調停当日の立ち振る舞い・訴訟移行のポイント"],
    mama: false,
  },
  {
    id: "stock_start", num: "06", title: "株・NISA・優待相談", sub: "STOCK & NISA",
    tagline: "株の始め方からNISA・株主優待まで。FP資格保有の投資家が教えます。",
    desc: "証券口座の選び方・開設手順から、新NISAの使い分け、株主優待をお得に取るクロス取引の基本まで幅広くサポートします。※銘柄推奨は行いません。",
    points: ["証券会社・口座の選び方・開設手順", "NISA つみたて投資枠・成長投資枠の違い", "株主優待・権利確定日の仕組み", "クロス取引（つなぎ売り）の基本"],
    mama: false,
  },
];

const FAQS = [
  { q: "どんな人に向けたサービスですか？", a: "一条工務店での家づくりを検討している方、現在打ち合わせ中の方、引渡し後にトラブルが発生した方などが主な対象です。" },
  { q: "相談はどんな形式ですか？", a: "ZoomまたはGoogle Meetでのオンライン相談です。家づくり相談ではスマホカメラで実際のI-CUBEの室内をリアルタイムでご案内することもできます。" },
  { q: "調停相談は弁護士の代わりになりますか？", a: "法律の専門家ではありませんが、実際に一人で調停を行い和解した経験をもとにアドバイスします。法的判断が必要な場合は弁護士への相談をお勧めします。" },
  { q: "相談料金はいつ支払いますか？", a: "日程確定後にPayPay（ID: tradehant1）またはクレジットカードにてお支払いをお願いします。" },
  { q: "一条工務店以外の相談はできますか？", a: "トラブル・調停相談については一条工務店以外のハウスメーカーでもご相談いただけます。ただし他のハウスメーカーは仕様が異なるためお答えできない場合もありますが、ご了承いただけるようであればお気軽にご相談ください。" },
  { q: "料金はいつ支払いますか？", a: "予約枠をご確定いただいた後、事前にPayPay（ID: tradehant1）またはクレジットカードにてお支払いください。" },
  { q: "相談は何回でもできますか？", a: "はい、何度でもご相談いただけます。1回30分の枠を予約していただければ、その都度ご相談いただけます。" },
];

const Icon = ({ type, size = 22 }) => {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    home: <svg {...s}><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    bulb: <svg {...s}><path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.4-4.5 6.5V17H9.5v-1.5C6.8 14.4 5 12 5 9a7 7 0 0 1 7-7z"/><line x1="9.5" y1="19" x2="14.5" y2="19"/><line x1="10" y1="21" x2="14" y2="21"/></svg>,
    grid: <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
    tree: <svg {...s}><path d="M12 2L8 8H3l5 5-2 7 6-3 6 3-2-7 5-5h-5L12 2z"/></svg>,
    alert: <svg {...s}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none"/></svg>,
    doc: <svg {...s}><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>,
    chart: <svg {...s}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    clock: <svg {...s}><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>,
    check: <svg {...s}><polyline points="20 6 9 17 4 12"/></svg>,
    chevron: <svg {...s}><polyline points="6 9 12 15 18 9"/></svg>,
    menu: <svg {...s}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg {...s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    insta: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="20%" stopColor="#fd5949"/>
          <stop offset="55%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#ig-grad)"/>
      <circle cx="12" cy="12" r="5.5" stroke="#fff" strokeWidth="2" fill="none"/>
      <circle cx="17.8" cy="6.2" r="1.3" fill="#fff"/>
    </svg>,
  };
  const idMap = { homebuilding: "home", lighting: "bulb", wallpaper: "grid", exterior: "tree", trouble: "alert", mediation: "doc", stock_start: "chart", stock_nisa_yutai: "clock" };
  return icons[idMap[type] || type] || null;
};

export default function App() {
  const [view, setView] = useState("service");
  const [openService, setOpenService] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [referralForm, setReferralForm] = useState({ name: "", address: "", phone: "", email: "" });
  const [referralSubmitted, setReferralSubmitted] = useState(false);
  const [referralSending, setReferralSending] = useState(false);

  const go = (v) => {
    setMenuOpen(false);
    if (v === "service" && view === "service") {
      const el = document.getElementById("service-list-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConsultClick = async (consultant, serviceName) => {
    try {
      await fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "consult_click", consultant, serviceName, date: new Date().toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, "-"), time: new Date().toLocaleTimeString("ja-JP") })
      });
    } catch (e) { console.error(e); }
    window.open(CALENDAR_URL, "_blank");
  };

  const handleReferralSubmit = async () => {
    if (!referralForm.name || !referralForm.phone) return;
    setReferralSending(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...referralForm, type: "referral", date: new Date().toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, "-") })
      });
    } catch (e) { console.error(e); }
    setReferralSending(false);
    setReferralSubmitted(true);
    setReferralForm({ name: "", address: "", phone: "", email: "" });
  };

  const navItems = [["service", "サービス"], ["referral_page", "紹介制度"], ["profile", "プロフィール"], ["faq", "よくある質問"]];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&family=Cormorant+Garamond:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; }
    .header { position: sticky; top: 0; z-index: 100; background: #1a1e2e; }
    .header-top { max-width: 1200px; margin: 0 auto; padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .header-right { position: absolute; right: 40px; display: flex; align-items: center; gap: 16px; }
    .logo-mark { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #fff; letter-spacing: 3px; text-align: center; }
    .logo-sub { font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 3px; text-align: center; margin-top: 2px; }
    .header-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; height: 44px; display: flex; align-items: center; justify-content: center; gap: 40px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .nav-links { display: flex; align-items: center; gap: 40px; }
    .nav-link { font-size: 13px; color: rgba(255,255,255,0.65); letter-spacing: 1px; transition: color 0.2s; position: relative; padding-bottom: 4px; cursor: pointer; }
    .nav-link:hover { color: #fff; }
    .nav-link.active { color: #fff; }
    .nav-link.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: #c9a96e; }
    .nav-cta { background: #c9a96e; color: #1a1e2e; padding: 7px 18px; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; border: none; transition: background 0.2s; display: inline-block; }
    .nav-cta:hover { background: #b8944a; }
    .mobile-toggle { display: none; background: none; border: none; color: #fff; position: absolute; right: 20px; }
    .mobile-menu { display: none; background: #1a1e2e; border-top: 1px solid rgba(255,255,255,0.08); padding: 24px 40px; flex-direction: column; gap: 20px; }
    .mobile-menu.open { display: flex; }
    .page-hero { background: linear-gradient(rgba(10,14,28,0.75), rgba(10,14,28,0.85)), url('https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600&q=80') center/cover no-repeat; padding: 80px 40px 64px; position: relative; overflow: hidden; border-bottom: 1px solid rgba(201,169,110,0.2); text-align: center; }
    .page-hero::before { content: ''; position: absolute; top: 0; right: 0; width: 50%; height: 100%; background: linear-gradient(135deg, transparent 40%, rgba(201,169,110,0.06) 100%); }
    .page-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; }
    .page-label { font-size: 10px; letter-spacing: 4px; color: #c9a96e; margin-bottom: 20px; }
    .page-title { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 500; color: #fff; line-height: 1.3; margin-bottom: 16px; text-shadow: 0 2px 20px rgba(0,0,0,0.5); }
    .page-title span { color: #c9a96e; }
    .page-desc { font-size: 14px; color: rgba(255,255,255,0.85); line-height: 2.2; max-width: 640px; background: rgba(0,0,0,0.3); padding: 24px 28px; border-left: 3px solid #c9a96e; backdrop-filter: blur(4px); margin: 0 auto; text-align: left; }
    .content { background: #f4f1ec; min-height: 60vh; }
    .content-inner { max-width: 1200px; margin: 0 auto; padding: 64px 40px; }
    .consultant-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 64px; }
    .consultant-card { background: #fff; padding: 40px; border-top: 3px solid transparent; }
    .consultant-card.papa { border-top-color: #1a1e2e; }
    .consultant-card.mama { border-top-color: #c9a96e; }
    .consultant-avatar { width: 56px; height: 56px; border-radius: 50%; background: #f4f1ec; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 24px; }
    .consultant-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: #1a1e2e; margin-bottom: 4px; }
    .consultant-role { font-size: 11px; letter-spacing: 2px; color: #c9a96e; margin-bottom: 20px; }
    .consultant-tags { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
    .consultant-tag { font-size: 13px; color: #555; display: flex; align-items: center; gap: 10px; }
    .consultant-tag::before { content: '—'; color: #c9a96e; font-size: 12px; }
    .btn-papa { display: block; width: 100%; background: #1a1e2e; color: #fff; border: none; padding: 14px; font-size: 13px; letter-spacing: 1px; transition: background 0.2s; }
    .btn-papa:hover { background: #2d3348; }
    .btn-mama { display: block; width: 100%; background: #c9a96e; color: #1a1e2e; border: none; padding: 14px; font-size: 13px; font-weight: 700; letter-spacing: 1px; transition: background 0.2s; }
    .btn-mama:hover { background: #b8944a; }
    .price-note { font-size: 11px; text-align: center; color: #999; margin-top: 8px; letter-spacing: 1px; }
    .section-header { margin-bottom: 32px; }
    .section-label { font-size: 10px; letter-spacing: 4px; color: #c9a96e; margin-bottom: 12px; }
    .section-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 500; color: #1a1e2e; }
    .service-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 64px; }
    .service-item { background: #fff; overflow: hidden; }
    .service-header { padding: 28px 32px; display: flex; align-items: center; gap: 20px; cursor: pointer; transition: background 0.15s; border-left: 3px solid transparent; }
    .service-header:hover { background: #faf8f4; }
    .service-header.open { border-left-color: #c9a96e; background: #faf8f4; }
    .service-num { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: #c9a96e; letter-spacing: 2px; min-width: 28px; }
    .service-icon-wrap { color: #1a1e2e; opacity: 0.6; flex-shrink: 0; }
    .service-info { flex: 1; }
    .service-title-text { font-size: 16px; font-weight: 500; color: #1a1e2e; margin-bottom: 3px; letter-spacing: 0.5px; }
    .service-tagline-text { font-size: 12px; color: #888; }
    .service-hint-text { font-size: 11px; color: #c9a96e; letter-spacing: 1px; margin-top: 4px; }
    .service-prices { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .price-papa-block { text-align: right; }
    .price-papa-lbl { font-size: 10px; color: #999; letter-spacing: 1px; }
    .price-papa-num { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: #1a1e2e; }
    .price-papa-sub { font-size: 10px; color: #999; }
    .btn-mama-badge { background: #c9a96e; color: #1a1e2e; border: none; padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: 1px; line-height: 1.4; text-align: center; transition: background 0.2s; }
    .btn-mama-badge:hover { background: #b8944a; }
    .btn-mama-badge-price { font-size: 20px; font-weight: 700; display: block; }
    .service-chevron-icon { color: #ccc; transition: transform 0.2s, color 0.2s; }
    .service-chevron-icon.open { transform: rotate(180deg); color: #c9a96e; }
    .service-body { padding: 0 32px 32px 32px; border-top: 1px solid #f0ede8; }
    .service-desc-text { font-size: 14px; color: #555; line-height: 2; margin: 24px 0 20px; }
    .service-points-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
    .service-point-item { font-size: 13px; color: #444; display: flex; gap: 10px; align-items: flex-start; }
    .point-check-icon { color: #c9a96e; flex-shrink: 0; margin-top: 1px; }
    .service-actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-book-papa { background: #1a1e2e; color: #fff; border: none; padding: 12px 28px; font-size: 13px; letter-spacing: 1px; transition: background 0.2s; }
    .btn-book-papa:hover { background: #2d3348; }
    .btn-book-mama { background: #c9a96e; color: #1a1e2e; border: none; padding: 12px 28px; font-size: 13px; font-weight: 700; letter-spacing: 1px; transition: background 0.2s; }
    .btn-book-mama:hover { background: #b8944a; }
    .btn-stripe { background: transparent; color: #635bff; border: 1px solid #635bff; padding: 12px 28px; font-size: 13px; letter-spacing: 1px; transition: all 0.2s; }
    .btn-stripe:hover { background: #635bff; color: #fff; }
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 48px; }
    .profile-card { background: #fff; padding: 48px 40px; }
    .profile-card-header { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #f0ede8; }
    .profile-icon { width: 64px; height: 64px; border-radius: 50%; background: #f4f1ec; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .profile-name { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: #1a1e2e; }
    .profile-role { font-size: 11px; letter-spacing: 2px; color: #c9a96e; margin-top: 4px; }
    .profile-bio { font-size: 14px; color: #555; line-height: 2; margin-bottom: 28px; }
    .profile-specs { display: flex; flex-direction: column; gap: 0; }
    .profile-spec { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f0ede8; }
    .spec-key { font-size: 11px; color: #999; letter-spacing: 1px; min-width: 60px; padding-top: 2px; }
    .spec-val { font-size: 13px; color: #333; }
    .faq-list { display: flex; flex-direction: column; gap: 2px; }
    .faq-item { background: #fff; overflow: hidden; }
    .faq-q { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 20px; transition: background 0.15s; }
    .faq-q:hover { background: #faf8f4; }
    .faq-q-text { font-size: 15px; color: #1a1e2e; font-weight: 400; line-height: 1.6; }
    .faq-a-text { padding: 20px 32px 24px; font-size: 14px; color: #666; line-height: 2; border-top: 1px solid #f0ede8; }
    .referral-box { background: #fff; padding: 48px; }
    .referral-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .form-field { display: flex; flex-direction: column; gap: 8px; }
    .form-label { font-size: 11px; letter-spacing: 2px; color: #999; }
    .form-input { border: none; border-bottom: 1px solid #e0ddd8; padding: 10px 0; font-size: 14px; font-family: inherit; outline: none; background: transparent; color: #1a1e2e; transition: border-color 0.2s; }
    .form-input:focus { border-bottom-color: #1a1e2e; }
    .form-full { grid-column: 1 / -1; }
    .btn-submit { background: #1a1e2e; color: #fff; border: none; padding: 16px 48px; font-size: 13px; letter-spacing: 2px; transition: background 0.2s; }
    .btn-submit:hover { background: #2d3348; }
    .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
    .footer { background: #111420; padding: 64px 40px 32px; }
    .footer-inner { max-width: 1200px; margin: 0 auto; }
    .footer-top { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 32px; }
    .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #fff; letter-spacing: 3px; margin-bottom: 8px; }
    .footer-tagline { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 2px; }
    .footer-links { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
    .footer-link { font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 1px; transition: color 0.2s; cursor: pointer; }
    .footer-link:hover { color: rgba(255,255,255,0.8); }
    .footer-bottom { display: flex; justify-content: space-between; align-items: center; }
    .footer-copy { font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 1px; }
    .footer-insta { color: rgba(255,255,255,0.4); transition: color 0.2s; display: flex; }
    .footer-insta:hover { color: #fff; }
    .how-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
    .how-step { padding: 10px 16px; border-right: 1px solid #f0ede8; }
    .how-step:last-child { border-right: none; }
    .how-num { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #c9a96e; font-weight: 600; margin-bottom: 4px; }
    .how-text { font-size: 14px; color: #1a1e2e; line-height: 1.6; font-weight: 400; }
    @media (max-width: 768px) {
      .header-inner { padding: 0 20px; }
      .nav-links { display: none; }
      .mobile-toggle { display: flex; align-items: center; justify-content: center; }
      .page-hero { padding: 48px 20px 40px; }
      .page-title { font-size: 30px; }
      .content-inner { padding: 40px 20px; }
      .consultant-grid, .profile-grid { grid-template-columns: 1fr; }
      .service-header { padding: 18px 16px; gap: 12px; }
      .service-body { padding: 0 16px 24px; }
      .service-points-grid { grid-template-columns: 1fr; }
      .referral-form-grid { grid-template-columns: 1fr; }
      .how-grid { grid-template-columns: 1fr 1fr; }
      .how-step { border-right: none; border-bottom: 1px solid #f0ede8; }
      .footer-top { flex-direction: column; gap: 32px; }
      .footer { padding: 48px 20px 24px; }
      .mobile-menu { padding: 24px 20px; }
    }
  `;

  return (
    <div style={{ fontFamily: "'Noto Serif JP', serif", background: "#f4f1ec", color: "#1a1e2e", minHeight: "100vh" }}>
      <style>{css}</style>

      {/* ヘッダー */}
      <header className="header">
        {/* ロゴ中央 */}
        <div className="header-top">
          <div onClick={() => go("service")} style={{ cursor: "pointer", textAlign: "center" }}>
            <div className="logo-mark">一条対策室</div>
            <div className="logo-sub">一条工務店</div>
          </div>
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon type={menuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
        {/* ナビ横帯 */}
        <div className="header-inner">
          <nav className="nav-links">
            {navItems.map(([id, label]) => (
              <span key={id} onClick={() => go(id)} className={`nav-link${view === id ? " active" : ""}`}>{label}</span>
            ))}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="footer-insta">
              <Icon type="insta" size={20} />
            </a>
            <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="nav-cta">予約する</a>
          </nav>
        </div>
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {navItems.map(([id, label]) => (
            <span key={id} onClick={() => go(id)} style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", cursor: "pointer", letterSpacing: 1 }}>{label}</span>
          ))}
          <a href={CALENDAR_URL} target="_blank" rel="noreferrer" style={{ color: "#c9a96e", fontSize: 13, letterSpacing: 2 }}>📅 予約する</a>
        </div>
      </header>

      {/* ===== サービスページ ===== */}
      {view === "service" && (
        <>
          <div className="page-hero">
            <div className="page-hero-inner">
              <h1 className="page-title">
                <span>忖度なしの家づくり相談</span>
              </h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#c9a96e", marginBottom: 16, fontStyle: "italic" }}>
                ～ 入居宅訪問では聞けない本音、全部話します ～
              </p>
              <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                {/* パパの吹き出し */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 200, flexShrink: 0 }}>
                  {/* 丸い吹き出し */}
                  <div style={{ background: "rgba(26,30,46,0.85)", border: "2px solid #c9a96e", borderRadius: "50%", width: 180, height: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 20px", marginBottom: 12, position: "relative", boxShadow: "0 0 20px rgba(201,169,110,0.2)" }}>
                    <p style={{ fontSize: 12, color: "#fff", lineHeight: 1.8, textAlign: "center" }}>一条という大企業に一人で訴訟まで戦い抜いた！本音で全部話すよ。</p>
                    <div style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "10px solid #c9a96e" }}/>
                  </div>
                  {/* パパアイコン */}
                  <svg width="52" height="52" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="28" fill="#1a1e2e"/>
                    <circle cx="28" cy="22" r="10" fill="#c9a96e"/>
                    <path d="M8 50 Q8 36 28 36 Q48 36 48 50" fill="#c9a96e"/>
                    <rect x="18" y="12" width="20" height="6" rx="3" fill="#4a3a1a"/>
                  </svg>
                  <p style={{ fontSize: 11, color: "#c9a96e", marginTop: 6, letterSpacing: 1 }}>こだわりパパ</p>
                </div>

                {/* 中央テキスト */}
                <p className="page-desc" style={{ flex: 1, margin: 0, minWidth: 200 }}>
                  楽しいはずの家づくり、辛いことばかり。建った後も納得いかない対応。絶対間違ってる！そんな思いをして欲しくないから相談サービスを始めました。是非お気軽にご相談ください。
                </p>

                {/* ママの吹き出し */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 200, flexShrink: 0 }}>
                  <div style={{ background: "rgba(26,30,46,0.85)", border: "2px solid #b5694a", borderRadius: "50%", width: 180, height: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 20px", marginBottom: 12, position: "relative", boxShadow: "0 0 20px rgba(181,105,74,0.2)" }}>
                    <p style={{ fontSize: 12, color: "#fff", lineHeight: 1.8, textAlign: "center" }}>見たい場所はリクエストして！主婦目線でリアルに答えるよ。</p>
                    <div style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "10px solid #b5694a" }}/>
                  </div>
                  {/* ママアイコン */}
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="28" fill="#1a1e2e"/>
                    <circle cx="28" cy="22" r="10" fill="#e8b89a"/>
                    <path d="M8 50 Q8 36 28 36 Q48 36 48 50" fill="#e8b89a"/>
                    <path d="M18 14 Q28 6 38 14" stroke="#b5694a" strokeWidth="3" fill="none"/>
                  </svg>
                  <p style={{ fontSize: 11, color: "#c9a96e", marginTop: 6, letterSpacing: 1 }}>おおらかママ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="content">
            <div className="content-inner">

              {/* コンサルタント */}
              <div className="section-header">
                <h2 className="section-title">担当コンサルタント</h2>
              </div>
              <div className="consultant-grid">
                <div className="consultant-card papa">
                  <div className="consultant-avatar">👤</div>
                  <div className="consultant-name">こだわりパパ（五十嵐）</div>
                  <div className="consultant-role">FP資格 / 個人投資家</div>

                  <button className="btn-papa" onClick={() => handleConsultClick("パパ", "トップ")}>
                    📅 パパに相談する — ¥3,000 / 30分
                  </button>
                  <div className="price-note">＼ 期間限定の特別価格 ／</div>
                </div>
                <div className="consultant-card mama">
                  <div className="consultant-avatar">👤</div>
                  <div className="consultant-name">おおらかママ</div>
                  <div className="consultant-role">主婦 / 4歳・6歳子育て中</div>

                  <button className="btn-mama" onClick={() => handleConsultClick("ママ", "トップ")}>
                    📅 ママに相談する — ¥2,000 / 30分
                  </button>
                  <div className="price-note">＼ 期間限定の特別価格 ／</div>
                </div>
              </div>

              {/* サービス一覧 */}
              <div id="service-list-anchor" className="section-header">
                <h2 className="section-title">サービス内容・料金</h2>
              </div>
              <div className="service-list">
                {SERVICES.map((s) => (
                  <div key={s.id} className="service-item">
                    <div
                      className={`service-header${openService === s.id ? " open" : ""}`}
                      onClick={() => setOpenService(openService === s.id ? null : s.id)}
                    >
                      <span className="service-icon-wrap"><Icon type={s.id} size={20} /></span>
                      <div className="service-info">
                        <div className="service-title-text">{s.title}</div>
                        <div className="service-tagline-text">{s.tagline}</div>
                        <div className="service-hint-text">{openService === s.id ? "▲ 閉じる" : "▼ 詳細・予約を見る"}</div>
                      </div>
                      <div className="service-prices">
                        <button className="btn-mama-badge" style={{ background: "#1a1e2e", color: "#fff" }} onClick={e => { e.stopPropagation(); handleConsultClick("パパ", s.title); }}>
                          <span style={{ fontSize: 10, fontWeight: 400, display: "block", letterSpacing: 1 }}>パパ / 30分</span>
                          <span className="btn-mama-badge-price">¥3,000</span>
                        </button>
                        {s.mama && (
                          <button className="btn-mama-badge" onClick={e => { e.stopPropagation(); handleConsultClick("ママ", s.title); }}>
                            <span style={{ fontSize: 10, fontWeight: 400, display: "block", letterSpacing: 1 }}>ママ / 30分</span>
                            <span className="btn-mama-badge-price">¥2,000</span>
                          </button>
                        )}
                        <span className={`service-chevron-icon${openService === s.id ? " open" : ""}`}>
                          <Icon type="chevron" size={18} />
                        </span>
                      </div>
                    </div>
                    {openService === s.id && (
                      <div className="service-body">
                        <p className="service-desc-text">{s.desc}</p>
                        <div className="service-points-grid">
                          {s.points.map((pt, i) => (
                            <div key={i} className="service-point-item">
                              <span className="point-check-icon"><Icon type="check" size={14} /></span>
                              {pt}
                            </div>
                          ))}
                        </div>
                        <div className="service-actions-row">
                          <button className="btn-book-papa" onClick={() => handleConsultClick("パパ", s.title)}>
                            📅 {s.mama ? "パパに相談する" : "相談する"}
                          </button>
                          {s.mama && (
                            <button className="btn-book-mama" onClick={() => handleConsultClick("ママ", s.title)}>
                              📅 ママに相談する
                            </button>
                          )}
                          <button className="btn-stripe" onClick={() => window.open(STRIPE_URL, "_blank")}>
                            💳 カードで支払う
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 相談の流れ */}
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "#1a1e2e", letterSpacing: 1, marginBottom: 12 }}>相談の流れ</h3>
              <div style={{ background: "#fff", borderLeft: "4px solid #c9a96e", marginBottom: 0 }}>
                <div className="how-grid">
                  {["Googleカレンダーで日程を予約", "予約確認メールが届く", "PayPay / カードでお支払い（¥3,000）", "Zoom / Google Meetで相談（30分）"].map((step, i) => (
                    <div key={i} className="how-step">
                      <div className="how-num">0{i + 1}</div>
                      <div className="how-text">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ===== プロフィールページ ===== */}
      {view === "profile" && (
        <>
          <div className="page-hero">
            <div className="page-hero-inner">
              <h1 className="page-title">プロフィール</h1>
              <p className="page-desc">経験者だからこそ言える、本音をお届けします。</p>
            </div>
          </div>
          <div className="content">
            <div className="content-inner">
              <div className="profile-grid">
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-icon">👤</div>
                    <div>
                      <div className="profile-name">こだわりパパ（五十嵐）</div>
                      <div className="profile-role">FP資格 / 個人投資家</div>
                    </div>
                  </div>
                  <p className="profile-bio">
                    家づくりの打ち合わせから引渡しまで一人で完遂。引渡し後に施工不具合が発覚し、弁護士なしで一条工務店を相手に調停を申立て、現在も戦い続けています。FP資格保有の投資家で、投資で貯めた資金でI-CUBEを建てました。
                  </p>
                  <div className="profile-specs">
                    {[["モデル", "I-CUBE 33坪 2025年入居"], ["調停", "弁護士なしで調停申立・現在訴訟準備中"], ["外構", "100坪DIY中"], ["資格", "FP資格 / 個人投資家"]].map(([k, v]) => (
                      <div key={k} className="profile-spec">
                        <span className="spec-key">{k}</span>
                        <span className="spec-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="profile-icon">👤</div>
                    <div>
                      <div className="profile-name">おおらかママ</div>
                      <div className="profile-role">主婦 / 4歳・6歳子育て中</div>
                    </div>
                  </div>
                  <p className="profile-bio">
                    パートをしながら2人の子どもを育てる普通のママ。キッチンや家事動線、子育てしやすい間取りにこだわりました。プロではないからこそ、同じ目線でリアルな感想をお伝えします。
                  </p>
                  <div className="profile-specs">
                    {[["キッチン", "使い勝手・収納・動線"], ["家事動線", "洗濯・掃除がラクな間取り"], ["子育て", "子どもがいる家ならではの視点"], ["相談", "気軽に何でも聞いてOK"]].map(([k, v]) => (
                      <div key={k} className="profile-spec">
                        <span className="spec-key">{k}</span>
                        <span className="spec-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== FAQページ ===== */}
      {view === "faq" && (
        <>
          <div className="page-hero">
            <div className="page-hero-inner">
              <h1 className="page-title">よくある質問</h1>
            </div>
          </div>
          <div className="content">
            <div className="content-inner">
              <div className="faq-list" style={{ marginBottom: 48 }}>
                {FAQS.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span className="faq-q-text">{faq.q}</span>
                      <span style={{ color: "#c9a96e", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                        <Icon type="chevron" size={18} />
                      </span>
                    </div>
                    {openFaq === i && <div className="faq-a-text">{faq.a}</div>}
                  </div>
                ))}
              </div>
              <div style={{ background: "#1a1e2e", padding: "48px", textAlign: "center" }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: "#c9a96e", marginBottom: 16 }}>BOOK A SESSION</div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 28, lineHeight: 2 }}>他にご質問があればお気軽に相談からどうぞ</p>
                <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="nav-cta" style={{ padding: "14px 48px", fontSize: 13 }}>
                  📅 日程を予約する
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== 紹介制度ページ ===== */}
      {view === "referral_page" && (
        <>
          <div className="page-hero">
            <div className="page-hero-inner">
              <h1 className="page-title">一条工務店の<br /><span>紹介制度</span></h1>
              <p className="page-desc">一条工務店と調停で和解を勝ち取った施主からの紹介。忖度なしでリアルを話す私たちからの紹介だから安心です。</p>
            </div>
          </div>
          <div className="content">
            <div className="content-inner">
              <div style={{ maxWidth: 700 }}>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#1a1e2e", borderBottom: "2px solid #e63946", paddingBottom: 4, display: "inline-block", marginBottom: 32 }}>
                  紹介制度を使うと豪華オプション設備が貰えます！
                </p>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 2, marginBottom: 40 }}>
                  一条工務店に興味がある知人・友人がいればぜひご紹介ください。お名前・連絡先をお送りいただくだけでOKです。
                </p>
                {referralSubmitted ? (
                  <div style={{ background: "#fff", padding: "64px 48px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: "#c9a96e", marginBottom: 16 }}>✓</div>
                    <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>送信完了しました</h3>
                    <p style={{ fontSize: 14, color: "#888", lineHeight: 2 }}>情報をお受け取りしました。ありがとうございます！</p>
                    <button onClick={() => setReferralSubmitted(false)} style={{ marginTop: 24, background: "none", border: "1px solid #ccc", padding: "10px 24px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#888" }}>
                      別の方を紹介する
                    </button>
                  </div>
                ) : (
                  <div className="referral-box">
                    <div className="referral-form-grid">
                      {[["name", "お名前 *", "text", "山田 太郎"], ["phone", "電話番号 *", "tel", "090-0000-0000"], ["address", "住所", "text", "栃木県..."], ["email", "メールアドレス", "email", "example@gmail.com"]].map(([key, label, type, ph]) => (
                        <div key={key} className="form-field">
                          <label className="form-label">{label}</label>
                          <input value={referralForm[key]} onChange={e => setReferralForm({ ...referralForm, [key]: e.target.value })} type={type} placeholder={ph} className="form-input" />
                        </div>
                      ))}
                      <div className="form-full" style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
                        <button onClick={handleReferralSubmit} disabled={!referralForm.name || !referralForm.phone || referralSending} className="btn-submit" style={{ width: "fit-content" }}>
                          {referralSending ? "送信中..." : "送信する →"}
                        </button>
                        <p style={{ fontSize: 11, color: "#bbb", letterSpacing: 1 }}>※ いただいた情報は紹介制度の手続き目的のみに使用します</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== プライバシーポリシー ===== */}
      {view === "privacy" && (
        <>
          <div className="page-hero">
            <div className="page-hero-inner">
              <h1 className="page-title">プライバシーポリシー</h1>
            </div>
          </div>
          <div className="content">
            <div className="content-inner">
              <div style={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 32 }}>
                {[
                  ["個人情報の取得について", "当サービスでは、相談予約および一条工務店紹介制度のご利用にあたり、お名前・メールアドレス・電話番号・住所等の個人情報をご入力いただく場合があります。"],
                  ["個人情報の利用目的", "取得した個人情報は相談予約の確認・日程調整のご連絡、一条工務店の紹介制度に関する手続き、サービスに関するご案内の目的のみに使用します。"],
                  ["第三者への提供", "取得した個人情報は、一条工務店の紹介制度の手続きに必要な範囲において、一条工務店へ提供する場合があります。それ以外の第三者への提供は行いません。"],
                  ["個人情報の管理", "取得した個人情報はGoogleが提供するサービス上で管理し、適切なアクセス制限を設けて保護します。"],
                  ["お問い合わせ", "個人情報の取り扱いに関するお問い合わせは、Googleカレンダーの予約フォームよりご連絡ください。"],
                ].map(([title, text]) => (
                  <div key={title} style={{ borderBottom: "1px solid #e8e2d8", paddingBottom: 28 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12, color: "#1a1e2e" }}>{title}</h3>
                    <p style={{ fontSize: 14, color: "#666", lineHeight: 2 }}>{text}</p>
                  </div>
                ))}
                <p style={{ fontSize: 12, color: "#aaa", letterSpacing: 1 }}>制定日：2026年3月</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* フッター */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo">一条対策室</div>
              <div className="footer-tagline">一条工務店</div>
            </div>
            <div className="footer-links">
              {navItems.map(([id, label]) => (
                <span key={id} onClick={() => go(id)} className="footer-link">{label}</span>
              ))}
              <span onClick={() => go("privacy")} className="footer-link">プライバシーポリシー</span>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 一条対策室 / 五十嵐</div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="footer-insta">
              <Icon type="insta" size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
