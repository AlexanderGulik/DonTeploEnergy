import React from 'react';
import { TariffI } from '../../types/tariff.types';
import styles from './TariffComponent.module.css';

interface TariffTableProps {
    tariffs: TariffI[];
    isLoading: boolean;
    onEdit: (tariff: TariffI) => void;
    onDelete: (id: number) => void;
    onSetCurrent: (id: number) => void;
}

const TariffTable: React.FC<TariffTableProps> = ({ 
    tariffs, 
    isLoading, 
    onEdit, 
    onDelete, 
    onSetCurrent 
}) => {
    if (!tariffs || tariffs.length === 0) {
        return (
            <div className={styles.tableContainer}>
                <table className={styles.adminsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Период</th>
                            <th>Статус</th>
                            <th>Основание</th>
                            <th>Тарифы для населения</th>
                            <th>Тарифы для бюджета</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={7} className={styles.emptyMessage}>
                                {isLoading ? 'Загрузка...' : 'Тарифы не найдены'}
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
                        <th>Период</th>
                        <th>Статус</th>
                        <th>Основание</th>
                        <th>Тарифы для населения</th>
                        <th>Тарифы для бюджета</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {tariffs.map((tariff) => (
                        <tr key={tariff.id} className={tariff.isCurrent ? styles.currentRow : ''}>
                            <td>{tariff.id}</td>
                            <td className={styles.periodCell}>{tariff.period}</td>
                            <td>
                                <span className={`${styles.statusBadge} ${tariff.isCurrent ? styles.current : styles.notCurrent}`}>
                                    {tariff.isCurrent ? 'Текущий' : 'Архивный'}
                                </span>
                            </td>
                            <td className={styles.basisCell}>{tariff.basis}</td>
                            <td>
                                <ul className={styles.tariffList}>
                                    {tariff.population.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul className={styles.tariffList}>
                                    {tariff.budget.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <div className={styles.actionButtons}>
                               
                                    <button
                                        onClick={() => onEdit(tariff)}
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                        disabled={isLoading}
                                        title="Редактировать"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => onDelete(tariff.id)}
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

export default TariffTable;
