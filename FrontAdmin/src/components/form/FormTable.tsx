import React from 'react';
import { FormI, FormStatusLabels, FormStatusColors } from '../../types/form.types';
import styles from './FormComponent.module.css';
import { ViewMode } from './FormNavigation';

interface FormTableProps {
    forms: FormI[];
    isLoading: boolean;
    currentAdminId: number;
    onTakeForm: (formId: number) => void;
    onCompleteForm: (formId: number) => void;
    onCancelForm: (formId: number) => void;
    onOpenChat: (form: FormI) => void;
    viewMode: ViewMode;
}

const FormTable: React.FC<FormTableProps> = ({ 
    forms, 
    isLoading, 
    currentAdminId,
    onTakeForm, 
    onCompleteForm, 
    onCancelForm,
    onOpenChat,
    viewMode
}) => {
    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isTakenByCurrentAdmin = (form: FormI) => {
        const result = form.ID_admin.Valid && form.ID_admin.Int64 === currentAdminId;
        console.log(`Form ${form.ID_form}: ID_admin.Valid=${form.ID_admin.Valid}, ID_admin.Int64=${form.ID_admin.Int64}, currentAdminId=${currentAdminId}, result=${result}`);
        return result;
    };

    const isTakenByOtherAdmin = (form: FormI) => {
        const result = form.ID_admin.Valid && form.ID_admin.Int64 !== currentAdminId;
        console.log(`Form ${form.ID_form}: isTakenByOtherAdmin=${result}`);
        return result;
    };

    const getActionButtons = (form: FormI) => {
        console.log(`Rendering actions for form ${form.ID_form}:`, {
            status: form.Status,
            id_admin: form.ID_admin,
            currentAdminId,
            viewMode
        });

        if (viewMode === 'archive') {
            if (isTakenByCurrentAdmin(form)) {
                return (
                    <button
                        onClick={() => onOpenChat(form)}
                        className={`${styles.actionButton} ${styles.chatButton}`}
                        disabled={isLoading}
                        title="Просмотр переписки"
                    >
                        Чат
                    </button>
                );
            }
            return <span className={styles.noActions}>—</span>;
        }

        if (form.Status === 'pending') {
            return (
                <button
                    onClick={() => onTakeForm(form.ID_form)}
                    className={`${styles.actionButton} ${styles.takeButton}`}
                    disabled={isLoading}
                    title="Взять в работу"
                >
                    Взять
                </button>
            );
        }

        if (isTakenByCurrentAdmin(form)) {
            console.log(`Form ${form.ID_form} is taken by current admin, showing full controls`);
            return (
                <div className={styles.actionButtons}>
                    <button
                        onClick={() => onOpenChat(form)}
                        className={`${styles.actionButton} ${styles.chatButton}`}
                        disabled={isLoading}
                        title="Открыть чат"
                    >
                        Чат
                    </button>
                    
                    {form.Status === 'active' && (
                        <button
                            onClick={() => onCompleteForm(form.ID_form)}
                            className={`${styles.actionButton} ${styles.completeButton}`}
                            disabled={isLoading}
                            title="Завершить обработку"
                        >
                            Завершить
                        </button>
                    )}
                    
                    <button
                        onClick={() => onCancelForm(form.ID_form)}
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        disabled={isLoading}
                        title="Отменить и вернуть в ожидание"
                    >
                        Отменить
                    </button>
                </div>
            );
        }

        if (isTakenByOtherAdmin(form)) {
            console.log(`Form ${form.ID_form} is taken by other admin`);
            return <span className={styles.takenByOther}>Взято другим</span>;
        }

        console.log(`Form ${form.ID_form}: no matching condition`);
        return null;
    };

    if (!forms || forms.length === 0) {
        return (
            <div className={styles.tableContainer}>
                <table className={styles.formsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ФИО</th>
                            <th>Телефон</th>
                            <th>Дата</th>
                            <th>Статус</th>
                            <th>Оператор</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={8} className={styles.emptyMessage}>
                                {isLoading ? 'Загрузка...' : 
                                 viewMode === 'active' ? 'Нет активных заявок' : 'Архив пуст'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.formsTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Телефон</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>Оператор</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form) => {
                        console.log(`Rendering row for form ${form.ID_form}:`, {
                            id_admin: form.ID_admin,
                            currentAdminId,
                            isTakenByCurrent: isTakenByCurrentAdmin(form),
                            isTakenByOther: isTakenByOtherAdmin(form)
                        });
                        
                        return (
                            <tr 
                                key={form.ID_form} 
                                className={`
                                    ${isTakenByCurrentAdmin(form) ? styles.myForm : ''}
                                    ${isTakenByOtherAdmin(form) ? styles.otherAdminForm : ''}
                                    ${viewMode === 'archive' ? styles.archiveRow : ''}
                                    ${form.Status === 'pending' ? styles.pendingRow : ''}
                                `}
                            >
                                <td>{form.ID_form}</td>
                                <td className={styles.fioCell}>{form.FIO}</td>
                                <td className={styles.phoneCell}>{form.Phone}</td>
                                <td className={styles.dateCell}>{formatDateTime(form.Data)}</td>
                                <td>
                                    <span 
                                        className={styles.statusBadge}
                                        style={{ 
                                            backgroundColor: `${FormStatusColors[form.Status]}20`,
                                            color: FormStatusColors[form.Status]
                                        }}
                                    >
                                        {FormStatusLabels[form.Status]}
                                    </span>
                                </td>
                                <td>
                                    {form.ID_admin.Valid ? (
                                        <span className={styles.adminBadge}>
                                            ID: {form.ID_admin.Int64}
                                            {form.ID_admin.Int64 === currentAdminId && 
                                                <span className={styles.currentAdminBadge}>(вы)</span>
                                            }
                                        </span>
                                    ) : (
                                        <span className={styles.noAdmin}>—</span>
                                    )}
                                </td>
                                <td>
                                    {getActionButtons(form)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default FormTable;
