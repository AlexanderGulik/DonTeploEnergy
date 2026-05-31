import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainPage from '../../pages/MainPage';
import LoginPage from '../../pages/AuthPage/LoginPage'
import RegisterPage from '../../pages/AuthPage/RegisterPage';
import ProfilePage from '../../pages/ProfilePage/ProfilePage';
import NoHeatingPage from '../../pages/Forms/NoHeatingPage';
import NoHotWaterPage from '../../pages/Forms/NoHotWaterPage';
import EmergencyPage from '../../pages/Forms/EmergencyPage';
import TariffsPage from '../../pages/TariffsPage/TariffsPage';
import OutagesPage from '../../pages/OutagesPage/OutagesPage';
import FAQPage from '../../pages/FAQPage/FAQPage';
import Filial from '../../pages/filialPage/Filial'; // Импортируем компонент филиала
import ScrollToTop from '../UI/Scroll/ScrollToTop.jsx';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/profile" />;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Загрузка...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/forms/no-heating" element={<NoHeatingPage />} />
        <Route path="/forms/no-hot-water" element={<NoHotWaterPage />} />
        <Route path="/forms/emergency" element={<EmergencyPage />} />
        <Route path="/info/tariffs" element={<TariffsPage />} />
        <Route path="/info/outages" element={<OutagesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        
        {/* Маршрут для страницы филиала */}
        <Route path="/filial/:id" element={<Filial />} />
      </Routes>
    </>
  );
};

export default AppRouter;
