import React, { useState, useEffect } from 'react';
import { OutageI, CreateOutageDto, OutageStatus, OutageStatusLabels } from '../../types/outage.types';
import styles from './OutageComponent.module.css';

interface OutageModalProps {
    isOpen: boolean;
    outage: OutageI | null;
    isLoading: boolean;
    onSubmit: (data: CreateOutageDto & { id?: number }) => void;
    onClose: () => void;
}

const OutageModal: React.FC<OutageModalProps> = ({
    isOpen,
    outage,
    isLoading,
    onSubmit,
    onClose
}) => {
    const [formData, setFormData] = useState<CreateOutageDto>({
        address: '',
        date: '',
        time: '',
        reason: '',
        status: 'planned'
    });

    useEffect(() => {
        if (outage) {
            const date = new Date(outage.date);
            const formattedDate = date.toISOString().split('T')[0];
            
            setFormData({
                address: outage.address,
                date: formattedDate,
                time: outage.time,
                reason: outage.reason,
                status: outage.status
            });
        } else {
            setFormData({
                address: '',
                date: '',
                time: '',
                reason: '',
                status: 'planned'
            });
        }
    }, [outage]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...formData,
            date: new Date(formData.date).toISOString()
        };
        
        if (outage) {
            onSubmit({ ...submitData, id: outage.id });
        } else {
            onSubmit(submitData);
        }
    };

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2>{outage ? 'Редактировать отключение' : 'Создать отключение'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Адрес</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className={styles.input}
                            required
                            placeholder="ул. Университетская, 10-15"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Дата</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Время</label>
                            <input
                                type="text"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className={styles.input}
                                required
                                placeholder="08:00-20:00"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Причина</label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className={styles.textarea}
                            required
                            placeholder="Причина отключения"
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Статус</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as OutageStatus })}
                            className={styles.select}
                            required
                        >
                            <option value="planned">Запланировано</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : outage ? 'Сохранить' : 'Создать'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OutageModal;
