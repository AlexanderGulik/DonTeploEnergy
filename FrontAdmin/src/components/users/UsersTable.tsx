import React from 'react';
import { UserI } from '../../types/user.types';
import styles from './UsersComponent.module.css';

interface UserTableProps {
  users: UserI[]; 
  isLoading: boolean;
  onToggleActive: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onToggleActive }) => {
  const getFullName = (user: UserI) => {
    const lastName = user.lastname || '';
    return `${lastName} ${user.firstname}`.trim();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (!users || users.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Район</th>
              <th>Адрес</th>
              <th>Статус</th>
              <th>Последний вход</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} className={styles.emptyMessage}>
                {isLoading ? 'Загрузка...' : 'Пользователи не найдены'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Район</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th>Последний вход</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user} className={!user.is_active ? styles.inactiveRow : ''}>
              <td>{user.id_user}</td>
              <td>{getFullName(user)}</td>
              <td>{user.email}</td>
              <td>{user.phone || '—'}</td>
              <td>{user.district}</td>
              <td>{user.address || '—'}</td>
              <td>
                <span className={`${styles.statusBadge} ${user.is_active ? styles.active : styles.inactive}`}>
                  {user.is_active ? 'Активен' : 'Неактивен'}
                </span>
              </td>
              <td>{formatDate(user.last_login)}</td>
              <td>
                <button 
                  onClick={() => onToggleActive(String(user.id_user))}
                  className={`${styles.actionButton} ${user.is_active ? styles.deactivateButton : styles.activateButton}`}
                  disabled={isLoading}
                >
                  {user.is_active ? 'Деактивировать' : 'Активировать'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
