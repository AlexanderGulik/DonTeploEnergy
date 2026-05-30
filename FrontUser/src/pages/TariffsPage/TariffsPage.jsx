import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import styles from './TariffsPage.module.css';
import { Tariffs } from '../../API/TariffsService.js';

import padIcon from '../../assets/icon-pad.svg';
import sackIcon from '../../assets/icon-sack.svg';
import houseIcon from '../../assets/icon-house.svg';
import cityIcon from '../../assets/icon-city.svg';
import statsIcon from '../../assets/icon-stats.svg';
import listIcon from '../../assets/icon-list.svg';
import drawerIcon from '../../assets/icon-drawer.svg';
import termianlIcon from '../../assets/icon-terminal.svg';
import bankIcon from '../../assets/icon-bank.svg';
import phoneBankIcon from '../../assets/icon-phonebank.svg';
import smartphoneIcon from '../../assets/icon-smartphone.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import mailIcon from '../../assets/icon-mail.svg';
import creditIcon from '../../assets/icon-credit.svg';
import tariffIcon from '../../assets/icon-tariff.svg';

const TariffsPage = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [activeTab, setActiveTab] = useState('population'); // 'population' или 'budget'

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const data = await Tariffs.getTariffs();
      setTariffs(data);
      
      const currentTariff = data.find(t => t.isCurrent);
      if (currentTariff) {
        setSelectedPeriod(currentTariff.id);
      }
    } catch (err) {
      console.error('Ошибка загрузки тарифов', err);
      alert('Не удалось загрузить данные о тарифах');
    } finally {
      setLoading(false);
    }
  };

  const currentTariff = tariffs.find(t => t.id === selectedPeriod) || tariffs.find(t => t.isCurrent);
  const archiveTariffs = tariffs.filter(t => !t.isCurrent);

  return (
      <> 
      <Header title="Тарифы и оплата" />
    <ContainerComponent>
      
      <main className={styles.Main}>
        {/* Hero секция */}
        <section className={styles.HeroSection}>
          <div className={styles.HeroContent}>
            <h1 className={styles.HeroTitle}><img src ={tariffIcon}/> Тарифы на теплоснабжение</h1>
            <p className={styles.HeroSubtitle}>
              Актуальные цены на отопление и горячее водоснабжение для населения и организаций
            </p>
          </div>
          <div className={styles.HeroBadge}>
            <span className={styles.BadgeIcon}><img src = {padIcon}/></span>
            <span>Обновлено: {new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </section>

        {loading ? (
          <div className={styles.LoadingState}>
            <div className={styles.Spinner}></div>
            <p>Загрузка тарифов...</p>
          </div>
        ) : (
          <>
            {/* Текущий тариф */}
            {currentTariff && (
              <section className={styles.CurrentTariffSection}>
                <div className={styles.SectionHeader}>
                  <h2 className={styles.SectionTitle}>
                    <span className={styles.TitleIcon}><img src = {sackIcon}/></span>
                    Действующие тарифы
                  </h2>
                  <span className={styles.PeriodBadge}>{currentTariff.period}</span>
                </div>

                <p className={styles.BasisText}>
                  <strong>Основание:</strong> {currentTariff.basis}
                </p>

                {/* Табы для переключения */}
                <div className={styles.Tabs}>
                  <button 
                    className={`${styles.Tab} ${activeTab === 'population' ? styles.ActiveTab : ''}`}
                    onClick={() => setActiveTab('population')}
                  >
                    <img src={houseIcon}/> Для населения
                  </button>
                  <button 
                    className={`${styles.Tab} ${activeTab === 'budget' ? styles.ActiveTab : ''}`}
                    onClick={() => setActiveTab('budget')}
                  >
                    <img src={cityIcon}/> Для организаций
                  </button>
                </div>

                {/* Таблица тарифов */}
                <div className={styles.TariffTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Услуга</th>
                        <th>Единица измерения</th>
                        <th>Тариф</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTab === 'population' ? currentTariff.population : currentTariff.budget).map((item, index) => {
                        // Парсим строку вида "Отопление: 2500 руб/Гкал"
                        const parts = item.split(':');
                        const service = parts[0];
                        const price = parts[1]?.trim() || item;
                        
                        return (
                          <tr key={index}>
                            <td className={styles.ServiceName}>{service}</td>
                            <td className={styles.Unit}>Гкал</td>
                            <td className={styles.Price}>{price}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Информация о НДС */}
                <div className={styles.TaxInfo}>
                  {activeTab === 'population' ? (
                    <p><img src={listIcon}/> Тарифы для населения указаны <strong>с учетом НДС</strong></p>
                  ) : (
                    <p><img src={statsIcon}/> Тарифы для организаций указаны <strong>без учета НДС</strong></p>
                  )}
                </div>
              </section>
            )}

            {/* Архивные тарифы */}
            {archiveTariffs.length > 0 && (
              <section className={styles.ArchiveSection}>
                <h3 className={styles.ArchiveTitle}>
                  <span className={styles.TitleIcon}><img src ={drawerIcon}/></span>
                  Архив тарифов
                </h3>

                <div className={styles.ArchiveGrid}>
                  {archiveTariffs.map(tariff => (
                    <div key={tariff.id} className={styles.ArchiveCard}>
                      <div className={styles.ArchiveCardHeader}>
                        <h4 className={styles.ArchivePeriod}>{tariff.period}</h4>
                      </div>
                      <p className={styles.ArchiveBasis}>{tariff.basis}</p>
                      
                      <div className={styles.ArchiveDetails}>
                        <div className={styles.ArchiveGroup}>
                          <h5>Для населения:</h5>
                          <ul>
                            {tariff.population.slice(0, 2).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                            {tariff.population.length > 2 && (
                              <li className={styles.MoreItems}>+ ещё {tariff.population.length - 2}</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <button 
                        className={styles.ViewButton}
                        onClick={() => setSelectedPeriod(tariff.id)}
                      >
                        Посмотреть подробнее →
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Информация об оплате */}
            <section className={styles.PaymentSection}>
              <h3 className={styles.PaymentTitle}>
                <span className={styles.TitleIcon}><img src= {creditIcon}/></span>
                Способы оплаты
              </h3>
              
              <div className={styles.PaymentGrid}>
                <div className={styles.PaymentCard}>
                  <div className={styles.PaymentIcon}><img src={bankIcon}/></div>
                  <h4>Банковский перевод</h4>
                  <p>Оплата через любой банк по реквизитам</p>
                </div>
                
                <div className={styles.PaymentCard}>
                  <div className={styles.PaymentIcon}><img src = {smartphoneIcon}/></div>
                  <h4>Онлайн-оплата</h4>
                  <p>Через личный кабинет или мобильное приложение</p>
                </div>
                
                <div className={styles.PaymentCard}>
                  <div className={styles.PaymentIcon}><img src = {termianlIcon}/></div>
                  <h4>Терминалы</h4>
                  <p>В отделениях почты и банков-партнеров</p>
                </div>
                
                <div className={styles.PaymentCard}>
                  <div className={styles.PaymentIcon}><img src = {phoneBankIcon}/></div>
                  <h4>Автоплатеж</h4>
                  <p>Настройте автоматическое списание</p>
                </div>
              </div>
            </section>

            {/* Контактная информация */}
            <section className={styles.ContactSection}>
              <div className={styles.ContactCard}>
                <div className={styles.ContactIcon}><img src = {phoneIcon}/></div>
                <div>
                  <h4>Вопросы по тарифам?</h4>
                  <p>Звоните: 8 (800) 123-45-67 (доб. 2)</p>
                </div>
              </div>
              <div className={styles.ContactCard}>
                <div className={styles.ContactIcon}><img src = {mailIcon}/></div>
                <div>
                  <h4>Электронная почта</h4>
                  <p>tariffs@donbass-teplo.ru</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

    </ContainerComponent>

      <Footer />
    </>
  );
};

export default TariffsPage;
