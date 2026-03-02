import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Merriweather:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .signup-wrapper {
    display: flex;
    align-items: stretch;
    min-height: 100vh;
    width: 100%;
    font-family: 'Source Sans 3', sans-serif;
  }

  .left-panel {
    width: 42%;
    background: linear-gradient(170deg, #005b96 0%, #003f6e 60%, #00274d 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    position: relative;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    top: -60px; left: -60px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  .cross-icon {
    width: 90px; height: 90px;
    background: white;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px;
    position: relative; z-index: 1;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    animation: fadeIn 0.7s ease both;
  }

  .cross-h { position: absolute; width: 54px; height: 18px; background: #e02020; border-radius: 4px; }
  .cross-v { position: absolute; width: 18px; height: 54px; background: #e02020; border-radius: 4px; }

  .hospital-name {
    font-family: 'Merriweather', serif;
    font-size: 26px; font-weight: 700;
    color: white; text-align: center;
    margin-bottom: 10px; line-height: 1.3;
    position: relative; z-index: 1;
    animation: fadeIn 0.7s 0.1s ease both;
  }

  .hospital-tagline {
    font-size: 15px; color: rgba(255,255,255,0.7);
    text-align: center; line-height: 1.6;
    position: relative; z-index: 1;
    font-weight: 300;
    animation: fadeIn 0.7s 0.2s ease both;
  }

  .divider-horiz {
    width: 50px; height: 3px;
    background: rgba(255,255,255,0.3);
    border-radius: 2px; margin: 22px auto;
    position: relative; z-index: 1;
  }

  .steps-list {
    display: flex; flex-direction: column; gap: 14px;
    width: 100%; position: relative; z-index: 1;
    animation: fadeIn 0.7s 0.3s ease both;
  }

  .step-item {
    display: flex; align-items: flex-start; gap: 14px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px; padding: 14px 16px;
  }

  .step-num {
    width: 28px; height: 28px; flex-shrink: 0;
    background: white; color: #005b96;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
  }

  .step-text { font-size: 14px; color: rgba(255,255,255,0.9); line-height: 1.5; }
  .step-text strong { color: white; display: block; font-weight: 700; margin-bottom: 2px; }

  .right-panel {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 40px;
    background: #f7f9fc;
    overflow-y: auto;
  }

  .form-card {
    width: 100%; max-width: 440px;
    animation: slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

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

  .progress-bar-wrap { margin-bottom: 28px; }

  .progress-label {
    display: flex; justify-content: space-between;
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .progress-track {
    height: 6px; background: #e2e8f0; border-radius: 10px; overflow: hidden;
  }

  .progress-fill {
    height: 100%; background: linear-gradient(90deg, #0072bb, #38bdf8);
    border-radius: 10px;
    transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
  }

  .form-group { margin-bottom: 18px; }

  label {
    display: block; font-size: 12px; font-weight: 700;
    color: #1e3a5f; margin-bottom: 7px;
    letter-spacing: 0.5px; text-transform: uppercase;
  }

  .input-wrap { position: relative; }

  .input-prefix {
    position: absolute; left: 0; top: 0; bottom: 0; width: 46px;
    display: flex; align-items: center; justify-content: center;
    background: #e8eef5; border: 2px solid #c8d6e5;
    border-right: none; border-radius: 10px 0 0 10px; font-size: 17px;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"] {
    width: 100%; padding: 14px 16px 14px 56px;
    font-size: 16px; font-family: 'Source Sans 3', sans-serif;
    border: 2px solid #c8d6e5; border-radius: 10px;
    background: white; color: #0d1b2a;
    transition: all 0.2s ease; outline: none;
  }

  input:focus { border-color: #0072bb; box-shadow: 0 0 0 3px rgba(0,114,187,0.12); }
  input.valid { border-color: #22c55e; }
  input.invalid { border-color: #ef4444; }
  input::placeholder { color: #a0aec0; font-size: 15px; }

  .password-toggle {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    font-size: 18px; padding: 4px 6px; border-radius: 6px;
    transition: background 0.2s; line-height: 1;
  }
  .password-toggle:hover { background: #eef2f7; }

  .field-hint { font-size: 12px; color: #94a3b8; margin-top: 5px; }
  .field-hint.error { color: #ef4444; font-weight: 600; }
  .field-hint.ok { color: #16a34a; font-weight: 600; }

  .strength-wrap { margin-top: 8px; }
  .strength-track {
    height: 5px; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 5px;
  }
  .strength-fill { height: 100%; border-radius: 10px; transition: width 0.3s, background 0.3s; }
  .strength-label { font-size: 12px; font-weight: 700; }

  .submit-btn {
    width: 100%; padding: 16px; margin-top: 6px;
    background: #0072bb; color: white;
    font-size: 17px; font-family: 'Source Sans 3', sans-serif;
    font-weight: 700; border: none; border-radius: 10px;
    cursor: pointer; letter-spacing: 0.4px;
    transition: all 0.2s ease;
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

  .error-msg {
    background: #fff5f5; border: 1.5px solid #feb2b2;
    border-left: 4px solid #e02020; border-radius: 8px;
    padding: 12px 16px; color: #c53030; font-size: 15px;
    margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
  }

  .success-msg {
    background: #f0fff4; border: 1.5px solid #9ae6b4;
    border-left: 4px solid #38a169; border-radius: 8px;
    padding: 14px 16px; color: #276749; font-size: 15px;
    margin-bottom: 18px;
  }
  .success-msg h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }

  .login-link {
    text-align: center; font-size: 14px; color: #64748b; margin-top: 20px;
  }
  .login-link a { color: #0072bb; text-decoration: none; font-weight: 700; }
  .login-link a:hover { text-decoration: underline; }

  @media (max-width: 700px) {
    .signup-wrapper { flex-direction: column; }
    .left-panel { width: 100%; padding: 32px 20px; }
    .steps-list { display: none; }
    .right-panel { padding: 28px 16px; }
  }
`;

function getPasswordStrength(pw) {
  if (!pw) return { label: "", color: "", width: "0%" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "", width: "0%" },
    { label: "Weak", color: "#ef4444", width: "25%" },
    { label: "Fair", color: "#f59e0b", width: "50%" },
    { label: "Good", color: "#3b82f6", width: "75%" },
    { label: "Strong", color: "#22c55e", width: "100%" },
  ];
  return map[score];
}

export default function PatientSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const touch = (field) => setTouched(t => ({ ...t, [field]: true }));

  const valid = {
    name: form.name.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    phone: /^[0-9+\-\s()]{7,15}$/.test(form.phone),
    password: form.password.length >= 6,
  };

  const allValid = Object.values(valid).every(Boolean);
  const progress = Math.round((Object.values(valid).filter(Boolean).length / 4) * 100);
  const strength = getPasswordStrength(form.password);

  // POST /patient/signup → { patient_id, message }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true });
    if (!allValid) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/patient/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Registration failed. Please try again.");
      } else {
        // response has patient_id and message — store name from form
        sessionStorage.setItem("patient_id", data.patient_id);
        sessionStorage.setItem("patient_name", form.name.trim());
        setSuccess(true);
        // navigate() keeps everything inside React — no proxy interference
        setTimeout(() => {
          navigate(`/patient/${data.patient_id}/dashboard`);
        }, 2000);
      }
    } catch (err) {
      setError("Could not reach the server. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => {
    if (!touched[field]) return "";
    return valid[field] ? "valid" : "invalid";
  };

  const hint = (field, msg, okMsg = "") => {
    if (!touched[field]) return null;
    if (!valid[field]) return <div className="field-hint error">⚠️ {msg}</div>;
    if (okMsg) return <div className="field-hint ok">✅ {okMsg}</div>;
    return null;
  };

  return (
    <>
      <style>{style}</style>
      <div className="signup-wrapper">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="cross-icon">
            <div className="cross-h" /><div className="cross-v" />
          </div>
          <div className="hospital-name">MediCare General<br />Hospital</div>
          <div className="hospital-tagline">Join thousands of patients<br />who trust us with their care.</div>
          <div className="divider-horiz" />
          <div className="steps-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Create Your Account</strong>
                Fill in your personal details to get started
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>Access Your Portal</strong>
                View records, appointments &amp; messages
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>Stay Connected</strong>
                Get reminders and updates from your care team
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-card">
            <div className="form-eyebrow">Patient Registration</div>
            <div className="form-title">Create Your Account</div>
            <div className="form-subtitle">
              Fill in the details below to join the MediCare patient portal.
            </div>

            <div className="progress-bar-wrap">
              <div className="progress-label">
                <span>Registration Progress</span>
                <span>{progress}% complete</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {success ? (
              <div className="success-msg">
                <h4>🎉 Account Created Successfully!</h4>
                Welcome to MediCare, {form.name.split(" ")[0]}! Redirecting to your dashboard…
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrap">
                    <div className="input-prefix">👤</div>
                    <input
                      id="name" type="text"
                      placeholder="e.g. John Smith"
                      className={inputClass("name")}
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      onBlur={() => touch("name")}
                      disabled={loading}
                    />
                  </div>
                  {hint("name", "Please enter your full name", "Looks good!")}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrap">
                    <div className="input-prefix">📧</div>
                    <input
                      id="email" type="email"
                      placeholder="yourname@email.com"
                      className={inputClass("email")}
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      onBlur={() => touch("email")}
                      disabled={loading}
                    />
                  </div>
                  {hint("email", "Please enter a valid email address", "Valid email!")}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrap">
                    <div className="input-prefix">📞</div>
                    <input
                      id="phone" type="tel"
                      placeholder="e.g. 09123456789"
                      className={inputClass("phone")}
                      value={form.phone}
                      onChange={e => set("phone", e.target.value)}
                      onBlur={() => touch("phone")}
                      disabled={loading}
                    />
                  </div>
                  {hint("phone", "Please enter a valid phone number", "Phone number looks good!")}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrap">
                    <div className="input-prefix">🔒</div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      className={inputClass("password")}
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                      onBlur={() => touch("password")}
                      disabled={loading}
                    />
                    <button
                      type="button" className="password-toggle"
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {form.password && (
                    <div className="strength-wrap">
                      <div className="strength-track">
                        <div className="strength-fill" style={{ width: strength.width, background: strength.color }} />
                      </div>
                      {strength.label && (
                        <span className="strength-label" style={{ color: strength.color }}>
                          Password strength: {strength.label}
                        </span>
                      )}
                    </div>
                  )}
                  {hint("password", "Password must be at least 6 characters")}
                </div>

                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner" />Creating your account…</>
                    : "Create My Account →"
                  }
                </button>
              </form>
            )}

            {/* Link component avoids full page reload unlike <a href> */}
            <div className="login-link">
              Already have an account? <Link to="/patient/login">Sign in here</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
