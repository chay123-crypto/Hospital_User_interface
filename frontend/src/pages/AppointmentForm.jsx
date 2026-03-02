import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Merriweather:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .page-wrapper {
    display: flex;
    align-items: stretch;
    min-height: 100vh;
    font-family: 'Source Sans 3', sans-serif;
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    width: 38%;
    background: linear-gradient(170deg, #005b96 0%, #003f6e 60%, #00274d 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 36px;
    position: relative;
    overflow: hidden;
  }

  .left-panel::before {
    content: ''; position: absolute;
    top: -60px; left: -60px;
    width: 260px; height: 260px;
    border-radius: 50%; background: rgba(255,255,255,0.05);
  }
  .left-panel::after {
    content: ''; position: absolute;
    bottom: -80px; right: -80px;
    width: 300px; height: 300px;
    border-radius: 50%; background: rgba(255,255,255,0.04);
  }

  .cross-icon {
    width: 80px; height: 80px; background: white;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px; position: relative; z-index: 1;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    animation: fadeIn 0.7s ease both;
  }
  .cross-h { position: absolute; width: 48px; height: 16px; background: #e02020; border-radius: 3px; }
  .cross-v { position: absolute; width: 16px; height: 48px; background: #e02020; border-radius: 3px; }

  .hospital-name {
    font-family: 'Merriweather', serif;
    font-size: 22px; font-weight: 700; color: white;
    text-align: center; margin-bottom: 8px; line-height: 1.3;
    position: relative; z-index: 1;
    animation: fadeIn 0.7s 0.1s ease both;
  }

  .divider-horiz {
    width: 44px; height: 3px;
    background: rgba(255,255,255,0.3);
    border-radius: 2px; margin: 20px auto;
    position: relative; z-index: 1;
  }

  .info-cards {
    display: flex; flex-direction: column; gap: 12px;
    width: 100%; position: relative; z-index: 1;
    animation: fadeIn 0.7s 0.2s ease both;
  }

  .info-card {
    background: rgba(255,255,255,0.1);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 12px;
  }

  .info-card-icon { font-size: 22px; flex-shrink: 0; }
  .info-card-text { font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.5; }
  .info-card-text strong { color: white; display: block; font-weight: 700; margin-bottom: 2px; }

  /* ── RIGHT PANEL ── */
  .right-panel {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 48px 40px;
    background: #f7f9fc;
    overflow-y: auto;
  }

  .form-card {
    width: 100%; max-width: 480px;
    animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .back-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700; color: #0072bb;
    text-decoration: none; margin-bottom: 24px;
    transition: gap 0.2s;
  }
  .back-link:hover { gap: 10px; }

  .form-eyebrow {
    font-size: 12px; font-weight: 700; color: #0072bb;
    text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;
  }

  .form-title {
    font-family: 'Merriweather', serif;
    font-size: 26px; color: #0d1b2a; font-weight: 700;
    margin-bottom: 6px; line-height: 1.3;
  }

  .form-subtitle {
    font-size: 15px; color: #64748b; font-weight: 300;
    line-height: 1.5; margin-bottom: 28px;
  }

  /* ── DEPARTMENT GRID ── */
  .dept-label {
    font-size: 12px; font-weight: 700; color: #1e3a5f;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 10px; display: block;
  }

  .dept-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-bottom: 22px;
  }

  .dept-pill {
    padding: 12px 14px;
    border: 2px solid #c8d6e5; border-radius: 10px;
    background: white;
    font-size: 14px; font-weight: 600; color: #1e3a5f;
    cursor: pointer; text-align: left;
    font-family: 'Source Sans 3', sans-serif;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }
  .dept-pill:hover { border-color: #0072bb; background: #f0f7ff; color: #0072bb; }
  .dept-pill.selected { border-color: #0072bb; background: #0072bb; color: white; }

  /* ── FORM FIELDS ── */
  .form-group { margin-bottom: 20px; }
  .form-row { display: flex; gap: 16px; margin-bottom: 20px; }
  .form-row .form-group { flex: 1; margin-bottom: 0; }

  label {
    display: block; font-size: 12px; font-weight: 700;
    color: #1e3a5f; margin-bottom: 7px;
    letter-spacing: 0.5px; text-transform: uppercase;
  }

  .input-wrap { position: relative; }

  .input-prefix {
    position: absolute; left: 0; top: 0; bottom: 0; width: 44px;
    display: flex; align-items: center; justify-content: center;
    background: #e8eef5; border: 2px solid #c8d6e5;
    border-right: none; border-radius: 10px 0 0 10px; font-size: 16px;
  }

  input[type="date"],
  input[type="time"],
  textarea {
    width: 100%;
    font-size: 15px; font-family: 'Source Sans 3', sans-serif;
    border: 2px solid #c8d6e5; border-radius: 10px;
    background: white; color: #0d1b2a;
    transition: all 0.2s; outline: none;
  }

  input[type="date"],
  input[type="time"] {
    padding: 13px 14px 13px 52px;
  }

  textarea {
    padding: 13px 16px;
    resize: vertical; min-height: 90px; line-height: 1.6;
  }

  input:focus, textarea:focus {
    border-color: #0072bb;
    box-shadow: 0 0 0 3px rgba(0,114,187,0.12);
  }

  input::placeholder, textarea::placeholder { color: #a0aec0; }

  /* ── TIME SLOTS ── */
  .time-slots-label {
    font-size: 12px; font-weight: 700; color: #1e3a5f;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 10px; display: block;
  }

  .time-slots {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 8px; margin-bottom: 20px;
  }

  .time-slot {
    padding: 10px 8px;
    border: 2px solid #c8d6e5; border-radius: 8px;
    background: white; font-size: 13px; font-weight: 600;
    color: #1e3a5f; cursor: pointer; text-align: center;
    font-family: 'Source Sans 3', sans-serif;
    transition: all 0.2s;
  }
  .time-slot:hover { border-color: #0072bb; background: #f0f7ff; color: #0072bb; }
  .time-slot.selected { border-color: #0072bb; background: #0072bb; color: white; }

  /* ── SUMMARY BOX ── */
  .summary-box {
    background: #f0f7ff; border: 1.5px solid #bfdbfe;
    border-radius: 12px; padding: 16px 18px;
    margin-bottom: 20px;
  }

  .summary-title {
    font-size: 12px; font-weight: 700; color: #0072bb;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
  }

  .summary-row {
    display: flex; gap: 8px; align-items: center;
    font-size: 14px; color: #1e3a5f; margin-bottom: 6px;
  }
  .summary-row:last-child { margin-bottom: 0; }
  .summary-row span { font-weight: 600; }
  .summary-row .empty { color: #94a3b8; font-weight: 400; font-style: italic; }

  /* ── SUBMIT BTN ── */
  .submit-btn {
    width: 100%; padding: 16px;
    background: #0072bb; color: white;
    font-size: 17px; font-family: 'Source Sans 3', sans-serif;
    font-weight: 700; border: none; border-radius: 10px;
    cursor: pointer; letter-spacing: 0.4px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(0,114,187,0.35);
  }
  .submit-btn:hover:not(:disabled) {
    background: #005b96; transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,114,187,0.4);
  }
  .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  .spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 3px solid rgba(255,255,255,0.4); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── MESSAGES ── */
  .error-msg {
    background: #fff5f5; border: 1.5px solid #feb2b2;
    border-left: 4px solid #e02020; border-radius: 8px;
    padding: 12px 16px; color: #c53030; font-size: 15px;
    margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
  }

  .success-card {
    background: #f0fff4; border: 1.5px solid #9ae6b4;
    border-left: 4px solid #38a169; border-radius: 12px;
    padding: 28px; color: #276749; text-align: center;
  }
  .success-card .tick { font-size: 48px; margin-bottom: 12px; }
  .success-card h3 {
    font-family: 'Merriweather', serif;
    font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #166534;
  }
  .success-card p { font-size: 15px; line-height: 1.7; margin-bottom: 18px; }

  .dashboard-btn {
    display: inline-block; padding: 12px 28px;
    background: #0072bb; color: white;
    border-radius: 10px; text-decoration: none;
    font-size: 15px; font-weight: 700;
    font-family: 'Source Sans 3', sans-serif;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,114,187,0.3);
  }
  .dashboard-btn:hover { background: #005b96; transform: translateY(-1px); }

  @media (max-width: 700px) {
    .page-wrapper { flex-direction: column; }
    .left-panel { width: 100%; padding: 28px 20px; }
    .info-cards { display: none; }
    .right-panel { padding: 28px 16px; }
    .dept-grid { grid-template-columns: 1fr; }
    .form-row { flex-direction: column; gap: 0; }
    .form-row .form-group { margin-bottom: 20px; }
    .time-slots { grid-template-columns: repeat(2, 1fr); }
  }
`;

const DEPARTMENTS = [
  { label: "General Checkup",          icon: "🩺" },
  { label: "Cardiology",               icon: "❤️" },
  { label: "Orthopedics",              icon: "🦴" },
  { label: "Neurology",                icon: "🧠" },
  { label: "Dermatology",              icon: "🔬" },
  { label: "Ophthalmology",            icon: "👁️" },
  { label: "ENT",                      icon: "👂" },
  { label: "Diabetes & Endocrinology", icon: "💉" },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM",
];

// Convert "09:00 AM" → "09:00" for backend (String field)
function toBackendTime(slot) {
  if (!slot) return "";
  const [time, meridiem] = slot.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function AppointmentForm() {
  const { patient_id } = useParams();

  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null); // { appointment_id, status }

  // Today's date as min for date picker
  const today = new Date().toISOString().split("T")[0];

  // POST /patient/{patient_id}/appointment → { appointment_id, status }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!department)  { setError("Please select a department."); return; }
    if (!date)        { setError("Please choose a preferred date."); return; }
    if (!timeSlot)    { setError("Please select a preferred time slot."); return; }

    setLoading(true);
    try {
      const res = await fetch(`/patient/${patient_id}/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          preferred_date: date,                  // YYYY-MM-DD → matches Date field in schema
          preferred_time: toBackendTime(timeSlot), // "HH:MM" string
          reason: reason.trim() || "N/A",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Could not book your appointment. Please try again.");
      } else {
        setSuccess(data); // { appointment_id, status }
      }
    } catch (err) {
      setError("Could not reach the server. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="page-wrapper">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="cross-icon">
            <div className="cross-h" /><div className="cross-v" />
          </div>
          <div className="hospital-name">MediCare General<br />Hospital</div>
          <div className="divider-horiz" />
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">📅</div>
              <div className="info-card-text">
                <strong>Easy Scheduling</strong>
                Choose your preferred date and time slot
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">✅</div>
              <div className="info-card-text">
                <strong>Quick Confirmation</strong>
                We'll confirm your appointment within a few hours
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">🔔</div>
              <div className="info-card-text">
                <strong>Reminders Sent</strong>
                Get notified before your visit so you never miss it
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-card">

            <Link to={`/patient/${patient_id}/dashboard`} className="back-link">
              ← Back to Dashboard
            </Link>

            <div className="form-eyebrow">Appointment Booking</div>
            <div className="form-title">Book a Visit</div>
            <div className="form-subtitle">
              Choose your department, date and time. We'll confirm your appointment as soon as possible.
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {success ? (
              <div className="success-card">
                <div className="tick">🎉</div>
                <h3>Appointment Booked!</h3>
                <p>
                  Your appointment request has been received.<br />
                  Reference ID: <strong>#{success.appointment_id}</strong><br />
                  Status: <strong>{success.status}</strong><br /><br />
                  We will confirm your visit shortly. Please check your dashboard for updates.
                </p>
                <Link to={`/patient/${patient_id}/dashboard`} className="dashboard-btn">
                  Back to Dashboard →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* DEPARTMENT */}
                <div className="form-group">
                  <span className="dept-label">Select a Department</span>
                  <div className="dept-grid">
                    {DEPARTMENTS.map(d => (
                      <button
                        key={d.label}
                        type="button"
                        className={`dept-pill${department === d.label ? " selected" : ""}`}
                        onClick={() => setDepartment(d.label)}
                        disabled={loading}
                      >
                        <span>{d.icon}</span>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DATE */}
                <div className="form-group">
                  <label htmlFor="appt-date">Preferred Date</label>
                  <div className="input-wrap">
                    <div className="input-prefix">📆</div>
                    <input
                      id="appt-date"
                      type="date"
                      min={today}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* TIME SLOTS */}
                <div className="form-group">
                  <span className="time-slots-label">Preferred Time Slot</span>
                  <div className="time-slots">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`time-slot${timeSlot === t ? " selected" : ""}`}
                        onClick={() => setTimeSlot(t)}
                        disabled={loading}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* REASON */}
                <div className="form-group">
                  <label htmlFor="reason">Reason for Visit <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                  <textarea
                    id="reason"
                    placeholder="E.g. routine checkup, follow-up on previous visit, specific symptoms…"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* LIVE SUMMARY */}
                {(department || date || timeSlot) && (
                  <div className="summary-box">
                    <div className="summary-title">📋 Appointment Summary</div>
                    <div className="summary-row">
                      🏥 Department: {department
                        ? <span>{department}</span>
                        : <span className="empty">Not selected</span>}
                    </div>
                    <div className="summary-row">
                      📆 Date: {date
                        ? <span>{new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                        : <span className="empty">Not selected</span>}
                    </div>
                    <div className="summary-row">
                      🕐 Time: {timeSlot
                        ? <span>{timeSlot}</span>
                        : <span className="empty">Not selected</span>}
                    </div>
                  </div>
                )}

                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner" />Booking your appointment…</>
                    : "Book My Appointment →"
                  }
                </button>

              </form>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
