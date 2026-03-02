import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Merriweather:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .page { min-height: 100vh; background: #f0f4f8; font-family: 'Source Sans 3', sans-serif; }
  .topnav { background: linear-gradient(90deg, #005b96 0%, #003f6e 100%); padding: 0 36px; display: flex; align-items: center; justify-content: space-between; height: 68px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); }
  .nav-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .nav-cross { width: 38px; height: 38px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; }
  .nav-cross-h { position: absolute; width: 22px; height: 7px; background: #e02020; border-radius: 2px; }
  .nav-cross-v { position: absolute; width: 7px; height: 22px; background: #e02020; border-radius: 2px; }
  .nav-title { font-family: 'Merriweather', serif; font-size: 18px; font-weight: 700; color: white; }
  .nav-title span { display: block; font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.65); }
  .nav-right { display: flex; gap: 10px; align-items: center; }
  .nav-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .nav-btn-outline { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.5); }
  .nav-btn-outline:hover { background: rgba(255,255,255,0.12); }
  .nav-btn-primary { background: white; color: #005b96; }
  .nav-btn-primary:hover { background: #e8f4ff; }
  .nav-btn-logout { background: #fee2e2; color: #991b1b; }
  .nav-btn-logout:hover { background: #fecaca; }
  .content { max-width: 860px; margin: 0 auto; padding: 32px 24px; }
  .page-header { margin-bottom: 24px; }
  .page-header h1 { font-family: 'Merriweather', serif; font-size: 26px; color: #0d1b2a; font-weight: 700; margin-bottom: 4px; }
  .page-header p { font-size: 15px; color: #64748b; }
  .filter-tabs { display: flex; gap: 6px; background: white; border-radius: 12px; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 24px; width: fit-content; }
  .filter-tab { padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; color: #64748b; background: transparent; }
  .filter-tab.active { background: #005b96; color: white; box-shadow: 0 2px 8px rgba(0,91,150,0.3); }
  .filter-tab:hover:not(.active) { background: #f1f5f9; }
  .query-list { display: flex; flex-direction: column; gap: 14px; }
  .query-card { background: white; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-left: 5px solid #c8d6e5; cursor: pointer; transition: transform 0.2s; }
  .query-card:hover { transform: translateY(-2px); }
  .query-card.pending { border-left-color: #f59e0b; }
  .query-card.resolved { border-left-color: #22c55e; }
  .query-card.review { border-left-color: #8b5cf6; }
  .query-header { padding: 16px 20px 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .query-cat { font-size: 17px; font-weight: 700; color: #0d1b2a; font-family: 'Merriweather', serif; }
  .query-date { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; flex-shrink: 0; }
  .query-msg { padding: 10px 20px 0; font-size: 14px; color: #475569; line-height: 1.6; }
  .query-msg.collapsed { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .query-footer { padding: 12px 20px; border-top: 1px solid #f1f5f9; margin-top: 12px; display: flex; align-items: center; gap: 10px; }
  .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-confirmed { background: #dcfce7; color: #166534; }
  .badge-review { background: #e0e7ff; color: #3730a3; }
  .badge-info { background: #dbeafe; color: #1e40af; }
  .expand-hint { font-size: 12px; color: #0072bb; font-weight: 600; margin-left: auto; }
  .empty-state { background: white; border-radius: 16px; padding: 60px 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .empty-icon { font-size: 52px; margin-bottom: 14px; }
  .empty-title { font-size: 20px; font-weight: 700; color: #1e3a5f; font-family: 'Merriweather', serif; margin-bottom: 6px; }
  .empty-sub { font-size: 15px; color: #64748b; }
  .ask-btn { margin-top: 20px; padding: 12px 28px; background: #0072bb; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .ask-btn:hover { background: #005b96; }
  .loading { text-align: center; padding: 60px; color: #64748b; font-size: 16px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal-box { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 460px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); }
  .modal-title { font-family: 'Merriweather', serif; font-size: 20px; font-weight: 700; color: #0d1b2a; margin-bottom: 5px; }
  .modal-subtitle { font-size: 14px; color: #64748b; margin-bottom: 20px; }
  .modal-field { margin-bottom: 16px; }
  .modal-field label { display: block; font-size: 11px; font-weight: 700; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .modal-field select, .modal-field textarea { width: 100%; padding: 12px 14px; font-size: 15px; font-family: 'Source Sans 3', sans-serif; border: 2px solid #c8d6e5; border-radius: 10px; background: white; color: #0d1b2a; outline: none; transition: border-color 0.2s; }
  .modal-field textarea { resize: vertical; min-height: 100px; }
  .modal-field select:focus, .modal-field textarea:focus { border-color: #0072bb; }
  .modal-btns { display: flex; gap: 10px; margin-top: 8px; }
  .modal-btn-cancel { flex: 1; padding: 12px; background: #f1f5f9; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'Source Sans 3', sans-serif; }
  .modal-btn-submit { flex: 2; padding: 12px; background: #0072bb; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: white; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .modal-btn-submit:hover { background: #005b96; }
  .toast { position: fixed; bottom: 28px; right: 28px; background: #0d1b2a; color: white; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.25); z-index: 200; }
  @media (max-width: 640px) { .topnav { padding: 0 16px; } .content { padding: 20px 16px; } }
`;

const badgeColor = (s) => {
  const m = { pending: "badge-pending", confirmed: "badge-confirmed", review: "badge-review" };
  return m[s?.toLowerCase()] || "badge-info";
};

const cardClass = (s) => {
  const m = { pending: "pending", confirmed: "resolved", review: "review" };
  return m[s?.toLowerCase()] || "";
};

export default function MyQueries() {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [qForm, setQForm] = useState({ category: "", message: "" });

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await fetch(
  `http://localhost:8000/patient/${patient_id}/queries?filter=${filter}`
);
      if (res.ok) setQueries(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQueries(); }, [filter]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleLogout = () => { sessionStorage.clear(); navigate("/patient/login"); };

  const submitQuery = async () => {
    if (!qForm.category || !qForm.message) return;
    try {
      const res = await fetch(`/patient/${patient_id}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qForm),
      });
      if (res.ok) {
        setQForm({ category: "", message: "" });
        setModal(false);
        showToast("✅ Query submitted!");
        fetchQueries();
      } else {
        const e = await res.json();
        showToast("❌ " + (e.detail || "Failed"));
      }
    } catch { showToast("❌ Server error"); }
  };

  return (
    <>
      <style>{style}</style>
      <div className="page">
        <nav className="topnav">
          <div className="nav-brand" onClick={() => navigate(`/patient/${patient_id}/dashboard`)}>
            <div className="nav-cross"><div className="nav-cross-h" /><div className="nav-cross-v" /></div>
            <div className="nav-title">MediCare General Hospital<span>← Back to Dashboard</span></div>
          </div>
          <div className="nav-right">
            <button className="nav-btn nav-btn-outline" onClick={() => navigate(`/patient/${patient_id}/appointments`)}>📅 Appointments</button>
            <button className="nav-btn nav-btn-primary" onClick={() => setModal(true)}>✉️ Ask New Query</button>
            <button className="nav-btn nav-btn-logout" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </nav>

        <div className="content">
          <div className="page-header">
            <h1>✉️ My Health Queries</h1>
            <p>Track all your questions to the care team — pending, under review, and resolved.</p>
          </div>

          <div className="filter-tabs">
            {[["all", "All Queries"], ["pending", "⏳ Pending"], ["resolved", "✅ Resolved"]].map(([val, label]) => (
              <button key={val} className={`filter-tab ${filter === val ? "active" : ""}`} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading queries…</div>
          ) : queries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{filter === "pending" ? "⏳" : filter === "resolved" ? "✅" : "💬"}</div>
              <div className="empty-title">{filter === "pending" ? "No pending queries" : filter === "resolved" ? "No resolved queries yet" : "No queries yet"}</div>
              <div className="empty-sub">Ask your doctor a question to get started.</div>
              <button className="ask-btn" onClick={() => setModal(true)}>+ Ask a Question</button>
            </div>
          ) : (
            <div className="query-list">
              {queries.map(q => (
                <div key={q.query_id} className={`query-card ${cardClass(q.status)}`} onClick={() => setExpanded(expanded === q.query_id ? null : q.query_id)}>
                  <div className="query-header">
                    <div className="query-cat">{q.category}</div>
                    <div className="query-date">{q.created_at ? new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</div>
                  </div>
                  <div className={`query-msg ${expanded !== q.query_id ? "collapsed" : ""}`}>{q.message}</div>
                  <div className="query-footer">
                    <span className={`badge ${badgeColor(q.status)}`}>{q.status}</span>
                    <span className="expand-hint">{expanded === q.query_id ? "▲ Collapse" : "▼ Read more"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-title">✉️ Ask a Health Query</div>
            <div className="modal-subtitle">Our care team will respond to your question shortly.</div>
            <div className="modal-field"><label>Category</label>
              <select value={qForm.category} onChange={e => setQForm({ ...qForm, category: e.target.value })}>
                <option value="">-- Select a category --</option>
                <option>General Health</option><option>Medication</option><option>Lab Results</option>
                <option>Diet & Nutrition</option><option>Mental Health</option><option>Other</option>
              </select>
            </div>
            <div className="modal-field"><label>Your Question</label>
              <textarea placeholder="Describe your concern in detail…" value={qForm.message} onChange={e => setQForm({ ...qForm, message: e.target.value })} />
            </div>
            <div className="modal-btns">
              <button className="modal-btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="modal-btn-submit" onClick={submitQuery}>Send Query →</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
