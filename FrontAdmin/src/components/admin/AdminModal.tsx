import React, { useState, useEffect } from 'react';

import { AdminI } from '../../types/admin.types';
import styles from './AdminComponent.module.css';

import EyeOpenIcon from '../UI/Icons/EyeOpenIcon';
import EyeClosedIcon from '../UI/Icons/EyeClosedIcon';

interface FormData {
    fio: string;
    name: string;
    password: string;
    role: string;
}

interface FormErrors {
    fio?: string;
    name?: string;
    password?: string;
    role?: string;
    submit?: string;
}

interface AdminModalProps {
    isOpen: boolean;
    admin: AdminI | null;
    formData: FormData;
    formErrors: FormErrors;
    isLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    admin,
    formData,
    formErrors,
    isLoading,
    onInputChange,
    onSubmit,
    onClose
}) => {
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setShowPassword(false);
    }, [isOpen, admin]);

    if (!isOpen) return null;

    const roleOptions = [
        { value: 'admin', label: 'Администратор' },
        { value: 'moderator', label: 'Модератор' }
    ];

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2>{admin ? 'Редактировать администратора' : 'Создать администратора'}</h2>
                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="fio">ФИО</label>
                        <input
                            type="text"
                            id="fio"
                            name="fio"
                            value={formData.fio}
                            onChange={onInputChange}
                            className={`${styles.input} ${formErrors.fio ? styles.inputError : ''}`}
                            placeholder="Введите ФИО"
                            required
                        />
                        {formErrors.fio && (
                            <span className={styles.errorMessage}>{formErrors.fio}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Логин</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                            placeholder="Введите логин"
                            required
                        />
                        {formErrors.name && (
                            <span className={styles.errorMessage}>{formErrors.name}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">
                            {admin ? 'Новый пароль (оставьте пустым, если не хотите менять)' : 'Пароль'}
                        </label>
                        <div className={styles.passwordInputGroup}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onInputChange}
                                className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
                                placeholder={admin ? 'Введите новый пароль' : 'Введите пароль'}
                                required={!admin}
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                            >
                                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <span className={styles.errorMessage}>{formErrors.password}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="role">Роль</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={onInputChange}
                            className={`${styles.select} ${formErrors.role ? styles.inputError : ''}`}
                            required
                        >
                            <option value="">Выберите роль</option>
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {formErrors.role && (
                            <span className={styles.errorMessage}>{formErrors.role}</span>
                        )}
                    </div>

                    {formErrors.submit && (
                        <div className={styles.formError}>{formErrors.submit}</div>
                    )}

                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : admin ? 'Сохранить' : 'Создать'}
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

export default AdminModal;
