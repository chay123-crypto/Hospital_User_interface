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

  /* ── CATEGORY PILLS ── */
  .category-label {
    font-size: 12px; font-weight: 700; color: #1e3a5f;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
    display: block;
  }

  .category-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; margin-bottom: 22px;
  }

  .category-pill {
    padding: 12px 14px;
    border: 2px solid #c8d6e5;
    border-radius: 10px;
    background: white;
    font-size: 14px; font-weight: 600; color: #1e3a5f;
    cursor: pointer; text-align: left;
    font-family: 'Source Sans 3', sans-serif;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 8px;
  }

  .category-pill:hover {
    border-color: #0072bb; background: #f0f7ff; color: #0072bb;
  }

  .category-pill.selected {
    border-color: #0072bb; background: #0072bb; color: white;
  }

  /* ── FORM FIELDS ── */
  .form-group { margin-bottom: 20px; }

  label {
    display: block; font-size: 12px; font-weight: 700;
    color: #1e3a5f; margin-bottom: 7px;
    letter-spacing: 0.5px; text-transform: uppercase;
  }

  textarea {
    width: 100%; padding: 14px 16px;
    font-size: 16px; font-family: 'Source Sans 3', sans-serif;
    border: 2px solid #c8d6e5; border-radius: 10px;
    background: white; color: #0d1b2a;
    resize: vertical; min-height: 130px;
    transition: all 0.2s; outline: none; line-height: 1.6;
  }

  textarea:focus {
    border-color: #0072bb;
    box-shadow: 0 0 0 3px rgba(0,114,187,0.12);
  }

  textarea::placeholder { color: #a0aec0; font-size: 15px; }

  .char-count {
    text-align: right; font-size: 12px; color: #94a3b8;
    margin-top: 5px; font-weight: 600;
  }
  .char-count.warn { color: #f59e0b; }
  .char-count.over { color: #ef4444; }

  /* ── SUBMIT BTN ── */
  .submit-btn {
    width: 100%; padding: 16px; margin-top: 4px;
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
    padding: 24px; color: #276749; text-align: center;
  }
  .success-card .tick { font-size: 48px; margin-bottom: 12px; }
  .success-card h3 {
    font-family: 'Merriweather', serif;
    font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #166534;
  }
  .success-card p { font-size: 15px; line-height: 1.6; margin-bottom: 18px; }

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
    .category-grid { grid-template-columns: 1fr; }
  }
`;

const CATEGORIES = [
  { label: "General Health", icon: "🩺" },
  { label: "Medication",     icon: "💊" },
  { label: "Lab Results",    icon: "🔬" },
  { label: "Diet & Nutrition", icon: "🥗" },
  { label: "Mental Health",  icon: "🧠" },
  { label: "Other",          icon: "💬" },
];

const MAX_CHARS = 500;

export default function QueryForm() {
  const navigate = useNavigate();
  const { patient_id } = useParams();

  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null); // { query_id, status }

  // POST /patient/{patient_id}/query → { query_id, status }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!category) { setError("Please select a category for your question."); return; }
    if (message.trim().length < 10) { setError("Please describe your concern in at least 10 characters."); return; }
    if (message.length > MAX_CHARS) { setError(`Message must be under ${MAX_CHARS} characters.`); return; }

    setLoading(true);
    try {
      const res = await fetch(`/patient/${patient_id}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Could not submit your query. Please try again.");
      } else {
        setSuccess(data); // { query_id, status }
      }
    } catch (err) {
      setError("Could not reach the server. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const charColor = message.length > MAX_CHARS
    ? "over"
    : message.length > MAX_CHARS * 0.85
    ? "warn"
    : "";

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
              <div className="info-card-icon">⏱️</div>
              <div className="info-card-text">
                <strong>Quick Response</strong>
                Our care team replies within 24 hours
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">🔒</div>
              <div className="info-card-text">
                <strong>Completely Private</strong>
                Your queries are only visible to your doctor
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">📋</div>
              <div className="info-card-text">
                <strong>Track Your Queries</strong>
                View all past questions from your dashboard
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

            <div className="form-eyebrow">Health Query</div>
            <div className="form-title">Ask Your Doctor</div>
            <div className="form-subtitle">
              Select a category and describe your concern. Our medical team will get back to you shortly.
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {success ? (
              <div className="success-card">
                <div className="tick">✅</div>
                <h3>Query Submitted!</h3>
                <p>
                  Your question has been sent to our care team.<br />
                  Reference ID: <strong>#{success.query_id}</strong><br />
                  Status: <strong>{success.status}</strong>
                </p>
                <Link to={`/patient/${patient_id}/dashboard`} className="dashboard-btn">
                  Back to Dashboard →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* CATEGORY */}
                <div className="form-group">
                  <span className="category-label">Select a Category</span>
                  <div className="category-grid">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.label}
                        type="button"
                        className={`category-pill${category === c.label ? " selected" : ""}`}
                        onClick={() => setCategory(c.label)}
                        disabled={loading}
                      >
                        <span>{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="form-group">
                  <label htmlFor="message">Your Question or Concern</label>
                  <textarea
                    id="message"
                    placeholder="Please describe your symptoms, concerns, or questions in as much detail as possible. The more information you provide, the better we can help you."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={loading}
                  />
                  <div className={`char-count ${charColor}`}>
                    {message.length} / {MAX_CHARS} characters
                  </div>
                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner" />Submitting your query…</>
                    : "Send My Question →"
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
