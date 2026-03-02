import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BOT_NAME = "MediBot";
const BOT_AVATAR = "🏥";

const QUICK_REPLIES = {
  greeting: [
    { label: "📅 Book an appointment", intent: "book_appointment" },
    { label: "✉️ Ask a health query", intent: "ask_query" },
    { label: "❤️ Log my vitals", intent: "log_vitals" },
    { label: "📋 View my appointments", intent: "view_appointments" },
  ],
  appointment: [
    { label: "How do I book?", intent: "book_appointment" },
    { label: "See upcoming visits", intent: "view_appointments_upcoming" },
    { label: "See past visits", intent: "view_appointments_past" },
    { label: "Go to appointments page", intent: "nav_appointments" },
  ],
  query: [
    { label: "How do I ask a question?", intent: "how_ask_query" },
    { label: "See pending queries", intent: "view_queries_pending" },
    { label: "Go to queries page", intent: "nav_queries" },
  ],
  vitals: [
    { label: "What vitals can I log?", intent: "vitals_list" },
    { label: "What is a normal heart rate?", intent: "normal_hr" },
    { label: "What is normal BP?", intent: "normal_bp" },
    { label: "Go to Dashboard", intent: "nav_dashboard" },
  ],
  default: [
    { label: "📅 Appointments", intent: "book_appointment" },
    { label: "✉️ Health Queries", intent: "ask_query" },
    { label: "❤️ Vitals Help", intent: "vitals_list" },
    { label: "🏠 Go to Dashboard", intent: "nav_dashboard" },
  ],
};

