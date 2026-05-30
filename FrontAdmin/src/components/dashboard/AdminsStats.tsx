// src/components/Dashboard/AdminsStats.tsx
import React from 'react';
import styles from './Dashboard.module.css';
import { AdminStat } from '../../types/dashboard.types';

interface AdminsStatsProps {
  admins: AdminStat[];
}

const AdminsStats: React.FC<AdminsStatsProps> = ({ admins }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Текущая загрузка администраторов</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Обработано заявок</th>
              <th>В работе</th>
              <th>Последняя активность</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id_admin}>
                <td>{admin.fio}</td>
                <td>@{admin.login}</td>
                <td>{admin.roles === 'admin' ? 'Администратор' : 'Модератор'}</td>
                <td>{admin.processed_forms}</td>
                <td>{admin.active_forms}</td>
                <td>{admin.last_activity || 'Нет данных'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsStats;
