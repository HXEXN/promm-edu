import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WhyLearnPage from './pages/WhyLearnPage';
import EnterprisePage from './pages/EnterprisePage';
import TechnologyPage from './pages/TechnologyPage';
import CorporateEducationPage from './pages/CorporateEducationPage';
import EnterpriseProcess from './pages/EnterpriseProcess';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import StudentAssessment from './pages/StudentAssessment';
import StudentRecommendation from './pages/StudentRecommendation';
import PromptGenerator from './pages/PromptGenerator';
import AdvancedOptimizer from './pages/AdvancedOptimizer';
import TokenOptimizerLab from './pages/TokenOptimizerLab';
import AIEnginesDemo from './pages/AIEnginesDemo';
import TechLab2026 from './pages/TechLab2026';
import FreeTrialPage from './pages/FreeTrialPage';
import ROICalculator from './pages/ROICalculator';
import CaseStudiesPage from './pages/CaseStudiesPage';
import CompetitorComparison from './pages/CompetitorComparison';
import SitemapPage from './pages/SitemapPage';
import EUAIActPage from './pages/EUAIActPage';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<LandingPage />} />

        {/* 학습 */}
        <Route path="/why-learn" element={<WhyLearnPage />} />
        <Route path="/student/assessment" element={<StudentAssessment />} />
        <Route path="/student/recommendation" element={<StudentRecommendation />} />

        {/* 도구 */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prompt-generator" element={<PromptGenerator />} />
        <Route path="/advanced" element={<AdvancedOptimizer />} />
        <Route path="/token-lab" element={<TokenOptimizerLab />} />
        <Route path="/ai-engines" element={<AIEnginesDemo />} />
        <Route path="/tech-lab" element={<TechLab2026 />} />

        {/* 비즈니스 */}
        <Route path="/enterprise/process" element={<EnterpriseProcess />} />
        <Route path="/enterprise/education" element={<CorporateEducationPage />} />
        <Route path="/enterprise/report" element={<EnterprisePage />} />
        <Route path="/enterprise/dashboard" element={<EnterpriseDashboard />} />
        <Route path="/roi-calculator" element={<ROICalculator />} />

        {/* 정보 */}
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/compare" element={<CompetitorComparison />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/eu-ai-act" element={<EUAIActPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />

        {/* 시작하기 */}
        <Route path="/free-trial" element={<FreeTrialPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
