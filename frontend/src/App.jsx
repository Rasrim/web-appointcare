import {Route, Routes, Navigate} from 'react-router-dom';
import './App.css'
import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = React.lazy(() => import('./pages/private/Home'));
const Login = React.lazy(() => import('./pages/public/Login'));
const Register = React.lazy(() => import('./pages/public/Register'));
const ForgotPassword = React.lazy(() => import('./pages/public/ForgotPasswordWithSecurityQuestions'));
const ResetPassword = React.lazy(() => import('./pages/public/ResetPassword'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/Admin/AdminDashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const SymptomDetail = React.lazy(() => import('./pages/SymptomDetail'));
const FAQ = React.lazy(() => import('./pages/public/FAQ'));
const TermsAndConditions = React.lazy(() => import('./pages/public/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./pages/public/PrivacyPolicy'));
const AboutUs = React.lazy(() => import('./pages/public/AboutUs'));
const ContactUs = React.lazy(() => import('./pages/public/ContactUs'));
const Blog = React.lazy(() => import('./pages/public/Blog'));
const Support = React.lazy(() => import('./pages/public/Support'));
const CookiesPage = React.lazy(() => import('./pages/public/CookiesPage'));
const PolicyPage = React.lazy(() => import('./pages/public/PolicyPage'));
const AllAppointments = React.lazy(() => import('./pages/AllAppointments'));
const AllDoctors = React.lazy(() => import('./pages/AllDoctors'));
const DoctorDetail = React.lazy(() => import('./pages/DoctorDetail'));
const BookAppointmentDetails = React.lazy(() => import('./pages/BookAppointmentDetails'));
const ManageSchedule = React.lazy(() => import('./pages/Admin/ManageSchedule'));

function App() {
  return (
    <>
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#3B82F6' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/symptom/:symptomName" element={<SymptomDetail />} />
        <Route path="/all-appointments" element={<AllAppointments />} />
        <Route path="/all-doctors" element={<AllDoctors />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
        <Route path="/book-appointment-details" element={<BookAppointmentDetails />} />
        <Route path="/my-appointments" element={<AllAppointments />} />
        <Route path="/admin/manage-schedule" element={<ManageSchedule />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/policies" element={<PolicyPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;