import React from 'react';
import { OutageI, OutageStatusLabels, OutageStatusColors } from '../../types/outage.types';
import styles from './OutageComponent.module.css';

interface OutageTableProps {
    outages: OutageI[];
    isLoading: boolean;
    onEdit: (outage: OutageI) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: string) => void;
}

const OutageTable: React.FC<OutageTableProps> = ({ 
    outages, 
    isLoading, 
    onEdit, 
    onDelete, 
    onStatusChange 
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!outages || outages.length === 0) {
        return (
            <div className={styles.tableContainer}>
                <table className={styles.outagesTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Адрес</th>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Причина</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={7} className={styles.emptyMessage}>
                                {isLoading ? 'Загрузка...' : 'Отключения не найдены'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.outagesTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Адрес</th>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Причина</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {outages.map((outage) => (
                        <tr key={outage.id}>
                            <td>{outage.id}</td>
                            <td className={styles.addressCell}>{outage.address}</td>
                            <td className={styles.dateCell}>{formatDate(outage.date)}</td>
                            <td className={styles.timeCell}>{outage.time}</td>
                            <td className={styles.reasonCell}>{outage.reason}</td>
                            <td>
                                <span 
                                    className={styles.statusBadge}
                                    style={{ 
                                        backgroundColor: `${OutageStatusColors[outage.status]}20`,
                                        color: OutageStatusColors[outage.status]
                                    }}
                                >
                                    {OutageStatusLabels[outage.status]}
                                </span>
                            </td>
                            <td>
                                <div className={styles.actionButtons}>
                               
                                    <button
                                        onClick={() => onEdit(outage)}
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                        disabled={isLoading}
                                        title="Редактировать"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => onDelete(outage.id)}
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

export default OutageTable;
