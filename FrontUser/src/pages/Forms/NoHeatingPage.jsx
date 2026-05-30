import React from 'react';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import NoHeatingForm from '../../components/Forms/NoHeatingForm';
import styles from './FormPage.module.css';

import fireIcon from '../../assets/icon-flame.svg';
import clockIcon from '../../assets/icon-clock.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import padIcon from '../../assets/icon-pad.svg';
import temperatureIcon from '../../assets/icon-temperature.svg';
const NoHeatingPage = () => {
  return (
    <>

      <Header title="Нет отопления" />
    <ContainerComponent>
      <div className={styles.PageLayout}>
        <div className={styles.FormSection}>
          <NoHeatingForm />
        </div>
        <div className={styles.InfoSection}>
          <div className={styles.InfoCard}>
            <h3 className={styles.InfoTitle}><img src ={fireIcon}/> Информация</h3>
            <div className={styles.InfoContent}>
              <p className={styles.InfoText}>
                Если в вашей квартире или доме отсутствует отопление, оставьте заявку. 
                Мы проверим систему и восстановим теплоснабжение в кратчайшие сроки.
              </p>
              
              <div className={styles.ContactBlock}>
                <div className={styles.ContactItem}>
                  <span className={styles.ContactIcon}><img src = {phoneIcon}/></span>
                  <div>
                    <strong>Диспетчерская</strong>
                    <p>7 (949) 306-41-35</p>
                  </div>
                </div>
                
                <div className={styles.ContactItem}>
                  <span className={styles.ContactIcon}><img src = {clockIcon}/></span>
                  <div>
                    <strong>Время реагирования</strong>
                    <p>до 2 часов</p>
                  </div>
                </div>
              </div>

              <div className={styles.TipsBlock}>
                <h4><img src = {padIcon}/> Что нужно знать:</h4>
                <ul className={styles.TipsList}>
                  <li>Проверьте, есть ли отопление у соседей</li>
                  <li>Убедитесь, что краны на радиаторах открыты</li>
                  <li>Проверьте, нет ли воздуха в батареях</li>
                  <li>При отключении всего дома — заявка уже может быть в работе</li>
                </ul>
              </div>

              <div className={styles.NormBlock}>
                <h4><img src = {temperatureIcon}/> Нормы температуры:</h4>
                <ul className={styles.NormList}>
                  <li><span>Жилая комната:</span> <strong>+18...+24°C</strong></li>
                  <li><span>Угловая комната:</span> <strong>+20...+26°C</strong></li>
                  <li><span>Кухня:</span> <strong>+18...+26°C</strong></li>
                  <li><span>Ванная:</span> <strong>+18...+26°C</strong></li>
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

export default NoHeatingPage;
