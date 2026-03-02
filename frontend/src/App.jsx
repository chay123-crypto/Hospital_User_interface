import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import PatientLogin      from "./pages/PatientLogin";
import PatientSignup     from "./pages/PatientSignup";
import PatientDashboard  from "./pages/PatientDashboard";
import QueryForm         from "./pages/QueryForm";
import AppointmentForm   from "./pages/AppointmentForm";
import MyAppointments    from "./pages/MyAppointments";
import MyQueries         from "./pages/MyQueries";
import HealthBot         from "./components/HealthBot";

function ProtectedRoute({ children }) {
  const patientId = sessionStorage.getItem("patient_id");
  if (!patientId) return <Navigate to="/patient/login" replace />;
  return children;
}

// Renders HealthBot on all protected pages
function BotWrapper() {
  const location = useLocation();
  const patientId = sessionStorage.getItem("patient_id");
  const isPublic = location.pathname.includes("/login") || location.pathname.includes("/signup");
  if (isPublic || !patientId) return null;
  return <HealthBot patientId={patientId} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/patient/login" replace />} />
        <Route path="/patient/login"  element={<PatientLogin />} />
        <Route path="/patient/signup" element={<PatientSignup />} />
        <Route path="/patient/:patient_id/dashboard"    element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/:patient_id/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path="/patient/:patient_id/my-queries"   element={<ProtectedRoute><MyQueries /></ProtectedRoute>} />
        <Route path="/patient/:patient_id/query"        element={<ProtectedRoute><QueryForm /></ProtectedRoute>} />
        <Route path="/patient/:patient_id/appointment"  element={<ProtectedRoute><AppointmentForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/patient/login" replace />} />
      </Routes>
      <BotWrapper />
    </BrowserRouter>
  );
}
