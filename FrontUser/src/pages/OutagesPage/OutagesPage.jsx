import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import styles from './OutagesPage.module.css';
import { Outages } from '../../API/OutagesService.js';

import SearchIcon from '../../assets/icon-search.svg';
import calendarIcon from '../../assets/icon-city.svg';
import clockIcon from '../../assets/icon-clock.svg';
import repairIcon from '../../assets/icon-exclamation.svg';
import checkIcon from '../../assets/icon-check-circle.svg';
import calendarClockIcon from '../../assets/icon-calendar-clock.svg';
import padIcon from '../../assets/icon-pad.svg';
import listIcon from '../../assets/icon-list.svg';
import appsIcon from '../../assets/icon-apps.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import manIcon from '../../assets/icon-man.svg';
import outageIcon from '../../assets/icon-wrench.svg';
const OutagesPage = () => {
  const [search, setSearch] = useState('');
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, planned, in-progress, completed
  const [viewMode, setViewMode] = useState('list'); // list или grid
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    try {
      setLoading(true);
      const data = await Outages.getOutages();
      setOutages(data);
    } catch (err) {
      console.error('Ошибка загрузки отключений', err);
      alert('Не удалось загрузить данные об отключениях');
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case 'planned':
        return { text: 'Плановое', color: '#e67e22', icon: <img src = {calendarIcon}/>, bgColor: '#fef3c7' };
      case 'in-progress':
        return { text: 'В работе', color: '#c0392b', icon: <img src = {repairIcon}/>, bgColor: '#fee2e2', pulse: true };
      case 'completed':
        return { text: 'Завершено', color: '#27ae60', icon: <img src = {checkIcon}/>, bgColor: '#d1fae5' };
      default:
        return { text: 'Неизвестно', color: '#666', icon: '❓', bgColor: '#f3f4f6' };
    }
  };
  
const formatDateToYMD = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const filtered = outages.filter(o => {
    const matchesSearch = o.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesDate = !selectedDate || o.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

    const uniqueDates = [...new Set(outages.map(o => o.date))].sort();

  return (
<>
      <Header title="Плановые и аварийные отключения" />
    <ContainerComponent>
      
      <main className={styles.Main}>
              <section className={styles.HeroSection}>
          <div className={styles.HeroContent}>
            <h1 className={styles.HeroTitle}><img src ={outageIcon}/>Отключения</h1>
            <p className={styles.HeroSubtitle}>
              Отключения проводятся в целях ремонтных работ!  </p>
          </div>
          <div className={styles.HeroBadge}>
          </div>
        </section>
        <section className={styles.ControlPanel}>
          <div className={styles.SearchWrapper}>
            <span className={styles.SearchIcon}><img src = {SearchIcon}/></span>
            <input
              type="text"
              placeholder="Поиск по адресу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.SearchInput}
            />
            {search && (
              <button className={styles.ClearButton} onClick={() => setSearch('')}>
                ✕
              </button>
            )}
          </div>

          <div className={styles.Filters}>
            <select 
              className={styles.FilterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="planned">Плановые</option>
              <option value="in-progress">В работе</option>
              <option value="completed">Завершенные</option>
            </select>

            <select 
              className={styles.FilterSelect}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Все даты</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{formatDateToYMD(date)}</option>
              ))}
            </select>

            <div className={styles.ViewToggle}>
              <button 
                className={`${styles.ViewButton} ${viewMode === 'list' ? styles.Active : ''}`}
                onClick={() => setViewMode('list')}
              >
                <img src={listIcon}/> Список
              </button>
              <button 
                className={`${styles.ViewButton} ${viewMode === 'grid' ? styles.Active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <img src = {appsIcon}/> Сетка
              </button>
            </div>
          </div>
        </section>

        {/* Список отключений */}
        <section className={styles.OutagesSection}>
          {loading ? (
            <div className={styles.LoadingState}>
              <div className={styles.Spinner}></div>
              <p>Загрузка данных...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className={viewMode === 'list' ? styles.ListView : styles.GridView}>
              {filtered.map(outage => {
                const status = getStatus(outage.status);
                return (
                  <div 
                    key={outage.id} 
                    className={styles.OutageCard}
                    style={{ borderLeft: `4px solid ${status.color}` }}
                  >
                    <div className={styles.CardHeader}>
                      <div className={styles.AddressWrapper}>
                        <span className={styles.StatusIcon}>{status.icon}</span>
                        <h3 className={styles.Address}>{outage.address}</h3>
                      </div>
                      <div 
                        className={`${styles.StatusBadge} ${status.pulse ? styles.Pulse : ''}`}
                        style={{ backgroundColor: status.bgColor, color: status.color }}
                      >
                        {status.text}
                      </div>
                    </div>

                    <div className={styles.CardBody}>
                      <div className={styles.DateTimeBlock}>
                        <div className={styles.DateTimeItem}>
                          <span className={styles.Label}><img src ={calendarClockIcon}/> Дата:</span>
                          <span className={styles.Value}>{formatDateToYMD(outage.date)}</span>
                        </div>
                        <div className={styles.DateTimeItem}>
                          <span className={styles.Label}><img src = {clockIcon}/> Время:</span>
                          <span className={styles.Value}>{outage.time}</span>
                        </div>
                      </div>

                      <div className={styles.ReasonBlock}>
                        <span className={styles.Label}><img src = {padIcon}/> Причина:</span>
                        <p className={styles.Reason}>{outage.reason}</p>
                      </div>

                      {outage.status === 'in-progress' && (
                        <div className={styles.ProgressBar}>
                          <div className={styles.ProgressFill} style={{ width: '60%' }}></div>
                        </div>
                      )}
                    </div>

                    <div className={styles.CardFooter}>
                     
                      {outage.status === 'in-progress' && (
                        <span className={styles.LiveIndicator}>
                          <span className={styles.LiveDot}></span>
                          Обновляется
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.EmptyState}>
              <span className={styles.EmptyIcon}><img src= {SearchIcon}/></span>
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить параметры поиска или фильтры</p>
              <button 
                className={styles.ResetButton}
                onClick={() => {
                  setSearch('');
                  setFilterStatus('all');
                  setSelectedDate('');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </section>

        <section className={styles.InfoSection}>
          <div className={styles.InfoCard}>
            <span className={styles.InfoIcon}><img src ={phoneIcon}/></span>
            <div>
              <h4>Уточнить информацию?</h4>
              <p>Звоните в диспетчерскую: 8 (800) 123-45-67</p>
            </div>
          </div>
          <div className={styles.InfoCard}>
            <span className={styles.InfoIcon}><img src = {manIcon}/></span>
            <div>
              <h4>Плановые работы</h4>
              <p>Проводятся для профилактики и улучшения качества услуг</p>
            </div>
          </div>
        </section>
      </main>

    </ContainerComponent>

      <Footer />
    </>
  );
};

export default OutagesPage;
