import { useState, useEffect,useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Merriweather:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Source Sans 3', sans-serif; background: #f0f4f8; }
  .page { min-height: 100vh; background: #f0f4f8; }
  .topnav { background: linear-gradient(90deg, #005b96 0%, #003f6e 100%); padding: 0 36px; display: flex; align-items: center; justify-content: space-between; height: 68px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); }
  .nav-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .nav-cross { width: 38px; height: 38px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
  .nav-cross-h { position: absolute; width: 22px; height: 7px; background: #e02020; border-radius: 2px; }
  .nav-cross-v { position: absolute; width: 7px; height: 22px; background: #e02020; border-radius: 2px; }
  .nav-title { font-family: 'Merriweather', serif; font-size: 18px; font-weight: 700; color: white; }
  .nav-title span { display: block; font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.65); }
  .nav-right { display: flex; gap: 10px; align-items: center; }
  .nav-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .nav-btn-outline { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.5); }
  .nav-btn-outline:hover { background: rgba(255,255,255,0.12); }
  .nav-btn-success { background: #22c55e; color: white; }
  .nav-btn-success:hover { background: #16a34a; }
  .nav-btn-logout { background: #fee2e2; color: #991b1b; }
  .nav-btn-logout:hover { background: #fecaca; }
  .content { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
  .page-header { margin-bottom: 24px; }
  .page-header h1 { font-family: 'Merriweather', serif; font-size: 26px; color: #0d1b2a; font-weight: 700; margin-bottom: 4px; }
  .page-header p { font-size: 15px; color: #64748b; }
  .filter-tabs { display: flex; gap: 6px; background: white; border-radius: 12px; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 24px; width: fit-content; }
  .filter-tab { padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; color: #64748b; background: transparent; }
  .filter-tab.active { background: #005b96; color: white; box-shadow: 0 2px 8px rgba(0,91,150,0.3); }
  .filter-tab:hover:not(.active) { background: #f1f5f9; }
  .appt-list { display: flex; flex-direction: column; gap: 14px; }
  .appt-card { background: white; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); overflow: hidden; border-left: 5px solid #c8d6e5; transition: transform 0.2s; }
  .appt-card:hover { transform: translateY(-2px); }
  .appt-card.upcoming { border-left-color: #22c55e; }
  .appt-card.past { border-left-color: #94a3b8; }
  .appt-card.cancelled { border-left-color: #ef4444; }
  .appt-body { padding: 18px 22px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .appt-main { flex: 1; }
  .appt-dept { font-size: 18px; font-weight: 700; color: #0d1b2a; margin-bottom: 8px; font-family: 'Merriweather', serif; }
  .appt-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
  .chip { display: inline-flex; align-items: center; gap: 5px; background: #f1f5f9; border-radius: 20px; padding: 5px 12px; font-size: 13px; color: #475569; font-weight: 600; }
  .appt-reason { font-size: 14px; color: #64748b; line-height: 1.5; }
  .appt-side { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .badge { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-confirmed { background: #dcfce7; color: #166534; }
  .badge-cancelled { background: #fee2e2; color: #991b1b; }
  .badge-info { background: #dbeafe; color: #1e40af; }
  .empty-state { background: white; border-radius: 16px; padding: 60px 40px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .empty-icon { font-size: 52px; margin-bottom: 14px; }
  .empty-title { font-size: 20px; font-weight: 700; color: #1e3a5f; font-family: 'Merriweather', serif; margin-bottom: 6px; }
  .empty-sub { font-size: 15px; color: #64748b; }
  .book-btn { margin-top: 20px; padding: 12px 28px; background: #0072bb; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .book-btn:hover { background: #005b96; }
  .loading { text-align: center; padding: 60px; color: #64748b; font-size: 16px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal-box { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 460px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); }
  .modal-title { font-family: 'Merriweather', serif; font-size: 20px; font-weight: 700; color: #0d1b2a; margin-bottom: 5px; }
  .modal-subtitle { font-size: 14px; color: #64748b; margin-bottom: 20px; }
  .modal-field { margin-bottom: 16px; }
  .modal-field label { display: block; font-size: 11px; font-weight: 700; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .modal-field input, .modal-field select, .modal-field textarea { width: 100%; padding: 12px 14px; font-size: 15px; font-family: 'Source Sans 3', sans-serif; border: 2px solid #c8d6e5; border-radius: 10px; background: white; color: #0d1b2a; outline: none; transition: border-color 0.2s; }
  .modal-field textarea { resize: vertical; min-height: 65px; }
  .modal-field input:focus, .modal-field select:focus, .modal-field textarea:focus { border-color: #0072bb; }
  .modal-btns { display: flex; gap: 10px; margin-top: 8px; }
  .modal-btn-cancel { flex: 1; padding: 12px; background: #f1f5f9; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'Source Sans 3', sans-serif; }
  .modal-btn-submit { flex: 2; padding: 12px; background: #0072bb; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: white; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; }
  .modal-btn-submit:hover { background: #005b96; }
  .toast { position: fixed; bottom: 28px; right: 28px; background: #0d1b2a; color: white; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.25); z-index: 200; }
  @media (max-width: 640px) { .topnav { padding: 0 16px; } .content { padding: 20px 16px; } .appt-body { flex-direction: column; } .appt-side { align-items: flex-start; flex-direction: row; } }
`;

const badgeColor = (s) => {
  const m = { pending: "badge-pending", confirmed: "badge-confirmed", cancelled: "badge-cancelled" };
  return m[s?.toLowerCase()] || "badge-info";
};


export default function MyAppointments() {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'past'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [aForm, setAForm] = useState({ department: "", preferred_date: "", preferred_time: "", reason: "" });

  // 1. Fetch logic updated to use Query Params
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // We pass the filter state to the "view" parameter we defined in FastAPI
      const res = await fetch(
  `http://localhost:8000/patient/${patient_id}/appointments?view=${filter}`
);
      if (res.ok) {
        const data = await res.json();
        // Backend returns a direct list
        setAppointments(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      showToast("❌ Could not load appointments");
    } finally {
      setLoading(false);
    }
  }, [patient_id, filter]);

  // 2. Trigger fetch on load AND whenever filter changes
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleLogout = () => { sessionStorage.clear(); navigate("/patient/login"); };

  const submitAppointment = async () => {
  if (!aForm.department || !aForm.preferred_date || !aForm.preferred_time) return;

  try {
    const res = await fetch(
      `http://localhost:8000/patient/${patient_id}/appointment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aForm),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to book appointment");
    }

    setAForm({
      department: "",
      preferred_date: "",
      preferred_time: "",
      reason: "",
    });

    setModal(false);
    showToast("📅 Appointment booked!");
    fetchAppointments(); // Refresh list
  } catch (err) {
    console.error("Booking error:", err);
    showToast("❌ " + err.message);
  }
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
            <button className="nav-btn nav-btn-outline" onClick={() => navigate(`/patient/${patient_id}/my-queries`)}>✉️ My Queries</button>
            <button className="nav-btn nav-btn-success" onClick={() => setModal(true)}>📅 Book New</button>
            <button className="nav-btn nav-btn-logout" onClick={handleLogout}>🚪 Logout</button>
          </div>
        </nav>

        <div className="content">
          <div className="page-header">
            <h1>📅 My Appointments</h1>
            <p>Viewing your {filter} records.</p>
          </div>

          <div className="filter-tabs">
            {[["all", "All"], ["upcoming", "⬆️ Upcoming"], ["past", "⬇️ Past"]].map(([val, label]) => (
              <button 
                key={val} 
                className={`filter-tab ${filter === val ? "active" : ""}`} 
                onClick={() => setFilter(val)}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading appointments…</div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <div className="empty-title">No {filter} appointments found</div>
              <div className="empty-sub">Try changing the filter or book a new one.</div>
              <button className="book-btn" onClick={() => setModal(true)}>+ Book Appointment</button>
            </div>
          ) : (
            <div className="appt-list">
              {appointments.map(a => (
                  <div key={a.appt_id} className={`appt-card ${a.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'upcoming'}`}>
                    <div className="appt-body">
                      <div className="appt-main">
                        <div className="appt-dept">{a.department}</div>
                        <div className="appt-chips">
                          <span className="chip">📆 {a.preferred_date}</span>
                          <span className="chip">🕐 {a.preferred_time}</span>
                        </div>
                        {a.reason && <div className="appt-reason">📝 {a.reason}</div>}
                      </div>
                      <div className="appt-side">
                        <span className={`badge ${badgeColor(a.status)}`}>{a.status}</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal logic remains same */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal-box">
            <div className="modal-title">📅 Book an Appointment</div>
            <div className="modal-subtitle">We'll confirm your visit shortly.</div>
            <div className="modal-field"><label>Department</label>
              <select value={aForm.department} onChange={e => setAForm({ ...aForm, department: e.target.value })}>
                <option value="">-- Select a department --</option>
                <option>General Checkup</option><option>Cardiology</option><option>Orthopedics</option>
                <option>Neurology</option><option>Dermatology</option><option>Ophthalmology</option>
                <option>ENT</option><option>Diabetes & Endocrinology</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="modal-field" style={{ flex: 1 }}><label>Date</label><input type="date" value={aForm.preferred_date} onChange={e => setAForm({ ...aForm, preferred_date: e.target.value })} /></div>
              <div className="modal-field" style={{ flex: 1 }}><label>Time</label><input type="time" value={aForm.preferred_time} onChange={e => setAForm({ ...aForm, preferred_time: e.target.value })} /></div>
            </div>
            <div className="modal-field"><label>Reason (optional)</label><textarea placeholder="Reason for visit…" value={aForm.reason} onChange={e => setAForm({ ...aForm, reason: e.target.value })} /></div>
            <div className="modal-btns">
              <button className="modal-btn-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="modal-btn-submit" onClick={submitAppointment}>Book →</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}