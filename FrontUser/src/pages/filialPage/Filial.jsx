// src/pages/Filial/Filial.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import styles from './Filial.module.css';

import officeIcon from '../../assets/icon-office.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import locationIcon from '../../assets/icon-marker.svg';
import clockIcon from '../../assets/icon-clock.svg';
import userIcon from '../../assets/icon-man.svg';
import fireIcon from '../../assets/icon-flame.svg';
import newsIcon from '../../assets/icon-man.svg';

// Импорт данных
import { branchesData } from '../../data/data.js';

const Filial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем данные филиала
  const branchData = location.state?.branchData || branchesData[id];

  useEffect(() => {
    if (!branchData) {
      navigate('/');
    }
    window.scrollTo(0, 0);

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => navigate(-1));
    }
  }, [branchData, navigate]);

  if (!branchData) {
    return null;
  }

  // Функция для генерации URL карты Яндекс
  const getMapUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    // Используем статическую карту Яндекс
    return `https://static-maps.yandex.ru/1.x/?ll=37.6,48.0&z=12&l=map&pt=37.6,48.0,pm2dgl`;
  };

  // Функция для открытия карты в новой вкладке
  const openMap = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://yandex.ru/maps/?text=${encodedAddress}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <>
      <Header title={branchData.name} />
      <ContainerComponent>
        <div className={styles.FilialPage}>
          {/* Навигация */}
          <div className={styles.Navigation}>
            <button onClick={() => navigate('/')} className={styles.NavLink}>
              Главная
            </button>
            <span className={styles.Separator}>/</span>
            <span className={styles.CurrentPage}>{branchData.name}</span>
          </div>

          {/* Заголовок */}
          <div className={styles.Header}>
            <div className={styles.LogoSection}>
              <div className={styles.LogoIcon}>
                <img src={officeIcon} alt="logo" />
              </div>
              <div>
                <span className={styles.CompanyName}>ГУП ДНР «ДОНБАССТЕПЛОЭНЕРГО»</span>
                <h1 className={styles.BranchTitle}>{branchData.name}</h1>
              </div>
            </div>
          </div>

          {/* Контакты центрального офиса Филиала */}
          <div className={styles.ContactSection}>
            <h2 className={styles.SectionTitle}>Контакты центрального офиса Филиала</h2>
            
            <div className={styles.ContactGrid}>
              <div className={styles.ContactCard}>
                <div className={styles.ContactIcon}>
                  <img src={locationIcon} alt="address" />
                </div>
                <div>
                  <h3>Адрес</h3>
                  <p>{branchData.address}</p>
                  <button 
                    className={styles.MapButton}
                    onClick={() => openMap(branchData.address)}
                  >
                    Показать на карте →
                  </button>
                </div>
              </div>
              
              <div className={styles.ContactCard}>
                <div className={styles.ContactIcon}>
                  <img src={phoneIcon} alt="email" />
                </div>
                <div>
                  <h3>E-mail</h3>
                  <p>{branchData.email}</p>
                </div>
              </div>
              
              <div className={styles.ContactCard}>
                <div className={styles.ContactIcon}>
                  <img src={phoneIcon} alt="phone" />
                </div>
                <div>
                  <h3>Телефон</h3>
                  <p>{branchData.phone}</p>
                  {branchData.additionalPhones && branchData.additionalPhones.map((phone, idx) => (
                    <p key={idx} className={styles.AdditionalPhone}>{phone}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Карта */}
          <div className={styles.MapSection}>
            <h2 className={styles.SectionTitle}>Расположение на карте</h2>
            <div className={styles.MapContainer}>
              <iframe
                src={`https://yandex.ru/map-widget/v1/?um=constructor&text=${encodeURIComponent(branchData.address)}&lang=ru_RU&source=constructor`}
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
                title="Карта филиала"
                className={styles.MapFrame}
              ></iframe>
            </div>
            <button 
              className={styles.OpenMapButton}
              onClick={() => openMap(branchData.address)}
            >
              Открыть полную карту →
            </button>
          </div>

          {/* Руководство Филиала и приемные часы */}
          <div className={styles.ManagementSection}>
            <h2 className={styles.SectionTitle}>Руководство Филиала и приемные часы</h2>
            
            <div className={styles.DirectorCard}>
              <div className={styles.DirectorIcon}>
                <img src={userIcon} alt="director" />
              </div>
              <div className={styles.DirectorInfo}>
                <h3>Директор Филиала «{branchData.shortName}»:</h3>
                <p className={styles.DirectorName}>{branchData.director}</p>
                <div className={styles.ReceptionHours}>
                  <div className={styles.HoursItem}>
                    <span className={styles.HoursLabel}>Приемные дни:</span>
                    <span>{branchData.receptionDays}</span>
                  </div>
                  <div className={styles.HoursItem}>
                    <span className={styles.HoursLabel}>Адрес:</span>
                    <span>{branchData.address}</span>
                  </div>
                  <div className={styles.HoursItem}>
                    <span className={styles.HoursLabel}>Предварительная запись:</span>
                    <span>{branchData.appointmentNote}</span>
                  </div>
                  <div className={styles.HoursItem}>
                    <span className={styles.HoursLabel}>Необходимые документы:</span>
                    <span>паспорт либо документ, удостоверяющий личность, оригиналы/копии документов по проблемному вопросу</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Цифры и факты */}
          <div className={styles.FactsSection}>
            <h2 className={styles.SectionTitle}>Цифры и факты</h2>
            <div className={styles.FactsGrid}>
              {branchData.facts.map((fact, index) => (
                <div key={index} className={styles.FactCard}>
                  <p className={styles.FactText}>{fact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Виды деятельности */}
          <div className={styles.ActivitiesSection}>
            <h2 className={styles.SectionTitle}>Виды деятельности Филиала</h2>
            <ul className={styles.ActivitiesList}>
              {branchData.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>

          {/* Перспективы развития */}
          <div className={styles.DevelopmentSection}>
            <h2 className={styles.SectionTitle}>Перспективы развития Филиала</h2>
            <div className={styles.DevelopmentContent}>
              <p>{branchData.development.intro}</p>
              <ul className={styles.DevelopmentList}>
                {branchData.development.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Аварийная служба */}
          <div className={styles.EmergencySection}>
            <div className={styles.EmergencyCard}>
              <div className={styles.EmergencyIcon}>
                <img src={fireIcon} alt="emergency" />
              </div>
              <div>
                <h3>Телефон аварийной службы Филиала</h3>
                <p className={styles.EmergencyPhone}>
                  {branchData.emergencyPhone || branchData.emergencyPhones?.[0] || branchData.phone}
                </p>
                {branchData.emergencyPhones && branchData.emergencyPhones.slice(1).map((phone, idx) => (
                  <p key={idx} className={styles.EmergencyAdditionalPhone}>{phone}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Вакансии */}
          <div className={styles.VacanciesSection}>
            <h2 className={styles.SectionTitle}>Информация о вакансиях Филиала</h2>
            <div className={styles.VacanciesCard}>
              <p className={styles.VacanciesIntro}>
                В Филиал «{branchData.shortName}» ГУП ДНР «ДОНБАССТЕПЛОЭНЕРГО» на работу требуются:
              </p>
              <ul className={styles.VacanciesList}>
                {branchData.vacancies.map((vacancy, index) => (
                  <li key={index}>{vacancy}</li>
                ))}
              </ul>
              <p className={styles.VacanciesContact}>
                Тел.: {branchData.phone}, e-mail: {branchData.vacanciesEmail}
              </p>
            </div>
          </div>

          {/* Пункты приема абонентов */}
          {branchData.abonentsPoints && (
            <div className={styles.AbonentsPointsSection}>
              <h2 className={styles.SectionTitle}>Пункты приема абонентов Филиала</h2>
              <div className={styles.AbonentsPointsGrid}>
                {branchData.abonentsPoints.map((point, index) => (
                  <div key={index} className={styles.AbonentsPointCard}>
                    <div className={styles.AbonentsPointDistrict}>{point.district}</div>
                    <div className={styles.AbonentsPointAddress}>{point.address}</div>
                    {point.phone && <div className={styles.AbonentsPointPhone}>Тел.: {point.phone}</div>}
                    {point.note && <div className={styles.AbonentsPointNote}>{point.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Новости */}
          <div className={styles.NewsSection}>
            <h2 className={styles.SectionTitle}>Последние новости</h2>
            <div className={styles.NewsGrid}>
              {branchData.news.map((news, index) => (
                <div key={index} className={styles.NewsCard}>
                  <div className={styles.NewsIcon}>
                    <img src={newsIcon} alt="news" />
                  </div>
                  <div className={styles.NewsContent}>
                    <span className={styles.NewsDate}>{news.date}</span>
                    <h3 className={styles.NewsTitle}>{news.title}</h3>
                  </div>
                </div>
              ))}
            </div>
           
          </div>
        </div>
      </ContainerComponent>
      <Footer />
    </>
  );
};

export default Filial;
