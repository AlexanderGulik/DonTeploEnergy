// src/pages/MainPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContainerComponent from '../components/Layout/ContainerComponent';
import Header from '../components/UI/Header/Header.jsx';
import Footer from '../components/UI/Footer/Footer.jsx';
import MainPageContent from '../components/MainPage/MainPageContent';

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => navigate(-1));
    }
  }, [navigate]);

  return (
      <>
      <Header title="Главная"  />
    <ContainerComponent>
      <MainPageContent />
     
    </ContainerComponent>
 <Footer />
    </>
  );
};

export default MainPage;
