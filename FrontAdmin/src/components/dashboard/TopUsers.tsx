// src/components/Dashboard/TopUsers.tsx
import React from 'react';
import styles from './Dashboard.module.css';
import { TopUser } from '../../types/dashboard.types';

interface TopUsersProps {
  users: TopUser[];
}

const TopUsers: React.FC<TopUsersProps> = ({ users }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Топ пользователей по заявкам</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Заявок</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_user}>
                <td>{`${user.firstname} ${user.lastname}`}</td>
                <td>{user.email}</td>
                <td>{user.total_forms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopUsers;
