import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";

// Auth Pages
import PortalSelection from "./pages/auth/PortalSelection"; // Added
import Signup from "./pages/auth/Signup";
import DoctorLogin from "./pages/auth/DoctorLogin";
import PatientLogin from "./pages/auth/PatientLogin";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorUploadECG from "./pages/doctor/UploadECG";
import DoctorSignalDisplay from "./pages/doctor/SignalDisplay";
import DoctorAnalyzeECG from "./pages/doctor/AnalyzeECG";
import DoctorResultPage from "./pages/doctor/ResultPage";
import DoctorReportPage from "./pages/doctor/ReportPage";
import DoctorHistory from "./pages/doctor/History";
import PatientHistory from "./pages/patient/PatientHistory";
import PatientMedicalHistory from "./pages/doctor/PatientHistory";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientUploadECG from "./pages/patient/UploadECG";
import PatientSignalDisplay from "./pages/patient/SignalDisplay";
import PatientAnalyzeECG from "./pages/patient/AnalyzeECG";
import PatientResultPage from "./pages/patient/ResultPage";
import PatientReportPage from "./pages/patient/ReportPage";
import ProfilePage from "./pages/patient/ProfilePage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          {/* The root now asks: Doctor or Patient? */}
          <Route path="/" element={<PortalSelection />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Protected Routes with Sidebar Layout */}
          <Route element={<MainLayout />}>
            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRole="DOCTOR" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/upload" element={<DoctorUploadECG />} />
              <Route
                path="/doctor/signal/:id"
                element={<DoctorSignalDisplay />}
              />
              <Route
                path="/doctor/analyze/:id"
                element={<DoctorAnalyzeECG />}
              />
              <Route path="/doctor/result/:id" element={<DoctorResultPage />} />
              <Route path="/doctor/report/:id" element={<DoctorReportPage />} />
              <Route path="/doctor/history" element={<DoctorHistory />} />
              <Route
                path="/doctor/history/patient/:patientId"
                element={<PatientMedicalHistory />}
              />
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRole="PATIENT" />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/upload" element={<PatientUploadECG />} />
              <Route
                path="/patient/signal/:id"
                element={<PatientSignalDisplay />}
              />
              <Route
                path="/patient/analyze/:id"
                element={<PatientAnalyzeECG />}
              />
              <Route
                path="/patient/result/:id"
                element={<PatientResultPage />}
              />
              <Route
                path="/patient/report/:id"
                element={<PatientReportPage />}
              />
              <Route path="/patient/history" element={<PatientHistory />} />
              {/* Shared History Component */}
            </Route>
          </Route>

          {/* 404 Handling */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-black text-gray-200 mb-4">
                    404
                  </h1>
                  <p className="text-xl font-bold text-gray-600">
                    Page Not Found
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="mt-6 text-blue-600 font-bold hover:underline"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
