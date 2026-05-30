// src/components/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { AdminService } from '../../API/AdminService';
import UsersIcon from '../UI/Icons/UsersIcon';
import FormsIcon from '../UI/Icons/FormsIcon';
import OutagesIcon from '../UI/Icons/OutagesIcon';
import TariffsIcon from '../UI/Icons/TariffsIcon';
import AdminIcon from '../UI/Icons/AdminIcon';
import Loader from '../UI/Loader/Loader';
import TopUsers from './TopUsers';
import AdminsStats from './AdminsStats';
import AdminsPerformance from './AdminsPerformance';
import { StatisticsData } from '../../types/dashboard.types';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AdminService.getStatistics();
      setStatistics(response);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
      setError('Не удалось загрузить статистику. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading && !statistics) {
    return <Loader />;
  }

  if (error && !statistics) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Статистика</h1>
        </div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Статистика сервиса</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.users}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Пользователи</h2>
            <div className={`${styles.statIconWrapper} ${styles.users}`}>
              <UsersIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.total_user || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.forms}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Всего заявок</h2>
            <div className={`${styles.statIconWrapper} ${styles.forms}`}>
              <FormsIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.total_forms || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.forms}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Активные заявки</h2>
            <div className={`${styles.statIconWrapper} ${styles.forms}`}>
              <FormsIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.active_forms || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.forms}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Завершенные заявки</h2>
            <div className={`${styles.statIconWrapper} ${styles.forms}`}>
              <FormsIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.completed_forms || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.outages}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Плановые отключения</h2>
            <div className={`${styles.statIconWrapper} ${styles.outages}`}>
              <OutagesIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.total_outages || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.tariffs}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Тарифы</h2>
            <div className={`${styles.statIconWrapper} ${styles.tariffs}`}>
              <TariffsIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.total_tariffs || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.admins}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Всего админов</h2>
            <div className={`${styles.statIconWrapper} ${styles.admins}`}>
              <AdminIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.total_admins || 0}</div>
        </div>

        <div className={`${styles.statCard} ${styles.admins}`}>
          <div className={styles.statHeader}>
            <h2 className={styles.statTitle}>Активных админов</h2>
            <div className={`${styles.statIconWrapper} ${styles.admins}`}>
              <AdminIcon />
            </div>
          </div>
          <div className={styles.statValue}>{statistics?.dataResults?.active_admins || 0}</div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <TopUsers users={statistics?.topUsers || []} />
        <AdminsStats admins={statistics?.adminStats || []} />
      </div>

      <div className={styles.statsRow}>
        <AdminsPerformance performance={statistics?.adminsPerformance || []} />
      </div>
    </div>
  );
};

export default Dashboard;