const RESPONSES = {
  greeting: {
    text: "Hi there! 👋 I'm **MediBot**, your MediCare portal assistant.\n\nI can help you **book appointments**, **submit health queries**, **log vitals**, and **navigate the portal**. What would you like to do today?",
    quickReplies: "greeting",
  },
  book_appointment: {
    text: "📅 **Booking an Appointment**\n\nHere is how:\n1. Click the **Book** button in the top navbar\n2. Or go to the **Appointments page** from the dashboard\n3. Choose your **department**, preferred **date** and **time**\n4. Add a reason (optional) and submit\n\nYour request will be reviewed and confirmed by our team.",
    quickReplies: "appointment",
    action: { label: "Go to Appointments →", intent: "nav_appointments" },
  },
  view_appointments: {
    text: "📋 **My Appointments**\n\nYou can view all your visits on the **Appointments page**. It has three filters:\n• **All** — Every appointment ever booked\n• **Upcoming** — Future visits\n• **Past** — Previous visits\n\nEach card shows department, date, time, and status.",
    quickReplies: "appointment",
    action: { label: "Open Appointments →", intent: "nav_appointments" },
  },
  view_appointments_upcoming: {
    text: "⬆️ **Upcoming Appointments**\n\nHead to the Appointments page and click the **Upcoming** tab to see all your future visits sorted by date.",
    quickReplies: "appointment",
    action: { label: "Open Appointments →", intent: "nav_appointments" },
  },
  view_appointments_past: {
    text: "⬇️ **Past Appointments**\n\nHead to the Appointments page and click the **Past** tab to see your visit history.",
    quickReplies: "appointment",
    action: { label: "Open Appointments →", intent: "nav_appointments" },
  },
  nav_appointments: {
    text: "Taking you to your **Appointments page** now! 🚀",
    quickReplies: "appointment",
    navigate: "appointments",
  },
  ask_query: {
    text: "✉️ **Submitting a Health Query**\n\nHave a question for your doctor?\n1. Click **New Query** in the navbar\n2. Choose a **category** (General Health, Medication, Lab Results, etc.)\n3. Type your question in detail\n4. Hit **Send Query** — our team will respond shortly!",
    quickReplies: "query",
    action: { label: "Go to My Queries →", intent: "nav_queries" },
  },
  how_ask_query: {
    text: "✉️ To send a health query:\n\n• Click **New Query** in the top navbar on the dashboard\n• Or visit the **My Queries** page and click **Ask New Query**\n• Select a category and describe your concern\n\nYou will see your query status (Pending → Under Review → Resolved) update over time.",
    quickReplies: "query",
  },
  view_queries_pending: {
    text: "⏳ **Pending Queries**\n\nGo to the **My Queries** page and click the **Pending** filter to see queries still awaiting a response from our care team.",
    quickReplies: "query",
    action: { label: "Open My Queries →", intent: "nav_queries" },
  },
  nav_queries: {
    text: "Taking you to your **Health Queries** page! 💬",
    quickReplies: "query",
    navigate: "queries",
  },
  log_vitals: {
    text: "❤️ **Logging Your Vitals**\n\nKeeping track of your health metrics is very important!\n\n1. On the **Dashboard**, scroll to the **Health Vitals** section\n2. Click **+ Log Today's Vitals**\n3. Enter whichever readings you have — all fields are optional\n4. Hit **Log Vitals** to save\n\nYour latest readings appear on the coloured cards instantly.",
    quickReplies: "vitals",
    action: { label: "Go to Dashboard →", intent: "nav_dashboard" },
  },
  vitals_list: {
    text: "📊 **Vitals You Can Track**\n\n• ❤️ **Heart Rate** (bpm) — Normal: 60–100\n• 🩺 **Systolic BP** (mmHg) — Normal: below 120\n• 💜 **Diastolic BP** (mmHg) — Normal: below 80\n• 🩸 **Blood Glucose** (mg/dL) — Normal: below 100\n• 🫁 **SpO2** (%) — Normal: 95% or above\n• 🌡️ **Temperature** (°F) — Normal: 97–99.5°F\n• ⚖️ **Weight** (kg)\n\nCards turn **green** (normal), **yellow** (monitor), or **red** (high risk) automatically.",
    quickReplies: "vitals",
  },
  normal_hr: {
    text: "❤️ **Heart Rate Guide**\n\n• **Below 60 bpm** — May indicate bradycardia\n• **60–100 bpm** — Normal range for adults\n• **100–120 bpm** — Worth monitoring\n• **Above 120 bpm** — Consult your doctor soon\n\nFor seniors, a resting heart rate of 60–90 is generally healthy. Light exercise helps maintain a good rate.",
    quickReplies: "vitals",
  },
  normal_bp: {
    text: "🩺 **Blood Pressure Guide**\n\n• **Normal:** below 120/80 mmHg\n• **Elevated:** 120–129 / below 80 mmHg\n• **High Stage 1:** 130–139 / 80–89 mmHg\n• **High Stage 2:** 140+ / 90+ mmHg — see a doctor\n\n**Tip:** Measure at the same time each day, sit quietly for 5 mins first, and avoid caffeine beforehand.",
    quickReplies: "vitals",
    action: { label: "Book Cardiology Appt →", intent: "book_appointment" },
  },
  nav_dashboard: {
    text: "Taking you back to your **Dashboard**! 🏠",
    quickReplies: "default",
    navigate: "dashboard",
  },
  departments: {
    text: "🏥 **Available Departments**\n\n• General Checkup\n• Cardiology (heart)\n• Orthopedics (bones & joints)\n• Neurology (brain & nerves)\n• Dermatology (skin)\n• Ophthalmology (eyes)\n• ENT (ear, nose & throat)\n• Diabetes & Endocrinology\n\nNot sure which to pick? Choose **General Checkup** and describe your reason.",
    quickReplies: "appointment",
  },
  login_help: {
    text: "🔐 **Signing In**\n\nYou have two ways to log in:\n\n**Email and Password** — Use the email and password you registered with\n\n**Phone OTP** — Enter your registered phone number, receive a 6-digit code via SMS, then enter it to sign in\n\nNew patient? Click **Create your account here** on the login page.",
    quickReplies: "default",
  },
  emergency: {
    text: "🚨 **In an Emergency?**\n\nPlease **call 112** immediately or go to the nearest ER.\n\nFor urgent but non-emergency concerns:\n• Book a same-day appointment in the portal\n• Send an urgent health query\n\nThis chatbot is for guidance only — it cannot handle medical emergencies.",
    quickReplies: "default",
  },
  fallback: {
    text: "I did not quite catch that! 🤔 I am best at helping with:\n\n• Booking or viewing **appointments**\n• Submitting **health queries**\n• Logging and understanding **vitals**\n• Navigating the **patient portal**\n\nCould you rephrase, or pick one of the options below?",
    quickReplies: "default",
  },
};

