import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainPageContent.module.css';

import arrowIcon from '../../assets/iconArrow.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import locationIcon from '../../assets/icon-marker.svg';
import clockIcon from '../../assets/icon-clock.svg';
import outageIcon from '../../assets/icon-exclamation.svg';
import questIcon from '../../assets/icon-questuion.svg';
import tariffIcon from '../../assets/icon-tariff.svg';
import officeIcon from '../../assets/icon-office.svg';

import waterIcon from '../../assets/icon-water.svg';
import fireIcon from '../../assets/icon-flame.svg';
import emergencyIcon from '../../assets/icon-wrench.svg';

import slide1 from '../../assets/side1.jpg';
import slide2 from '../../assets/side2.jpg';
import slide3 from '../../assets/side3.jpg';
import slide4 from '../../assets/side4.jpg';

import guaranteeIcon from '../../assets/icon-city.svg';
import teamIcon from '../../assets/icon-man.svg';
import techIcon from '../../assets/icon-sack.svg';
import paymentIcon from '../../assets/icon-bank.svg';

const MainPageContent = () => {
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { id: 1, image: slide1, alt: 'Теплоснабжение дома' },
    { id: 2, image: slide2, alt: 'Котельная Донбасс Тепло Энерго' },
    { id: 3, image: slide3, alt: 'Работы по отоплению' },
    { id: 4, image: slide4, alt: 'Горячее водоснабжение' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const advantages = [
    {
      icon: <img src={guaranteeIcon} alt="guarantee" />,
      title: 'Гарантия качества',
      description: 'Все работы выполняются по ГОСТ и СНиП с предоставлением гарантии до 5 лет',
    },
    {
      icon: <img src={teamIcon} alt="team" />,
      title: 'Опытная команда',
      description: 'Более 200 специалистов с профильным образованием и стажем от 7 лет',
    },
    {
      icon: <img src={techIcon} alt="tech" />,
      title: 'Современное оборудование',
      description: 'Используем новейшие технологии для быстрого и качественного ремонта',
    },
    {
      icon: <img src={paymentIcon} alt="payment" />,
      title: 'Прозрачные цены',
      description: 'Фиксированные тарифы без скрытых платежей и комиссий',
    },
  ];

  const branches = [
    'Филиал «Амвросиевкатеплосеть»',
    'Филиал «Горловкатеплосеть»',
    'Филиал «Донецктеплосеть»',
    'Филиал «Енакиевотеплосеть»',
    'Филиал «Макеевкатеплосеть»',
    'Филиал «Новоазовсктеплосеть»',
    'Филиал «Снежноетеплосеть»',
    'Филиал «Харцызсктеплосеть»',
    'Филиал «Шахтерсктеплосеть»',
    'Филиал «Волновахатеплосеть»',
    'Филиал «Мариупольтеплосеть»',
  ];

  const services = [
    {
      title: 'Нет отопления',
      description: 'Оставьте заявку, если в вашем доме отсутствует отопление',
      icon: <img src={fireIcon} alt="fire"/>,
      color: '#e74c3c',
      path: '/forms/no-heating',
      urgent: false,
    },
    {
      title: 'Нет горячей воды',
      description: 'Сообщите об отсутствии горячего водоснабжения',
      icon: <img src={waterIcon} alt="water"/>,
      color: '#3498db',
      path: '/forms/no-hot-water',
      urgent: false,
    },
    {
      title: 'Аварийная ситуация',
      description: 'Прорыв трубы, затопление или другая чрезвычайная ситуация',
      icon: <img src={emergencyIcon} alt="emergency"/>,
      color: '#c0392b',
      path: '/forms/emergency',
      urgent: true,
    },
  ];

  const quickLinks = [
    { title: 'Тарифы на услуги', icon: <img src={tariffIcon} alt="tariff"/>, path: '/info/tariffs' },
    { title: 'Плановые отключения', icon: <img src={outageIcon} alt="outage"/>, path: '/info/outages' },
    { title: 'Часто задаваемые вопросы', icon: <img src={questIcon} alt="quest"/>, path: '/faq' },
  ];

  return (
    <main className={styles.Main}>
      <section className={styles.Hero}>
        <div className={styles.HeroContainer}>
          <div className={styles.HeroContent}>
            <h1 className={styles.HeroTitle}>
              Тепло и комфорт <span className={styles.Highlight}>для каждого дома</span>
            </h1>
            <p className={styles.HeroSubtitle}>
              Донбасс Тепло Энерго — надёжное теплоснабжение Донецкого региона. 
              Оперативное решение любых вопросов с отоплением и горячим водоснабжением.
            </p>
            <div className={styles.HeroActions}>
              <button 
                className={styles.PrimaryButton}
                onClick={() => navigate('/forms/emergency')}
              >
                Срочная заявка
              </button>
              <button 
                className={styles.SecondaryButton}
                onClick={() => navigate('/info/outages')}
              >
                График отключений
              </button>
            </div>
          </div>

          <div className={styles.Carousel}>
            <div className={styles.CarouselContainer}>
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`${styles.CarouselSlide} ${index === currentSlide ? styles.Active : ''}`}
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <img src={slide.image} alt={slide.alt} className={styles.CarouselImage} />
                </div>
              ))}
            </div>
            
            <div className={styles.CarouselIndicators}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.Indicator} ${index === currentSlide ? styles.ActiveIndicator : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            
            <button className={`${styles.CarouselButton} ${styles.PrevButton}`} onClick={prevSlide}>
              ❮
            </button>
            <button className={`${styles.CarouselButton} ${styles.NextButton}`} onClick={nextSlide}>
              ❯
            </button>
          </div>
        </div>

        <div className={styles.HeroStats}>
          <div className={styles.StatItem}>
            <span className={styles.StatValue}>24/7</span>
            <span className={styles.StatLabel}>Аварийная служба</span>
          </div>
          <div className={styles.StatDivider}></div>
          <div className={styles.StatItem}>
            <span className={styles.StatValue}>15 мин</span>
            <span className={styles.StatLabel}>Среднее время ответа</span>
          </div>
          <div className={styles.StatDivider}></div>
          <div className={styles.StatItem}>
            <span className={styles.StatValue}>50 000+</span>
            <span className={styles.StatLabel}>Довольных клиентов</span>
          </div>
        </div>
      </section>

      <section className={styles.AdvantagesSection}>
        <div className={styles.SectionHeader}>
          <span className={styles.SectionBadge}>Преимущества</span>
          <h2 className={styles.SectionTitle}>Почему выбирают <span className={styles.HighlightText}>Донбасс Тепло Энерго</span></h2>
          <p className={styles.SectionDescription}>
            Мы заботимся о каждом клиенте и гарантируем высокое качество услуг
          </p>
        </div>
        <div className={styles.AdvantagesGrid}>
          {advantages.map((adv, index) => (
            <div key={index} className={styles.AdvantageCard}>
              <div className={styles.AdvantageIcon}>{adv.icon}</div>
              <h3 className={styles.AdvantageTitle}>{adv.title}</h3>
              <p className={styles.AdvantageDescription}>{adv.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ContactsSection}>
        <div className={styles.SectionHeader}>
          <span className={styles.SectionBadge}>Наша сеть</span>
          <h2 className={styles.SectionTitle}>Наши <span className={styles.HighlightText}>контакты</span></h2>
          <p className={styles.SectionDescription}>
            ГУП ДНР «Донбасстеплоэнерго» — филиалы по всему Донецкому региону
          </p>
        </div>

        <div className={styles.BranchesGrid}>
          {branches.map((branch, index) => (
            <div key={index} className={styles.BranchCard}>
              <div className={styles.BranchIcon}></div>
              <span className={styles.BranchName}>{branch}</span>
            </div>
          ))}
        </div>

        <div className={styles.MainOfficeCard}>
          <div className={styles.MainOfficeIcon}><img src = {officeIcon}/></div>
          <div className={styles.MainOfficeContent}>
            <h3 className={styles.MainOfficeTitle}>Центральный офис ГУП ДНР «Донбасстеплоэнерго»</h3>
            <p className={styles.MainOfficeAddress}>ДНР, 283086, г. Донецк, ул. Донецкая, 38.</p>
            <button 
              className={styles.DetailsButton}
              onClick={() => navigate('/')}
            >
              Подробнее 
            </button>
          </div>
        </div>
      </section>

      <section className={styles.ServicesSection}>
        <div className={styles.SectionHeader}>
          <span className={styles.SectionBadge}>Заявка онлайн</span>
          <h2 className={styles.SectionTitle}>Оставить заявку</h2>
          <p className={styles.SectionDescription}>
            Выберите тип обращения — мы решим проблему в кратчайшие сроки
          </p>
        </div>

        <div className={styles.ServicesGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              className={`${styles.ServiceCard} ${service.urgent ? styles.UrgentCard : ''}`}
              onClick={() => navigate(service.path)}
            >
              {service.urgent && (
                <span className={styles.UrgentBadge}>СРОЧНО</span>
              )}
              <div className={styles.ServiceIcon} style={{ color: service.color }}>
                {service.icon}
              </div>
              <h3 className={styles.ServiceTitle}>{service.title}</h3>
              <p className={styles.ServiceDescription}>{service.description}</p>
              <button className={styles.ServiceButton}>
                Оформить заявку 
              </button>        
            </div>
          ))}
        </div>
      </section>

      <section className={styles.InfoSection}>
        <div className={styles.QuickLinksGrid}>
          {quickLinks.map((link, index) => (
            <div
              key={index}
              className={styles.QuickLinkCard}
              onClick={() => navigate(link.path)}
            >
              <span className={styles.QuickLinkIcon}>{link.icon}</span>
              <span className={styles.QuickLinkTitle}>{link.title}</span>
              <span className={styles.QuickLinkArrow}>→</span>
            </div>
          ))}
        </div>

        <div className={styles.ContactBanner}>
          <div className={styles.ContactInfo}>
            <div className={styles.ContactIcon}><img src={clockIcon} alt="clock"/></div>
            <div>
              <h4>Круглосуточная поддержка</h4>
              <p>Аварийная служба работает 24/7 без выходных</p>
            </div>
          </div>
          <div className={styles.ContactInfo}>
            <div className={styles.ContactIcon}><img src={phoneIcon} alt="phone" /></div>
            <div>
              <h4>Единый контакт-центр</h4>
              <p>7(856) 304-53-3 • donbassteploenergo@mail.ru</p>
            </div>
          </div>
          <div className={styles.ContactInfo}>
            <div className={styles.ContactIcon}><img src={locationIcon} alt="location" /></div>
            <div>
              <h4>Главный офис</h4>
              <p>ДНР, 283086, г. Донецк, ул. Донецкая, 38.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPageContent;
