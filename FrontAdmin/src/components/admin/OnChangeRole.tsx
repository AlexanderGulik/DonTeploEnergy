import React from 'react';
import styles from './AdminComponent.module.css';

interface FormErrors {
    role?: string;
    submit?: string;
}

interface OnRoleChangeProps {
    role: string;
    formErrors: FormErrors;
    isLoading: boolean;
    onRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

const OnRoleChangeModal: React.FC<OnRoleChangeProps> = ({
    role,
    formErrors,
    isLoading,
    onRoleChange,
    onSubmit,
    onClose
}) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>изменить роль</h2>
                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="role">роль</label>
                        <input
                            type="text"
                            id="role"
                            value={role}
                            onChange={onRoleChange}
                            className={`${styles.input} ${formErrors.role ? styles.inputError : ''}`}
                            placeholder="Введите роль"
                        />
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
                            {isLoading ? 'Обновление...' : 'Добавить'}
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

export default OnRoleChangeModal; 

