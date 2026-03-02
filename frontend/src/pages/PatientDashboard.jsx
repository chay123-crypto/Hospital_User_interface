import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Merriweather:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .dashboard { min-height: 100vh; background: #f0f4f8; font-family: 'Source Sans 3', sans-serif; }
  .topnav { background: linear-gradient(90deg, #005b96 0%, #003f6e 100%); padding: 0 36px; display: flex; align-items: center; justify-content: space-between; height: 68px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); }
  .nav-brand { display: flex; align-items: center; gap: 12px; }
  .nav-cross { width: 38px; height: 38px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
  .nav-cross-h { position: absolute; width: 22px; height: 7px; background: #e02020; border-radius: 2px; }
  .nav-cross-v { position: absolute; width: 7px; height: 22px; background: #e02020; border-radius: 2px; }
  .nav-title { font-family: 'Merriweather', serif; font-size: 18px; font-weight: 700; color: white; line-height: 1.2; }
  .nav-title span { display: block; font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.65); font-family: 'Source Sans 3', sans-serif; letter-spacing: 0.5px; }
  .nav-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .nav-btn { padding: 8px 15px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
  .nav-btn-primary { background: white; color: #005b96; }
  .nav-btn-primary:hover { background: #e8f4ff; }
  .nav-btn-success { background: #22c55e; color: white; }
  .nav-btn-success:hover { background: #16a34a; }
  .nav-btn-outline { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.5); }
  .nav-btn-outline:hover { background: rgba(255,255,255,0.12); }
  .nav-btn-logout { background: #fee2e2; color: #991b1b; }
  .nav-btn-logout:hover { background: #fecaca; }
  .nav-avatar { width: 38px; height: 38px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; border: 2px solid rgba(255,255,255,0.4); flex-shrink: 0; }
  .welcome-banner { background: white; border-bottom: 1px solid #e2e8f0; padding: 20px 36px; display: flex; align-items: center; justify-content: space-between; }
  .welcome-text h2 { font-family: 'Merriweather', serif; font-size: 22px; color: #0d1b2a; font-weight: 700; margin-bottom: 3px; }
  .welcome-text p { font-size: 15px; color: #64748b; font-weight: 300; }
  .stats-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .stat-pill { background: #f0f7ff; border: 1.5px solid #bfdbfe; border-radius: 30px; padding: 7px 16px; display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: #1e3a5f; cursor: pointer; transition: all 0.2s; }
  .stat-pill:hover { background: #dbeafe; }
  .vitals-strip { padding: 20px 36px 0; }
  .vitals-title { font-family: 'Merriweather', serif; font-size: 17px; font-weight: 700; color: #0d1b2a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .vitals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 14px; }
  .vital-card { background: white; border-radius: 14px; padding: 18px 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 6px; border-top: 4px solid #e2e8f0; transition: transform 0.2s; }
  .vital-card:hover { transform: translateY(-2px); }
  .vital-card.heart { border-top-color: #ef4444; }
  .vital-card.bp { border-top-color: #8b5cf6; }
  .vital-card.glucose { border-top-color: #f59e0b; }
  .vital-card.oxygen { border-top-color: #3b82f6; }
  .vital-card.temp { border-top-color: #f97316; }
  .vital-card.weight { border-top-color: #10b981; }
  .vital-icon { font-size: 24px; }
  .vital-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  .vital-value { font-size: 26px; font-weight: 700; color: #0d1b2a; line-height: 1; }
  .vital-unit { font-size: 12px; color: #64748b; font-weight: 500; }
  .vital-status { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; width: fit-content; }
  .vital-status.normal { background: #dcfce7; color: #166534; }
  .vital-status.warning { background: #fef3c7; color: #92400e; }
  .vital-status.danger { background: #fee2e2; color: #991b1b; }
  .vital-status.na { background: #f1f5f9; color: #64748b; }
  .vitals-log-btn { margin-top: 14px; padding: 10px 20px; background: #0072bb; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .vitals-log-btn:hover { background: #005b96; }
  .main-content { padding: 24px 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .section-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden; }
  .section-header { padding: 16px 20px 14px; border-bottom: 2px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; }
  .section-header-left { display: flex; align-items: center; gap: 10px; }
  .section-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .section-icon-blue { background: #dbeafe; }
  .section-icon-green { background: #dcfce7; }
  .section-title { font-family: 'Merriweather', serif; font-size: 16px; font-weight: 700; color: #0d1b2a; }
  .section-count { background: #005b96; color: white; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
  .view-all-link { font-size: 13px; color: #0072bb; font-weight: 700; cursor: pointer; background: none; border: none; font-family: 'Source Sans 3', sans-serif; }
  .view-all-link:hover { text-decoration: underline; }
  .items-list { padding: 6px 0; max-height: 300px; overflow-y: auto; }
  .item { padding: 14px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.15s; }
  .item:last-child { border-bottom: none; }
  .item:hover { background: #f8fafc; }
  .item-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 5px; }
  .item-category { font-size: 14px; font-weight: 700; color: #1e3a5f; }
  .item-date { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
  .item-msg { font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .item-footer { display: flex; align-items: center; gap: 7px; }
  .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-confirmed { background: #dcfce7; color: #166534; }
  .badge-review { background: #e0e7ff; color: #3730a3; }
  .badge-cancelled { background: #fee2e2; color: #991b1b; }
  .badge-info { background: #dbeafe; color: #1e40af; }
  .item-detail-chip { display: flex; align-items: center; gap: 4px; background: #f1f5f9; border-radius: 6px; padding: 2px 8px; font-size: 11px; color: #64748b; font-weight: 600; }
  .empty-state { padding: 36px 20px; text-align: center; color: #94a3b8; }
  .empty-state-icon { font-size: 36px; margin-bottom: 8px; }
  .empty-state-text { font-size: 15px; font-weight: 600; color: #64748b; margin-bottom: 3px; }
  .empty-state-sub { font-size: 13px; color: #94a3b8; }
  .card-add-btn { width: 100%; padding: 12px; background: none; border: 2px dashed #c8d6e5; border-radius: 0 0 16px 16px; font-size: 14px; font-weight: 600; color: #0072bb; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .card-add-btn:hover { background: #f0f7ff; border-color: #0072bb; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal-box { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: 'Merriweather', serif; font-size: 20px; font-weight: 700; color: #0d1b2a; margin-bottom: 5px; }
  .modal-subtitle { font-size: 14px; color: #64748b; margin-bottom: 22px; }
  .modal-field { margin-bottom: 16px; }
  .modal-field label { display: block; font-size: 11px; font-weight: 700; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .modal-field input, .modal-field select, .modal-field textarea { width: 100%; padding: 12px 14px; font-size: 15px; font-family: 'Source Sans 3', sans-serif; border: 2px solid #c8d6e5; border-radius: 10px; background: white; color: #0d1b2a; outline: none; transition: border-color 0.2s; }
  .modal-field textarea { resize: vertical; min-height: 70px; }
  .modal-field input:focus, .modal-field select:focus, .modal-field textarea:focus { border-color: #0072bb; box-shadow: 0 0 0 3px rgba(0,114,187,0.1); }
  .vitals-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-btns { display: flex; gap: 10px; margin-top: 8px; }
  .modal-btn-cancel { flex: 1; padding: 12px; background: #f1f5f9; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: background 0.2s; }
  .modal-btn-cancel:hover { background: #e2e8f0; }
  .modal-btn-submit { flex: 2; padding: 12px; background: #0072bb; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: white; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .modal-btn-submit:hover { background: #005b96; transform: translateY(-1px); }
  .loading-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 300; gap: 16px; }
  .loading-spinner { width: 48px; height: 48px; border: 5px solid #dbeafe; border-top-color: #0072bb; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .loading-text { font-size: 16px; font-weight: 600; color: #1e3a5f; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .toast { position: fixed; bottom: 28px; right: 28px; background: #0d1b2a; color: white; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 10px; z-index: 200; animation: toastIn 0.3s ease both; }
  @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 768px) { .topnav { padding: 0 16px; height: auto; min-height: 68px; padding-top: 10px; padding-bottom: 10px; } .welcome-banner { padding: 16px; flex-direction: column; align-items: flex-start; gap: 12px; } .vitals-strip { padding: 16px 16px 0; } .main-content { grid-template-columns: 1fr; padding: 16px; } }
`;

const statusColor = (s) => {
  const map = { pending: "badge-pending", confirmed: "badge-confirmed", review: "badge-review", cancelled: "badge-cancelled" };
  return map[s?.toLowerCase()] || "badge-info";
};

const vitalStatus = (type, value) => {
  if (value == null) return "na";
  if (type === "heart_rate") return value >= 60 && value <= 100 ? "normal" : value >= 50 && value <= 120 ? "warning" : "danger";
  if (type === "systolic_bp") return value < 120 ? "normal" : value < 140 ? "warning" : "danger";
  if (type === "diastolic_bp") return value < 80 ? "normal" : value < 90 ? "warning" : "danger";
  if (type === "blood_glucose") return value < 100 ? "normal" : value < 126 ? "warning" : "danger";
  if (type === "oxygen_saturation") return value >= 95 ? "normal" : value >= 90 ? "warning" : "danger";
  if (type === "temperature") return value >= 97 && value <= 99.5 ? "normal" : "warning";
  return "normal";
};

const vitalLabel = (type, value) => {
  if (value == null) return "Not logged";
  const s = vitalStatus(type, value);
  return s === "normal" ? "Normal" : s === "warning" ? "Monitor" : "High Risk";
};

export default function PatientDashboard() {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const patientId = patient_id;
  const patientName = sessionStorage.getItem("patient_name") || "Patient";

  const [queries, setQueries] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const [qForm, setQForm] = useState({ category: "", message: "" });
  const [aForm, setAForm] = useState({ department: "", preferred_date: "", preferred_time: "", reason: "" });
  const [vForm, setVForm] = useState({ heart_rate: "", systolic_bp: "", diastolic_bp: "", blood_glucose: "", oxygen_saturation: "", temperature: "", weight: "", notes: "" });

  const fetchDashboard = async () => {
    if (!patientId) return;
    try {
      const res = await fetch(`/patient/${patientId}/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setQueries(data.queries || []);
        setAppointments(data.appointments || []);
        setVitals(data.latest_vitals || null);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/patient/login");
  };

  const submitQuery = async () => {
    if (!qForm.category || !qForm.message) return;
    try {
      const res = await fetch(`/patient/${patientId}/query`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(qForm) });
      if (res.ok) { setQForm({ category: "", message: "" }); setModal(null); showToast("✅ Query submitted!"); fetchDashboard(); }
      else { const e = await res.json(); showToast("❌ " + (e.detail || "Failed")); }
    } catch { showToast("❌ Server error"); }
  };

  const submitAppointment = async () => {
    if (!aForm.department || !aForm.preferred_date || !aForm.preferred_time) return;
    try {
      const res = await fetch(`/patient/${patientId}/appointment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aForm) });
      if (res.ok) { setAForm({ department: "", preferred_date: "", preferred_time: "", reason: "" }); setModal(null); showToast("📅 Appointment booked!"); fetchDashboard(); }
      else { const e = await res.json(); showToast("❌ " + (e.detail || "Failed")); }
    } catch { showToast("❌ Server error"); }
  };

  const submitVitals = async () => {
    const payload = {};
    Object.keys(vForm).forEach(k => { if (vForm[k] !== "") payload[k] = k === "notes" ? vForm[k] : parseFloat(vForm[k]); });
    try {
      const res = await fetch(`/patient/${patientId}/vitals`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setModal(null); showToast("❤️ Vitals logged!"); fetchDashboard(); }
      else { const e = await res.json(); showToast("❌ " + (e.detail || "Failed")); }
    } catch { showToast("❌ Server error"); }
  };

  const vitalCards = [
    { key: "heart_rate",         label: "Heart Rate",     icon: "❤️",  unit: "bpm",   cls: "heart",   value: vitals?.heart_rate },
    { key: "systolic_bp",        label: "Systolic BP",    icon: "🩺",  unit: "mmHg",  cls: "bp",      value: vitals?.systolic_bp },
    { key: "diastolic_bp",       label: "Diastolic BP",   icon: "💜",  unit: "mmHg",  cls: "bp",      value: vitals?.diastolic_bp },
    { key: "blood_glucose",      label: "Blood Glucose",  icon: "🩸",  unit: "mg/dL", cls: "glucose", value: vitals?.blood_glucose },
    { key: "oxygen_saturation",  label: "SpO₂",           icon: "🫁",  unit: "%",     cls: "oxygen",  value: vitals?.oxygen_saturation },
    { key: "temperature",        label: "Temperature",    icon: "🌡️", unit: "°F",    cls: "temp",    value: vitals?.temperature },
    { key: "weight",             label: "Weight",         icon: "⚖️",  unit: "kg",    cls: "weight",  value: vitals?.weight },
  ];

  const today = new Date().toISOString().split("T")[0];
  const upcomingCount = appointments.filter(a => String(a.preferred_date) >= today).length;
  const pendingQueries = queries.filter(q => q.status === "Pending").length;

  return (
    <>
      <style>{style}</style>
      <div className="dashboard">
        {loadingData && (<div className="loading-overlay"><div className="loading-spinner" /><div className="loading-text">Loading your health records…</div></div>)}

        {/* NAV */}
        <nav className="topnav">
          <div className="nav-brand">
            <div className="nav-cross"><div className="nav-cross-h" /><div className="nav-cross-v" /></div>
            <div className="nav-title">MediCare General Hospital<span>Patient Portal</span></div>
          </div>
          <div className="nav-right">
            <button className="nav-btn nav-btn-outline" onClick={() => navigate(`/patient/${patientId}/appointments`)}>📅 Appointments</button>
            <button className="nav-btn nav-btn-outline" onClick={() => navigate(`/patient/${patientId}/my-queries`)}>✉️ My Queries</button>
            <button className="nav-btn nav-btn-primary" onClick={() => setModal("query")}>✉️ New Query</button>
            <button className="nav-btn nav-btn-success" onClick={() => setModal("appointment")}>📅 Book</button>
            <div className="nav-avatar" title={patientName}>👤</div>
            <button className="nav-btn nav-btn-logout" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </nav>

        {/* WELCOME */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Good Day, {patientName} 👋</h2>
            <p>{vitals ? "Vitals last recorded on " + new Date(vitals.recorded_at).toLocaleDateString() + "." : "Log your vitals to track health trends."}</p>
          </div>
          <div className="stats-row">
            <div className="stat-pill" onClick={() => navigate(`/patient/${patientId}/my-queries`)}>📋 {queries.length} Queries ({pendingQueries} pending)</div>
            <div className="stat-pill" onClick={() => navigate(`/patient/${patientId}/appointments`)}>📅 {upcomingCount} Upcoming</div>
            <div className="stat-pill" style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#166534" }}>✅ {appointments.filter(a => a.status?.toLowerCase() === "confirmed").length} Confirmed</div>
          </div>
        </div>

        {/* VITALS STRIP */}
        <div className="vitals-strip">
          <div className="vitals-title">
            ❤️ Health Vitals
            {vitals
              ? <span style={{ fontSize: 13, fontWeight: 400, color: "#64748b" }}>— Last updated {new Date(vitals.recorded_at).toLocaleDateString()}</span>
              : <span style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8" }}>— No data yet</span>
            }
          </div>
          <div className="vitals-grid">
            {vitalCards.map(vc => (
              <div key={vc.key} className={`vital-card ${vc.cls}`}>
                <div className="vital-icon">{vc.icon}</div>
                <div className="vital-label">{vc.label}</div>
                <div className="vital-value">{vc.value ?? "—"}</div>
                <div className="vital-unit">{vc.unit}</div>
                <div className={`vital-status ${vc.value != null ? vitalStatus(vc.key, vc.value) : "na"}`}>
                  {vitalLabel(vc.key, vc.value)}
                </div>
              </div>
            ))}
          </div>
          <button className="vitals-log-btn" onClick={() => setModal("vitals")}>+ Log Today's Vitals</button>
        </div>

        {/* MAIN GRID */}
        <div className="main-content">

          {/* QUERIES */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-header-left">
                <div className="section-icon section-icon-blue">📋</div>
                <div className="section-title">Recent Queries</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="section-count">{queries.length}</span>
                <button className="view-all-link" onClick={() => navigate(`/patient/${patientId}/my-queries`)}>View All →</button>
              </div>
            </div>
            {queries.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">💬</div><div className="empty-state-text">No queries yet</div><div className="empty-state-sub">Ask your doctor a question</div></div>
            ) : (
              <div className="items-list">
                {queries.slice(0, 5).map(q => (
                  <div key={q.query_id} className="item">
                    <div className="item-top">
                      <div className="item-category">{q.category}</div>
                      <div className="item-date">{q.created_at ? new Date(q.created_at).toLocaleDateString() : ""}</div>
                    </div>
                    <div className="item-msg">{q.message}</div>
                    <div className="item-footer"><span className={`badge ${statusColor(q.status)}`}>{q.status}</span></div>
                  </div>
                ))}
              </div>
            )}
            <button className="card-add-btn" onClick={() => setModal("query")}>＋ Ask a New Question</button>
          </div>

          {/* APPOINTMENTS */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-header-left">
                <div className="section-icon section-icon-green">📅</div>
                <div className="section-title">Upcoming Appointments</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="section-count">{appointments.length}</span>
                <button className="view-all-link" onClick={() => navigate(`/patient/${patientId}/appointments`)}>View All →</button>
              </div>
            </div>
            {appointments.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">🏥</div><div className="empty-state-text">No appointments yet</div><div className="empty-state-sub">Book a visit below</div></div>
            ) : (
              <div className="items-list">
                {appointments.filter(a => String(a.preferred_date) >= today).slice(0, 5).map(a => (
                  <div key={a.appt_id} className="item">
                    <div className="item-top"><div className="item-category">{a.department}</div><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></div>
                    <div className="item-footer" style={{ marginTop: 6 }}>
                      <span className="item-detail-chip">📆 {a.preferred_date}</span>
                      <span className="item-detail-chip">🕐 {a.preferred_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="card-add-btn" onClick={() => setModal("appointment")}>＋ Book a New Appointment</button>
          </div>

        </div>
      </div>

      {/* QUERY MODAL */}
      {modal === "query" && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">✉️ Send a Health Query</div>
            <div className="modal-subtitle">Our care team will respond shortly.</div>
            <div className="modal-field"><label>Category</label>
              <select value={qForm.category} onChange={e => setQForm({ ...qForm, category: e.target.value })}>
                <option value="">-- Select a category --</option>
                <option>General Health</option><option>Medication</option><option>Lab Results</option><option>Diet & Nutrition</option><option>Mental Health</option><option>Other</option>
              </select>
            </div>
            <div className="modal-field"><label>Your Question</label>
              <textarea placeholder="Describe your concern in detail…" value={qForm.message} onChange={e => setQForm({ ...qForm, message: e.target.value })} />
            </div>
            <div className="modal-btns"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancel</button><button className="modal-btn-submit" onClick={submitQuery}>Send Query →</button></div>
          </div>
        </div>
      )}

      {/* APPOINTMENT MODAL */}
      {modal === "appointment" && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">📅 Book an Appointment</div>
            <div className="modal-subtitle">We'll confirm your visit shortly.</div>
            <div className="modal-field"><label>Department</label>
              <select value={aForm.department} onChange={e => setAForm({ ...aForm, department: e.target.value })}>
                <option value="">-- Select a department --</option>
                <option>General Checkup</option><option>Cardiology</option><option>Orthopedics</option><option>Neurology</option><option>Dermatology</option><option>Ophthalmology</option><option>ENT</option><option>Diabetes & Endocrinology</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="modal-field" style={{ flex: 1 }}><label>Date</label><input type="date" value={aForm.preferred_date} onChange={e => setAForm({ ...aForm, preferred_date: e.target.value })} /></div>
              <div className="modal-field" style={{ flex: 1 }}><label>Time</label><input type="time" value={aForm.preferred_time} onChange={e => setAForm({ ...aForm, preferred_time: e.target.value })} /></div>
            </div>
            <div className="modal-field"><label>Reason (optional)</label><textarea placeholder="Reason for visit…" value={aForm.reason} onChange={e => setAForm({ ...aForm, reason: e.target.value })} style={{ minHeight: 60 }} /></div>
            <div className="modal-btns"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancel</button><button className="modal-btn-submit" onClick={submitAppointment}>Book Appointment →</button></div>
          </div>
        </div>
      )}

      {/* VITALS MODAL */}
      {modal === "vitals" && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="modal-title">❤️ Log Health Vitals</div>
            <div className="modal-subtitle">All fields are optional — enter whichever readings you have.</div>
            <div className="vitals-grid-modal">
              <div className="modal-field"><label>Heart Rate (bpm)</label><input type="number" placeholder="e.g. 72" value={vForm.heart_rate} onChange={e => setVForm({ ...vForm, heart_rate: e.target.value })} /></div>
              <div className="modal-field"><label>Systolic BP (mmHg)</label><input type="number" placeholder="e.g. 120" value={vForm.systolic_bp} onChange={e => setVForm({ ...vForm, systolic_bp: e.target.value })} /></div>
              <div className="modal-field"><label>Diastolic BP (mmHg)</label><input type="number" placeholder="e.g. 80" value={vForm.diastolic_bp} onChange={e => setVForm({ ...vForm, diastolic_bp: e.target.value })} /></div>
              <div className="modal-field"><label>Blood Glucose (mg/dL)</label><input type="number" placeholder="e.g. 95" value={vForm.blood_glucose} onChange={e => setVForm({ ...vForm, blood_glucose: e.target.value })} /></div>
              <div className="modal-field"><label>SpO₂ (%)</label><input type="number" placeholder="e.g. 98" value={vForm.oxygen_saturation} onChange={e => setVForm({ ...vForm, oxygen_saturation: e.target.value })} /></div>
              <div className="modal-field"><label>Temperature (°F)</label><input type="number" placeholder="e.g. 98.6" value={vForm.temperature} onChange={e => setVForm({ ...vForm, temperature: e.target.value })} /></div>
              <div className="modal-field"><label>Weight (kg)</label><input type="number" placeholder="e.g. 70" value={vForm.weight} onChange={e => setVForm({ ...vForm, weight: e.target.value })} /></div>
            </div>
            <div className="modal-field"><label>Notes (optional)</label><textarea placeholder="Any additional notes…" value={vForm.notes} onChange={e => setVForm({ ...vForm, notes: e.target.value })} style={{ minHeight: 55 }} /></div>
            <div className="modal-btns"><button className="modal-btn-cancel" onClick={() => setModal(null)}>Cancel</button><button className="modal-btn-submit" onClick={submitVitals}>Log Vitals →</button></div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
