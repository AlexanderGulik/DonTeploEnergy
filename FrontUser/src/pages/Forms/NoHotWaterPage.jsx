import React from 'react';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import NoHotWaterForm from '../../components/Forms/NoHotWaterForm';
import styles from './FormPage.module.css';

import waterIcon from '../../assets/icon-water.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import clockIcon from '../../assets/icon-clock.svg';
import tipIcon from '../../assets/icon-drawer.svg';

const NoHotWaterPage = () => {
  return (
    <>

      <Header title="Нет горячей воды" />
    <ContainerComponent>
      <div className={styles.PageLayout}>
        <div className={styles.FormSection}>
          <NoHotWaterForm />
        </div>
        <div className={styles.InfoSection}>
          <div className={styles.InfoCard}>
            <h3 className={styles.InfoTitle}><img src = {waterIcon}/> Информация</h3>
            <div className={styles.InfoContent}>
              <p className={styles.InfoText}>
                Отсутствие горячего водоснабжения может быть связано с плановыми работами 
                или аварией на сети. Оставьте заявку для уточнения причин.
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
                    <strong>Допустимый перерыв</strong>
                    <p>до 4 часов (разово)</p>
                  </div>
                </div>
              </div>

              <div className={styles.TipsBlock}>
                <h4><img src = {tipIcon}/> Важно знать:</h4>
                <ul className={styles.TipsList}>
                  <li>Плановые отключения ГВС — до 14 дней в году</li>
                  <li>Температура ГВС должна быть +60...+75°C</li>
                  <li>Проверьте, есть ли вода у соседей</li>
                  <li>При аварии — заявка обрабатывается приоритетно</li>
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

export default NoHotWaterPage;
