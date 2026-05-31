// src/components/UI/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

import fireIcon from '../../../assets/icon-flame.svg';
import waterIcon from '../../../assets/icon-water.svg';
import emergencyIcon from '../../../assets/icon-wrench.svg';
import tariffIcon from '../../../assets/icon-tariff.svg';
import outagesIcon from '../../../assets/icon-exclamation.svg';
import exitIcon from '../../../assets/icon-exit.svg';
import profileIcon from '../../../assets/icon-profile.svg';
import officeIcon from '../../../assets/icon-office.svg';

const Header = ({ title = 'Главная' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  // Список филиалов
  const branches = [
    { id: 'amvrosievka', name: 'Филиал «Амвросиевкатеплосеть»', path: '/filial/amvrosievka' },
     { id: 'volnovakha', name: 'Филиал «Волновахатеплосеть»', path: '/filial/volnovakha' },
    { id: 'gorlovka', name: 'Филиал «Горловкатеплосеть»', path: '/filial/gorlovka' },
    { id: 'donetsk', name: 'Филиал «Донецктеплосеть»', path: '/filial/donetsk' },
    { id: 'enakievo', name: 'Филиал «Енакиевотеплосеть»', path: '/filial/enakievo' },
    { id: 'makeevka', name: 'Филиал «Макеевкатеплосеть»', path: '/filial/makeevka' },
    { id: 'novoazovsk', name: 'Филиал «Новоазовсктеплосеть»', path: '/filial/novoazovsk' },
    { id: 'snezhnoye', name: 'Филиал «Снежноетеплосеть»', path: '/filial/snezhnoye' },
    { id: 'kharcyzsk', name: 'Филиал «Харцызсктеплосеть»', path: '/filial/kharcyzsk' },
    { id: 'shakhtersk', name: 'Филиал «Шахтерсктеплосеть»', path: '/filial/shakhtersk' },
    { id: 'volnovakha', name: 'Филиал «Волновахатеплосеть»', path: '/filial/volnovakha' },
    { id: 'mariupol', name: 'Филиал «Мариупольтеплосеть»', path: '/filial/mariupol' },
  ];

  // Закрываем меню при ресайзе окна
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Блокируем скролл при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileDropdown = (dropdownName) => {
    if (openMobileDropdown === dropdownName) {
      setOpenMobileDropdown(null);
    } else {
      setOpenMobileDropdown(dropdownName);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderTop}>
        <div className={styles.Brand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h1 className={styles.BrandTitle}>Донбасс Тепло Энерго</h1>
        </div>

        {/* Кнопка бургер-меню */}
        <button 
          className={styles.MobileMenuButton}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Меню"
        >
          ☰
        </button>

        {/* Десктопная навигация */}
        <nav className={styles.Nav}>
          <Link to="/" className={styles.NavLink}>Главная</Link>
          
          <div className={styles.Dropdown}>
            <span className={styles.NavLink}>Заявки ▼</span>
            <div className={styles.DropdownContent}>
              <Link to="/forms/no-heating" className={styles.DropdownLink}>
                <img src={fireIcon} alt="fire"/> Нет отопления
              </Link>
              <Link to="/forms/no-hot-water" className={styles.DropdownLink}>
                <img src={waterIcon} alt="water"/> Нет горячей воды
              </Link>
              <Link to="/forms/emergency" className={styles.DropdownLink}>
                <img src={emergencyIcon} alt="emergency"/> Аварийная заявка
              </Link>
            </div>
          </div>
          
          <div className={styles.Dropdown}>
            <span className={styles.NavLink}>Филиалы ▼</span>
            <div className={styles.DropdownContent}>
              {branches.map((branch) => (
                <Link 
                  key={branch.id}
                  to={branch.path}
                  className={styles.DropdownLink}
                  onClick={closeMobileMenu}
                >
                  <img src={officeIcon} alt="office"/> {branch.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className={styles.Dropdown}>
            <span className={styles.NavLink}>Информация ▼</span>
            <div className={styles.DropdownContent}>
              <Link to="/info/tariffs" className={styles.DropdownLink}>
                <img src={tariffIcon} alt="tariff"/> Тарифы
              </Link>
              <Link to="/info/outages" className={styles.DropdownLink}>
                <img src={outagesIcon} alt="outages"/> Отключения
              </Link>
            </div>
          </div>
          
          <Link to="/faq" className={styles.NavLink}>Вопросы и ответы</Link>
          
          {isAuthenticated ? (
            <div className={styles.UserMenuWrapper}>
              <button 
                className={styles.UserButton}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className={styles.UserAvatar}>
                  {user?.firstname?.charAt(0) || '👤'}
                </span>
                <span className={styles.UserName}>
                  {user?.firstname || 'Профиль'}
                </span>
                <span className={styles.UserArrow}>▼</span>
              </button>
              
              {showUserMenu && (
                <div className={styles.UserDropdown}>
                  <Link 
                    to="/profile" 
                    className={styles.UserDropdownLink}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <img src={profileIcon} alt="profile"/> Личный кабинет
                  </Link>
                  <div className={styles.UserDropdownDivider}></div>
                  <button 
                    className={styles.UserDropdownButton}
                    onClick={handleLogout}
                  >
                    <img src={exitIcon} alt="exit"/> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.LoginButton}>
              Войти
            </Link>
          )}
        </nav>
      </div>

      {/* Мобильное меню */}
      <div className={`${styles.MobileNavOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={closeMobileMenu}></div>
      <div className={`${styles.MobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.MobileNavHeader}>
          <span className={styles.MobileBrandTitle}>Меню</span>
          <button className={styles.MobileNavClose} onClick={closeMobileMenu} aria-label="Закрыть">
            ✕
          </button>
        </div>
        
        <Link to="/" className={styles.MobileNavLink} onClick={closeMobileMenu}>Главная</Link>
        
        {/* Мобильное выпадающее меню - Заявки */}
        <div className={styles.MobileDropdown}>
          <div 
            className={styles.MobileDropdownTitle}
            onClick={() => toggleMobileDropdown('requests')}
          >
            <span>Заявки</span>
            <span className={openMobileDropdown === 'requests' ? styles.ArrowOpen : styles.ArrowClosed}>▼</span>
          </div>
          <div className={`${styles.MobileDropdownContent} ${openMobileDropdown === 'requests' ? styles.open : ''}`}>
            <Link to="/forms/no-heating" className={styles.MobileDropdownLink} onClick={closeMobileMenu}>
              <img src={fireIcon} alt="fire"/> Нет отопления
            </Link>
            <Link to="/forms/no-hot-water" className={styles.MobileDropdownLink} onClick={closeMobileMenu}>
              <img src={waterIcon} alt="water"/> Нет горячей воды
            </Link>
            <Link to="/forms/emergency" className={styles.MobileDropdownLink} onClick={closeMobileMenu}>
              <img src={emergencyIcon} alt="emergency"/> Аварийная заявка
            </Link>
          </div>
        </div>
        
        {/* Мобильное выпадающее меню - Филиалы */}
        <div className={styles.MobileDropdown}>
          <div 
            className={styles.MobileDropdownTitle}
            onClick={() => toggleMobileDropdown('branches')}
          >
            <span>Филиалы</span>
            <span className={openMobileDropdown === 'branches' ? styles.ArrowOpen : styles.ArrowClosed}>▼</span>
          </div>
          <div className={`${styles.MobileDropdownContent} ${openMobileDropdown === 'branches' ? styles.open : ''}`}>
            {branches.map((branch) => (
              <Link
                key={branch.id}
                to={branch.path}
                className={styles.MobileDropdownLink}
                onClick={closeMobileMenu}
              >
                <img src={officeIcon} alt="office"/> {branch.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Мобильное выпадающее меню - Информация */}
        <div className={styles.MobileDropdown}>
          <div 
            className={styles.MobileDropdownTitle}
            onClick={() => toggleMobileDropdown('info')}
          >
            <span>Информация</span>
            <span className={openMobileDropdown === 'info' ? styles.ArrowOpen : styles.ArrowClosed}>▼</span>
          </div>
          <div className={`${styles.MobileDropdownContent} ${openMobileDropdown === 'info' ? styles.open : ''}`}>
            <Link to="/info/tariffs" className={styles.MobileDropdownLink} onClick={closeMobileMenu}>
              <img src={tariffIcon} alt="tariff"/> Тарифы
            </Link>
            <Link to="/info/outages" className={styles.MobileDropdownLink} onClick={closeMobileMenu}>
              <img src={outagesIcon} alt="outages"/> Отключения
            </Link>
          </div>
        </div>
        
        <Link to="/faq" className={styles.MobileNavLink} onClick={closeMobileMenu}>Вопросы и ответы</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" className={styles.MobileNavLink} onClick={closeMobileMenu}>
              <img src={profileIcon} alt="profile" className={styles.MobileIcon}/> Личный кабинет
            </Link>
            <button className={styles.MobileLogoutButton} onClick={handleLogout}>
              <img src={exitIcon} alt="exit" className={styles.MobileIcon}/> Выйти
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.MobileLoginButton} onClick={closeMobileMenu}>
            Войти
          </Link>
        )}
      </div>

      {/* Заголовок страницы */}
      {title !== 'Главная' && (
        <div className={styles.PageTitleWrapper}>
          <h2 className={styles.PageTitle}>{title}</h2>
        </div>
      )}
    </header>
  );
};

export default Header;