const INTENT_MAP = [
  [["hello", "hi", "hey", "start", "help", "helo", "hai", "good morning", "good afternoon"], "greeting"],
  [["book", "schedule", "appoint", "visit", "consult", "see doctor", "meet doctor", "new appointment"], "book_appointment"],
  [["my appoint", "upcoming", "future visit", "past appoint", "past visit", "history", "view appoint"], "view_appointments"],
  [["query", "question", "ask", "doubt", "concern", "message doctor", "health question"], "ask_query"],
  [["vital", "log", "record", "reading", "track health", "log today", "health metric"], "log_vitals"],
  [["heart rate", "pulse", "bpm", "heartbeat"], "normal_hr"],
  [["blood pressure", " bp", "hypertension", "systolic", "diastolic", "pressure"], "normal_bp"],
  [["spo2", "oxygen", "saturation", "breathing"], "vitals_list"],
  [["what vital", "which vital", "what can i track", "what track", "what can i log"], "vitals_list"],
  [["department", "which department", "cardio", "ortho", "neuro", "derm", "ent", "eye", "spine", "bone"], "departments"],
  [["login", "sign in", "password", "otp", "phone login", "forgot", "signin"], "login_help"],
  [["emergency", "urgent", "serious", "critical", "chest pain", "ambulance", "danger"], "emergency"],
  [["dashboard", "home", "main page", "go back", "back", "return home"], "nav_dashboard"],
  [["appointments page", "go to appoint", "open appoint"], "nav_appointments"],
  [["queries page", "go to quer", "open quer", "my queries"], "nav_queries"],
];

function matchIntent(text) {
  const lower = text.toLowerCase();
  for (const [keywords, intent] of INTENT_MAP) {
    if (keywords.some(k => lower.includes(k))) return intent;
  }
  return "fallback";
}

