import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

/*
  GOOGLE OAUTH SETUP:
  1. Go to https://console.cloud.google.com
  2. Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
  3. Set Authorized JS origins: http://localhost:5173
  4. Set Authorized redirect URI: http://localhost:5173
  5. Copy the Client ID and paste it in GOOGLE_CLIENT_ID below
*/
const GOOGLE_CLIENT_ID = "214595688794-plugmais2e5cegkjgsuaaqcmd9k1jj4k.apps.googleusercontent.com";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Merriweather:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .login-wrapper { display: flex; align-items: stretch; min-height: 100vh; width: 100%; font-family: 'Source Sans 3', sans-serif; }
  .left-panel { width: 42%; background: linear-gradient(170deg, #005b96 0%, #003f6e 60%, #00274d 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 40px; position: relative; overflow: hidden; }
  .left-panel::before { content: ''; position: absolute; top: -60px; left: -60px; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05); }
  .left-panel::after { content: ''; position: absolute; bottom: -80px; right: -80px; width: 300px; height: 300px; border-radius: 50%; background: rgba(255,255,255,0.04); }
  .cross-icon { width: 90px; height: 90px; background: white; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 28px; position: relative; z-index: 1; box-shadow: 0 8px 32px rgba(0,0,0,0.25); }
  .cross-h { position: absolute; width: 54px; height: 18px; background: #e02020; border-radius: 4px; }
  .cross-v { position: absolute; width: 18px; height: 54px; background: #e02020; border-radius: 4px; }
  .hospital-name { font-family: 'Merriweather', serif; font-size: 26px; font-weight: 700; color: white; text-align: center; margin-bottom: 10px; line-height: 1.3; position: relative; z-index: 1; }
  .hospital-tagline { font-size: 15px; color: rgba(255,255,255,0.7); text-align: center; line-height: 1.6; position: relative; z-index: 1; font-weight: 300; }
  .divider-horiz { width: 50px; height: 3px; background: rgba(255,255,255,0.3); border-radius: 2px; margin: 22px auto; position: relative; z-index: 1; }
  .info-badges { display: flex; flex-direction: column; gap: 14px; width: 100%; position: relative; z-index: 1; }
  .info-badge { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; }
  .info-badge-icon { font-size: 20px; flex-shrink: 0; }
  .info-badge-text { font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.4; }
  .info-badge-text strong { color: white; font-weight: 600; display: block; }
  .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 40px; background: #f7f9fc; }
  .form-card { width: 100%; max-width: 420px; animation: slideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .form-eyebrow { font-size: 12px; font-weight: 700; color: #0072bb; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
  .form-title { font-family: 'Merriweather', serif; font-size: 28px; color: #0d1b2a; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
  .form-subtitle { font-size: 15px; color: #64748b; font-weight: 300; line-height: 1.5; margin-bottom: 28px; }
  .tab-row { display: flex; background: #e8eef5; border-radius: 10px; padding: 4px; margin-bottom: 24px; gap: 4px; }
  .tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Source Sans 3', sans-serif; transition: all 0.2s; color: #64748b; background: transparent; }
  .tab-btn.active { background: white; color: #005b96; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
  .form-group { margin-bottom: 20px; }
  label { display: block; font-size: 12px; font-weight: 700; color: #1e3a5f; margin-bottom: 7px; letter-spacing: 0.5px; text-transform: uppercase; }
  .input-wrap { position: relative; }
  .input-prefix { position: absolute; left: 0; top: 0; bottom: 0; width: 46px; display: flex; align-items: center; justify-content: center; background: #e8eef5; border: 2px solid #c8d6e5; border-right: none; border-radius: 10px 0 0 10px; font-size: 17px; }
  input[type="email"], input[type="password"], input[type="text"], input[type="tel"] { width: 100%; padding: 15px 16px 15px 56px; font-size: 16px; font-family: 'Source Sans 3', sans-serif; border: 2px solid #c8d6e5; border-radius: 10px; background: white; color: #0d1b2a; transition: all 0.2s ease; outline: none; }
  input:focus { border-color: #0072bb; box-shadow: 0 0 0 3px rgba(0,114,187,0.12); }
  input::placeholder { color: #a0aec0; font-size: 15px; }
  .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px 6px; border-radius: 6px; transition: background 0.2s; line-height: 1; color: #64748b; }
  .password-toggle:hover { background: #eef2f7; }
  .login-btn { width: 100%; padding: 15px; margin-top: 8px; background: #0072bb; color: white; font-size: 16px; font-family: 'Source Sans 3', sans-serif; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; letter-spacing: 0.4px; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(0,114,187,0.35); }
  .login-btn:hover:not(:disabled) { background: #005b96; transform: translateY(-1px); }
  .login-btn:disabled { opacity: 0.75; cursor: not-allowed; }
  .google-btn { width: 100%; padding: 14px; background: white; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 15px; font-family: 'Source Sans 3', sans-serif; font-weight: 600; color: #1e3a5f; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
  .google-btn:hover:not(:disabled) { border-color: #4285f4; background: #f8f9ff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(66,133,244,0.15); }
  .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .google-icon { width: 20px; height: 20px; flex-shrink: 0; }
  .separator { display: flex; align-items: center; gap: 12px; margin: 18px 0; }
  .sep-line { flex: 1; height: 1px; background: #dce6f0; }
  .sep-text { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .otp-inputs { display: flex; gap: 8px; justify-content: center; margin: 12px 0; }
  .otp-input { width: 48px; height: 56px; text-align: center; font-size: 22px; font-weight: 700; border: 2px solid #c8d6e5; border-radius: 10px; font-family: 'Source Sans 3', sans-serif; color: #0d1b2a; outline: none; transition: all 0.2s; padding: 0; }
  .otp-input:focus { border-color: #0072bb; box-shadow: 0 0 0 3px rgba(0,114,187,0.12); }
  .resend-link { font-size: 13px; color: #0072bb; background: none; border: none; cursor: pointer; font-weight: 600; font-family: 'Source Sans 3', sans-serif; padding: 0; }
  .resend-link:disabled { color: #94a3b8; cursor: default; }
  .spinner { display: inline-block; width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .register-text { text-align: center; font-size: 14px; color: #64748b; margin-top: 20px; }
  .register-text a { color: #0072bb; text-decoration: none; font-weight: 700; }
  .register-text a:hover { text-decoration: underline; }
  .error-msg { background: #fff5f5; border: 1.5px solid #feb2b2; border-left: 4px solid #e02020; border-radius: 8px; padding: 12px 16px; color: #c53030; font-size: 14px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .success-msg { background: #f0fff4; border: 1.5px solid #9ae6b4; border-left: 4px solid #38a169; border-radius: 8px; padding: 12px 16px; color: #276749; font-size: 14px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .info-msg { background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 12px 16px; color: #1e3a5f; font-size: 13px; margin-bottom: 18px; }
  @media (max-width: 700px) { .login-wrapper { flex-direction: column; } .left-panel { width: 100%; padding: 36px 24px; } .info-badges { display: none; } .right-panel { padding: 32px 20px; } }
`;

export default function PatientLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("email");

  // Email login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtp, setDevOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Load Google Identity Services script ──────────────────────────────────
  useEffect(() => {
    if (GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE") return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const initGoogle = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  };

  // Called by Google after user selects their account
  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    setError(""); setSuccess("");
    try {
      // Decode the JWT credential to get user info
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      const res = await fetch("/patient/login/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_id: payload.sub,
          email: payload.email,
          name: payload.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Google login failed."); }
      else {
        sessionStorage.setItem("patient_id", data.patient_id);
        sessionStorage.setItem("patient_name", data.name);
        setSuccess("Welcome, " + data.name + "! Redirecting…");
        setTimeout(() => navigate("/patient/" + data.patient_id + "/dashboard"), 1200);
      }
    } catch (e) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const triggerGoogleLogin = () => {
    if (GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE") {
      setError("Google OAuth is not configured yet. Please add your Client ID in PatientLogin.jsx.");
      return;
    }
    if (!window.google) { setError("Google sign-in is still loading. Try again in a moment."); return; }
    window.google.accounts.id.prompt();
  };

  // ── Email login ───────────────────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!email || !password) { setError("Please fill in both fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Login failed."); }
      else {
        sessionStorage.setItem("patient_id", data.patient_id);
        sessionStorage.setItem("patient_name", data.name);
        setSuccess("Welcome back, " + data.name + "! Redirecting…");
        setTimeout(() => navigate("/patient/" + data.patient_id + "/dashboard"), 1300);
      }
    } catch { setError("Could not reach the server. Please try again."); }
    finally { setLoading(false); }
  };

  // ── Phone OTP ─────────────────────────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30);
    const iv = setInterval(() => setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
  };

  const handleRequestOTP = async () => {
    setError(""); setSuccess("");
    if (!phone || phone.length < 10) { setError("Enter a valid phone number."); return; }
    setLoading(true);
    try {
      const res = await fetch("/patient/login/phone/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Failed to send OTP."); }
      else {
        setOtpSent(true);
        startResendTimer();
        if (data.otp_dev) setDevOtp(data.otp_dev);
        setSuccess("OTP sent to " + phone);
      }
    } catch { setError("Could not reach the server."); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) document.getElementById("otp-" + (idx + 1))?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) document.getElementById("otp-" + (idx - 1))?.focus();
  };

  const handleVerifyOTP = async () => {
    setError(""); setSuccess("");
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the full 6-digit OTP."); return; }
    setLoading(true);
    try {
      const res = await fetch("/patient/login/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp_code: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid OTP."); }
      else {
        sessionStorage.setItem("patient_id", data.patient_id);
        sessionStorage.setItem("patient_name", data.name);
        setSuccess("Welcome, " + data.name + "! Redirecting…");
        setTimeout(() => navigate("/patient/" + data.patient_id + "/dashboard"), 1300);
      }
    } catch { setError("Could not reach the server."); }
    finally { setLoading(false); }
  };

  const resetTab = (t) => { setTab(t); setError(""); setSuccess(""); setOtpSent(false); setDevOtp(""); setOtp(["","","","","",""]); };

  return (
    <>
      <style>{style}</style>
      <div className="login-wrapper">

        {/* Left branding panel */}
        <div className="left-panel">
          <div className="cross-icon"><div className="cross-h" /><div className="cross-v" /></div>
          <div className="hospital-name">MediCare General<br />Hospital</div>
          <div className="hospital-tagline">Compassionate care,<br />every step of the way.</div>
          <div className="divider-horiz" />
          <div className="info-badges">
            <div className="info-badge"><div className="info-badge-icon">📋</div><div className="info-badge-text"><strong>View Your Records</strong>Access lab results, prescriptions &amp; visit summaries</div></div>
            <div className="info-badge"><div className="info-badge-icon">📅</div><div className="info-badge-text"><strong>Manage Appointments</strong>Book, reschedule or cancel visits easily</div></div>
            <div className="info-badge"><div className="info-badge-icon">❤️</div><div className="info-badge-text"><strong>Track Your Vitals</strong>Monitor heart rate, BP, glucose &amp; more</div></div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="right-panel">
          <div className="form-card">
            <div className="form-eyebrow">Patient Portal</div>
            <div className="form-title">Sign In to Your Account</div>
            <div className="form-subtitle">Welcome back. Access your health records and appointments.</div>

            {/* Google sign-in button */}
            <button className="google-btn" onClick={triggerGoogleLogin} disabled={googleLoading || loading}>
              {googleLoading
                ? <><span className="spinner" style={{ borderColor: "rgba(0,0,0,0.2)", borderTopColor: "#4285f4" }} />Signing in with Google…</>
                : <>
                    <svg className="google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
              }
            </button>

            <div className="separator"><div className="sep-line" /><span className="sep-text">or</span><div className="sep-line" /></div>

            {/* Email / Phone tabs */}
            <div className="tab-row">
              <button className={`tab-btn ${tab === "email" ? "active" : ""}`} onClick={() => resetTab("email")}>📧 Email</button>
              <button className={`tab-btn ${tab === "phone" ? "active" : ""}`} onClick={() => resetTab("phone")}>📞 Phone OTP</button>
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}

            {/* Email login form */}
            {tab === "email" && (
              <form onSubmit={handleEmailLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <div className="input-prefix">📧</div>
                    <input type="email" placeholder="yourname@email.com" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrap">
                    <div className="input-prefix">🔒</div>
                    <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>{showPassword ? "🙈" : "👁️"}</button>
                  </div>
                </div>
                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner" />Signing in…</> : "Sign In to Patient Portal →"}
                </button>
              </form>
            )}

            {/* Phone OTP — step 1: enter phone */}
            {tab === "phone" && !otpSent && (
              <div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrap">
                    <div className="input-prefix">📞</div>
                    <input type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} />
                  </div>
                </div>
                <button className="login-btn" onClick={handleRequestOTP} disabled={loading}>
                  {loading ? <><span className="spinner" />Sending OTP…</> : "Send OTP →"}
                </button>
              </div>
            )}

            {/* Phone OTP — step 2: enter OTP */}
            {tab === "phone" && otpSent && (
              <div>
                {devOtp && <div className="info-msg">🛠️ <strong>Dev OTP:</strong> {devOtp} — remove in production</div>}
                <div className="form-group">
                  <label>Enter OTP sent to {phone}</label>
                  <div className="otp-inputs">
                    {otp.map((d, i) => (
                      <input key={i} id={"otp-" + i} className="otp-input" type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)} />
                    ))}
                  </div>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    {resendTimer > 0
                      ? <span style={{ fontSize: 13, color: "#94a3b8" }}>Resend in {resendTimer}s</span>
                      : <button className="resend-link" onClick={handleRequestOTP} disabled={loading}>Resend OTP</button>
                    }
                  </div>
                </div>
                <button className="login-btn" onClick={handleVerifyOTP} disabled={loading}>
                  {loading ? <><span className="spinner" />Verifying…</> : "Verify & Sign In →"}
                </button>
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button className="resend-link" onClick={() => { setOtpSent(false); setOtp(["","","","","",""]); setDevOtp(""); setError(""); }}>← Change number</button>
                </div>
              </div>
            )}

            <div className="register-text">
              New patient? <Link to="/patient/signup">Create your account here</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
