import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import CorporateEducationPage from './pages/CorporateEducationPage';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import StudentAssessment from './pages/StudentAssessment';
import StudentRecommendation from './pages/StudentRecommendation';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 기본 경로를 학생 진단으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/student/assessment" replace />} />

        {/* 학생용 LMS */}
        <Route path="/student/assessment" element={<StudentAssessment />} />
        <Route path="/student/recommendation" element={<StudentRecommendation />} />

        {/* 실습 대시보드 */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 기업용 LMS */}
        <Route path="/enterprise/education" element={<CorporateEducationPage />} />
        <Route path="/enterprise/dashboard" element={<EnterpriseDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