function renderText(text) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, pi) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={pi}>{p.slice(2, -2)}</strong>
        : p
    );
    return <span key={li}>{rendered}{li < lines.length - 1 && <br />}</span>;
  });
}

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .hb-fab {
    position: fixed; bottom: 28px; right: 28px; z-index: 9000;
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(135deg, #004e80 0%, #0096c7 100%);
    border: none; cursor: pointer;
    box-shadow: 0 6px 28px rgba(0,78,128,0.5), 0 2px 8px rgba(0,0,0,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hb-fab:hover { transform: scale(1.1) rotate(-5deg); box-shadow: 0 10px 36px rgba(0,78,128,0.6); }
  .hb-fab.open { transform: scale(0.92); background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
  .hb-fab-icon { transition: transform 0.3s ease; }
  .hb-pulse {
    position: absolute; top: 0; right: 0;
    width: 18px; height: 18px; border-radius: 50%;
    background: #4ade80; border: 2.5px solid white;
    animation: hb-pulse 2.5s ease infinite;
  }
  @keyframes hb-pulse { 0%,100%{ transform:scale(1); opacity:1; } 50%{ transform:scale(1.4); opacity:0.6; } }

  .hb-window {
    position: fixed; bottom: 102px; right: 28px; z-index: 8999;
    width: 368px; height: 560px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.08);
    display: flex; flex-direction: column;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    animation: hb-slideUp 0.38s cubic-bezier(0.22,1,0.36,1) both;
    border: 1px solid rgba(0,100,160,0.1);
  }
  @keyframes hb-slideUp {
    from { opacity:0; transform:translateY(24px) scale(0.95); }
    to { opacity:1; transform:translateY(0) scale(1); }
  }

  .hb-header {
    background: linear-gradient(120deg, #004e80 0%, #0077b6 60%, #0096c7 100%);
    padding: 14px 16px;
    display: flex; align-items: center; gap: 11px;
    flex-shrink: 0; position: relative; overflow: hidden;
  }
  .hb-header::after {
    content: ''; position: absolute; top: -20px; right: -20px;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .hb-avatar {
    width: 42px; height: 42px; border-radius: 14px;
    background: rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
    border: 1.5px solid rgba(255,255,255,0.35);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .hb-header-info { flex: 1; }
  .hb-header-name { font-size: 15px; font-weight: 700; color: white; letter-spacing: 0.1px; }
  .hb-header-status { font-size: 11.5px; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 5px; margin-top: 1px; }
  .hb-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; flex-shrink: 0; animation: hb-pulse 3s ease infinite; }
  .hb-header-btns { display: flex; gap: 6px; position: relative; z-index: 1; }
  .hb-icon-btn { background: rgba(255,255,255,0.12); border: none; color: rgba(255,255,255,0.9); cursor: pointer; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: background 0.2s; }
  .hb-icon-btn:hover { background: rgba(255,255,255,0.22); }

  .hb-messages {
    flex: 1; overflow-y: auto; padding: 14px 12px;
    display: flex; flex-direction: column; gap: 10px;
    background: #f4f7fa;
    scroll-behavior: smooth;
  }
  .hb-messages::-webkit-scrollbar { width: 3px; }
  .hb-messages::-webkit-scrollbar-thumb { background: #c8d6e5; border-radius: 4px; }

  .hb-empty-state {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 30px 20px; color: #94a3b8; text-align: center;
  }
  .hb-empty-icon { font-size: 44px; margin-bottom: 12px; opacity: 0.8; }
  .hb-empty-title { font-size: 15px; font-weight: 700; color: #475569; margin-bottom: 5px; }
  .hb-empty-sub { font-size: 13px; color: #94a3b8; line-height: 1.5; }

  .hb-msg { display: flex; gap: 7px; animation: hb-msgIn 0.28s ease both; }
  @keyframes hb-msgIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .hb-msg.user { flex-direction: row-reverse; }

  .hb-msg-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0; margin-top: 4px;
  }
  .hb-msg.bot .hb-msg-avatar { background: #dbeafe; }
  .hb-msg.user .hb-msg-avatar { background: #0077b6; color: white; font-size: 12px; }

  .hb-bubble {
    max-width: 84%; padding: 10px 13px;
    font-size: 13.5px; line-height: 1.6; color: #1e3a5f;
    border-radius: 16px;
  }
  .hb-msg.bot .hb-bubble {
    background: white; border-radius: 4px 16px 16px 16px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  }
  .hb-msg.user .hb-bubble {
    background: linear-gradient(135deg, #0077b6, #0096c7);
    color: white; border-radius: 16px 4px 16px 16px;
  }

  .hb-action-btn {
    margin-top: 10px; padding: 8px 13px;
    background: linear-gradient(135deg, #0077b6, #0096c7);
    color: white; border: none; border-radius: 10px;
    font-size: 12.5px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; display: flex; align-items: center; gap: 5px;
    box-shadow: 0 3px 10px rgba(0,119,182,0.35); width: 100%;
  }
  .hb-action-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(0,119,182,0.45); }

  .hb-typing { display: flex; gap: 5px; align-items: center; }
  .hb-dot { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: hb-bounce 1.3s ease infinite; }
  .hb-dot:nth-child(2){animation-delay:0.16s} .hb-dot:nth-child(3){animation-delay:0.32s}
  @keyframes hb-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}

  .hb-quick-wrap {
    background: #f4f7fa; border-top: 1px solid #e2eaf3;
    padding: 10px 12px 6px; flex-shrink: 0;
  }
  .hb-quick-label { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 8px; }
  .hb-quick-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .hb-chip {
    padding: 6px 12px;
    background: white; border: 1.5px solid #bfdbfe;
    border-radius: 20px; font-size: 12px; font-weight: 600;
    color: #1e40af; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s; white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .hb-chip:hover { background: #dbeafe; border-color: #93c5fd; transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.08); }

  .hb-input-row {
    padding: 10px 12px;
    display: flex; gap: 8px; align-items: flex-end;
    background: white; border-top: 1px solid #e2eaf3; flex-shrink: 0;
  }
  .hb-input {
    flex: 1; padding: 9px 13px;
    background: #f1f5f9; border: 2px solid transparent;
    border-radius: 20px; font-size: 13.5px;
    font-family: 'DM Sans', sans-serif; color: #0d1b2a;
    outline: none; transition: all 0.2s; resize: none;
    max-height: 80px; line-height: 1.45;
  }
  .hb-input:focus { background: white; border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(147,197,253,0.2); }
  .hb-input::placeholder { color: #94a3b8; }
  .hb-send {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #0077b6, #0096c7);
    border: none; cursor: pointer; color: white; font-size: 17px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(0,119,182,0.4);
  }
  .hb-send:hover { transform: scale(1.1); }
  .hb-send:disabled { opacity: 0.35; cursor: default; transform: none; box-shadow: none; }

  @media (max-width: 480px) {
    .hb-window { width: calc(100vw - 24px); right: 12px; bottom: 88px; height: 520px; }
    .hb-fab { right: 16px; bottom: 18px; }
  }
`;

export default function HealthBot({ patientId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState(QUICK_REPLIES.greeting);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const addBotMessage = useCallback((intentKey) => {
    const response = RESPONSES[intentKey] || RESPONSES.fallback;
    setTyping(true);
    const delay = Math.min(500 + response.text.length * 6, 1600);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), role: "bot", text: response.text, action: response.action || null }]);
      if (response.quickReplies && QUICK_REPLIES[response.quickReplies]) {
        setQuickReplies(QUICK_REPLIES[response.quickReplies]);
      }
      if (response.navigate && patientId) {
        const routes = {
          dashboard: `/patient/${patientId}/dashboard`,
          appointments: `/patient/${patientId}/appointments`,
          queries: `/patient/${patientId}/my-queries`,
        };
        if (routes[response.navigate]) {
          setTimeout(() => navigate(routes[response.navigate]), 900);
        }
      }
    }, delay);
  }, [navigate, patientId]);

  useEffect(() => {
    if (open && !hasGreeted) {
      setHasGreeted(true);
      setTimeout(() => addBotMessage("greeting"), 350);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 420);
  }, [open, hasGreeted, addBotMessage]);

  const handleSend = (text = input.trim()) => {
    if (!text || typing) return;
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text }]);
    setInput("");
    addBotMessage(matchIntent(text));
  };

  const handleChip = (chip) => {
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: chip.label }]);
    addBotMessage(chip.intent);
  };

  const clearChat = () => {
    setMessages([]); setHasGreeted(false);
    setQuickReplies(QUICK_REPLIES.greeting);
    setTimeout(() => addBotMessage("greeting"), 200);
  };

  return (
    <>
      <style>{style}</style>

      <button className={`hb-fab ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)} aria-label="Toggle MediBot">
        <span className="hb-fab-icon">{open ? "✕" : BOT_AVATAR}</span>
        {!open && <span className="hb-pulse" />}
      </button>

      {open && (
        <div className="hb-window" role="dialog" aria-label="MediBot assistant">
          {/* Header */}
          <div className="hb-header">
            <div className="hb-avatar">{BOT_AVATAR}</div>
            <div className="hb-header-info">
              <div className="hb-header-name">{BOT_NAME}</div>
              <div className="hb-header-status"><span className="hb-status-dot" />Online · Your Portal Assistant</div>
            </div>
            <div className="hb-header-btns">
              <button className="hb-icon-btn" onClick={clearChat} title="Restart chat">↺</button>
              <button className="hb-icon-btn" onClick={() => setOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="hb-messages">
            {messages.length === 0 && !typing && (
              <div className="hb-empty-state">
                <div className="hb-empty-icon">🏥</div>
                <div className="hb-empty-title">Hello! I am MediBot</div>
                <div className="hb-empty-sub">Ask me anything about the portal, or pick a quick option below to get started.</div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`hb-msg ${msg.role}`}>
                <div className="hb-msg-avatar">{msg.role === "bot" ? BOT_AVATAR : "👤"}</div>
                <div className="hb-bubble">
                  {renderText(msg.text)}
                  {msg.action && (
                    <button className="hb-action-btn" onClick={() => handleChip(msg.action)}>
                      {msg.action.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="hb-msg bot">
                <div className="hb-msg-avatar">{BOT_AVATAR}</div>
                <div className="hb-bubble" style={{ padding: "12px 14px" }}>
                  <div className="hb-typing"><div className="hb-dot"/><div className="hb-dot"/><div className="hb-dot"/></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {quickReplies.length > 0 && (
            <div className="hb-quick-wrap">
              <div className="hb-quick-label">Quick help</div>
              <div className="hb-quick-chips">
                {quickReplies.map(qr => (
                  <button key={qr.intent} className="hb-chip" onClick={() => handleChip(qr)}>{qr.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="hb-input-row">
            <textarea
              ref={inputRef}
              className="hb-input"
              placeholder="Type your question…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              rows={1}
            />
            <button className="hb-send" onClick={() => handleSend()} disabled={!input.trim() || typing}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
