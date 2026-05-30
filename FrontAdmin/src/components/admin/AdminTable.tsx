import React from 'react';
import { AdminI } from '../../types/admin.types';
import styles from './AdminComponent.module.css';

interface AdminTableProps {
  admins: AdminI[]; 
  isLoading: boolean;
  onEdit: (admin: AdminI) => void;
  onDelete: (id: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ admins, isLoading, onEdit, onDelete }) => {
  if (!admins || admins.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.adminsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className={styles.emptyMessage}>
                {isLoading ? 'Загрузка...' : 'Администраторы не найдены'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.adminsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Логин</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id_admin}>
              <td>{admin.id_admin}</td>
              <td>{admin.fio}</td>
              <td>{admin.name}</td>
              <td>
                <span className={`${styles.roleBadge} ${styles[admin.role]}`}>
                  {admin.role}
                </span>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => onEdit(admin)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                    disabled={isLoading}
                    title="Редактировать"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDelete(String(admin.id_admin))}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    disabled={isLoading}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
