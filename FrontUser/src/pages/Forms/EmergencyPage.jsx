import React from 'react';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import EmergencyForm from '../../components/Forms/EmergencyForm';
import styles from './EmergencyPage.module.css';

import emergencyIcon from '../../assets/icon-exclamation.svg';
import clockIcon from '../../assets/icon-clock.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import tipIcon from '../../assets/icon-pad.svg';

const EmergencyPage = () => {
  return (
      <>
      <Header title="Аварийная заявка" />
    <ContainerComponent>
      <div className={styles.PageLayout}>
        <div className={styles.FormSection}>
          <EmergencyForm />
        </div>
        <div className={styles.InfoSection}>
          <div className={styles.InfoCard}>
            <h3 className={styles.InfoTitle}><img src = {emergencyIcon}/>  Экстренная помощь</h3>
            <div className={styles.InfoContent}>
              <p className={styles.InfoText}>
                Аварийная бригада выезжает немедленно при угрозе затопления, 
                прорыве трубы или отсутствии тепла в холодное время года.
              </p>
              
              <div className={styles.ContactBlock}>
                <div className={styles.ContactItem}>
                  <span className={styles.ContactIcon}><img src = {phoneIcon}/></span>
                  <div>
                    <strong>Круглосуточный телефон</strong>
                    <p>7 (949) 306-41-35</p>
                  </div>
                </div>
                
                <div className={styles.ContactItem}>
                  <span className={styles.ContactIcon}><img src = {clockIcon}/></span>
                  <div>
                    <strong>Время прибытия</strong>
                    <p>15-30 минут</p>
                  </div>
                </div>
              </div>

              <div className={styles.TipsBlock}>
                <h4><img src = {tipIcon}/>До приезда бригады:</h4>
                <ul className={styles.TipsList}>
                  <li>Перекройте вентиль на стояке (если возможно)</li>
                  <li>Уберите ценные вещи из зоны протечки</li>
                  <li>Подставьте ёмкость для сбора воды</li>
                  <li>При угрозе замыкания отключите электричество</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerComponent>

      <Footer />
      </>
  );
};

export default EmergencyPage;
