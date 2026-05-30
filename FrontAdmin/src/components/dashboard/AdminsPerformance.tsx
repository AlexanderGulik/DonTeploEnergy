// src/components/Dashboard/AdminsPerformance.tsx
import React from 'react';
import styles from './Dashboard.module.css';
import { AdminPerformance } from '../../types/dashboard.types';

interface AdminsPerformanceProps {
  performance: AdminPerformance[];
}

const AdminsPerformance: React.FC<AdminsPerformanceProps> = ({ performance }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Производительность администраторов</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Всего обработано</th>
              <th>Завершено</th>
              <th>В ожидании</th>
              <th>Активность за месяц</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((admin) => (
              <tr key={admin.id_admin}>
                <td>{admin.fio}</td>
                <td>@{admin.login}</td>
                <td>{admin.total_processed}</td>
                <td>{admin.completed}</td>
                <td>{admin.pending}</td>
                <td>{admin.last_month_activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsPerformance;
