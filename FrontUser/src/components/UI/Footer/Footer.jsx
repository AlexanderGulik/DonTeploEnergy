import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../../assets/logo1.png';

const Footer = () => {
  return (
    <footer className={styles.Footer}>
      <div className={styles.FooterContent}>
        <div className={styles.LogoSection}>
          <img src={logo} alt="Logo" className={styles.Logo} />
          <p className={styles.Copyright}>
            © 2015 - 2026  Донбасс Тепло Энерго.<br />Все права защищены.
          </p>
        </div>
        
        <div className={styles.LinksSection}>
          <h4 className={styles.LinksTitle}>Заявки</h4>
          <Link to="/forms/no-heating" className={styles.FooterLink}>Нет отопления</Link>
          <Link to="/forms/no-hot-water" className={styles.FooterLink}>Нет горячей воды</Link>
          <Link to="/forms/emergency" className={styles.FooterLink}>Аварийная заявка</Link>
        </div>
        
        <div className={styles.LinksSection}>
          <h4 className={styles.LinksTitle}>Информация</h4>
          <Link to="/info/tariffs" className={styles.FooterLink}>Тарифы</Link>
          <Link to="/info/outages" className={styles.FooterLink}>Отключения</Link>
          <Link to="/faq" className={styles.FooterLink}>Вопросы и ответы</Link>
        </div>
        
        <div className={styles.LinksSection}>
          <h4 className={styles.LinksTitle}>Контакты</h4>
          <a href="tel:+78001234567" className={styles.FooterLink}>7 (949) 306-41-35</a>
          <a href="mailto:info@donbass-teplo.ru" className={styles.FooterLink}>info@donbass-teplo.ru</a>
          <span className={styles.FooterText}>г. Донецк, ул. Постышева, 68.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
