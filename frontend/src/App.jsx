import {Route, Routes, Navigate} from 'react-router-dom';
import './App.css'
import React, { Suspense } from 'react';

const Home = React.lazy(() => import('./pages/private/Home'));
const Login = React.lazy(() => import('./pages/public/Login'));
const Register = React.lazy(() => import('./pages/public/Register'));
const ForgotPassword = React.lazy(() => import('./pages/public/ForgotPassword'));
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
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;