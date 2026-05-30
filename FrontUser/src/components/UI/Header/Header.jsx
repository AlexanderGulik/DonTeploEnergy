// src/components/UI/Header/Header.jsx
import React, { useState } from 'react';
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

const Header = ({ title = 'Главная' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className={styles.Header}>
      <div className={styles.HeaderTop}>
        <div className={styles.Brand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h1 className={styles.BrandTitle}>Донбасс Тепло Энерго</h1>
        </div>

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
                <img src = {emergencyIcon} alt="emergency"/> Аварийная заявка
              </Link>
            </div>
          </div>
          
          <div className={styles.Dropdown}>
            <span className={styles.NavLink}>Информация ▼</span>
            <div className={styles.DropdownContent}>
              <Link to="/info/tariffs" className={styles.DropdownLink}>
                <img src={tariffIcon}/> Тарифы
              </Link>
              <Link to="/info/outages" className={styles.DropdownLink}>
                <img src={outagesIcon}/> Отключения
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
                    <img src = {profileIcon} /> Личный кабинет
                  </Link>
                  <div className={styles.UserDropdownDivider}></div>
                  <button 
                    className={styles.UserDropdownButton}
                    onClick={handleLogout}
                  >
                    <img src = {exitIcon} /> Выйти
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

      {title !== 'Главная' && (
        <div className={styles.PageTitleWrapper}>
          <h2 className={styles.PageTitle}>{title}</h2>
        </div>
      )}
    </header>
  );
};

export default Header;
