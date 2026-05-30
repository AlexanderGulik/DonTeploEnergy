import React, { useState, useEffect } from 'react';
import Loader from '../UI/Loader/Loader';
import styles from './FormComponent.module.css';
import FormTable from './FormTable';
import FormChat from './FormChat';
import FormNavigation, { ViewMode } from './FormNavigation';
import { FormService } from '../../API/FormService';
import { FormI, FormStatus, FormStatusLabels, FormStatusColors } from '../../types/form.types';
import { useUser } from '../../hooks/useUser';

const FormsComponent: React.FC = () => {
    const [forms, setForms] = useState<FormI[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [formType, setFormType] = useState<string>('emergency');
    const [viewMode, setViewMode] = useState<ViewMode>('active');
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [activeFormsCount, setActiveFormsCount] = useState<number>(0);
    const [archiveFormsCount, setArchiveFormsCount] = useState<number>(0);
    
    const [selectedForm, setSelectedForm] = useState<FormI | null>(null);
    const [showChatModal, setShowChatModal] = useState(false);
    
    const userData = useUser();
    const currentAdminId = userData.adminId || 0;


    const limit = 10;

    useEffect(() => {
        if (currentAdminId) {
            fetchForms();
            fetchCounts();
        }
    }, [currentPage, formType, viewMode, currentAdminId]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!currentAdminId) return;
            try {
                const response = await FormService.getUnreadCount(currentAdminId);
                setUnreadCount(response.count || 0);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        if (currentAdminId) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [currentAdminId]);

    const fetchCounts = async () => {
        if (!currentAdminId) return;
        try {
            const activeResponse = await FormService.getAll(1, 1, formType, ['pending', 'active']);
            setActiveFormsCount(activeResponse.pagination?.total || 0);

            const archiveResponse = await FormService.getAll(1, 1, formType, ['completed']);
            setArchiveFormsCount(archiveResponse.pagination?.total || 0);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    const fetchForms = async () => {
        if (!currentAdminId) return;
        setStatus('loading');
        try {
            let statuses: FormStatus[] = [];
            
            switch (viewMode) {
                case 'active':
                    statuses = ['pending', 'active'];
                    break;
                case 'archive':
                    statuses = ['completed'];
                    break;
            }

            const response = await FormService.getAll(currentPage, limit, formType, statuses);
            
            let newForms: FormI[] = [];
            if (Array.isArray(response)) {
                newForms = response;
                setTotalPages(1);
            } else if (response.data && Array.isArray(response.data)) {
                newForms = response.data;
                setTotalPages(response.pagination?.pages || 1);
            }
            
            newForms.forEach(form => {
                console.log(`Form ${form.ID_form}:`, {
                    id_admin: form.ID_admin,
                    status: form.Status,
                    isCurrentAdmin: form.ID_admin.Valid && form.ID_admin.Int64 === currentAdminId
                });
            });
            
            setForms(newForms);
            setStatus('succeeded');
            setError(null);
        } catch (err) {
            setStatus('failed');
            setError(err instanceof Error ? err.message : 'Ошибка загрузки форм');
            console.error('Error fetching forms:', err);
        }
    };

const handleTakeForm = async (formId: number) => {
    setIsLoading(true);
    try {
        await FormService.takeForm({
            id_form: formId,
            name_form: formType
        });
        
        const formToUpdate = forms.find(f => f.ID_form === formId);
        if (formToUpdate) {
            const updatedForm = {
                ...formToUpdate,
                Status: 'active' as FormStatus,
                ID_admin: {
                    Valid: true,
                    Int64: currentAdminId
                }
            };
            setSelectedForm(updatedForm);
            setShowChatModal(true);
        }
        
        await fetchForms();
        await fetchCounts();
        
    } catch (err) {
        console.error('Error taking form:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при взятии формы');
    } finally {
        setIsLoading(false);
    }
};  

const handleCompleteForm = async (formId: number) => {
    setIsLoading(true);
    try {
       
        await FormService.updateStatus({
             formId: formId,
             formType: formType,
             status: 'completed',
             adminId: currentAdminId
         });
        
        await fetchForms();
        await fetchCounts();
        setShowChatModal(false);
        setSelectedForm(null);
    } catch (err) {
        console.error('Error completing form:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при завершении формы');
    } finally {
        setIsLoading(false);
    }
};

    const handleCancelForm = async (formId: number) => {
        console.log('Cancelling form:', formId);
        if (window.confirm('Вы уверены, что хотите отменить обработку формы?')) {
            setIsLoading(true);
            try {
                await FormService.updateStatus({
                    formId,
                    formType: formType,
                    status: 'cancelled',
                    adminId: currentAdminId
                });
                await fetchForms();
                await fetchCounts();
                setShowChatModal(false);
                setSelectedForm(null);
            } catch (err) {
                console.error('Error canceling form:', err);
                setError(err instanceof Error ? err.message : 'Ошибка при отмене формы');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleOpenChat = (form: FormI) => {
        setSelectedForm(form);
        setShowChatModal(true);
    };

    const handleCloseChat = () => {
        setShowChatModal(false);
        setSelectedForm(null);
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        setCurrentPage(1);
        setShowChatModal(false);
        setSelectedForm(null);
    };

    const filteredForms = forms.filter(form => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            form.FIO.toLowerCase().includes(term) ||
            form.Address.toLowerCase().includes(term) ||
            form.Phone.includes(term)
        );
    });

    if (!currentAdminId) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
                <p>Загрузка данных пользователя... ID администратора: {currentAdminId}</p>
            </div>
        );
    }

    if (status === 'loading' && forms.length === 0) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Обработка форм
                    {unreadCount > 0 && (
                        <span className={styles.unreadBadge}>
                            {unreadCount} новых
                        </span>
                    )}
                </h1>
                <div className={styles.formTypeSelector}>
                    <label htmlFor="formType">Тип формы:</label>
                    <select
                        id="formType"
                        value={formType}
                        onChange={(e) => {
                            setFormType(e.target.value);
                            setCurrentPage(1);
                            fetchCounts();
                        }}
                        className={styles.select}
                    >
                        <option value="emergency">Аварийные</option>
                        <option value="noheating">Отопление</option>
                        <option value="nowatter">Водоснабжение</option>
                    </select>
                </div>
            </div>

            <FormNavigation
                currentMode={viewMode}
                onModeChange={handleViewModeChange}
                activeCount={activeFormsCount}
                archiveCount={archiveFormsCount}
            />

            <div className={styles.searchForm}>
                <div className={styles.searchInputGroup}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Поиск по ФИО, адресу или телефону..."
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className={styles.clearButton}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                    <button onClick={() => setError(null)} className={styles.errorClose}>
                        ×
                    </button>
                </div>
            )}

            <FormTable
                forms={filteredForms}
                isLoading={isLoading}
                currentAdminId={currentAdminId}
                onTakeForm={handleTakeForm}
                onCompleteForm={handleCompleteForm}
                onCancelForm={handleCancelForm}
                onOpenChat={handleOpenChat}
                viewMode={viewMode}
            />

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || status === 'loading'}
                        className={styles.pageButton}
                    >
                        ←
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                                    disabled={status === 'loading'}
                                >
                                    {page}
                                </button>
                            );
                        } else if (
                            page === currentPage - 3 ||
                            page === currentPage + 3
                        ) {
                            return <span key={page} className={styles.ellipsis}>...</span>;
                        }
                        return null;
                    })}
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || status === 'loading'}
                        className={styles.pageButton}
                    >
                        →
                    </button>
                </div>
            )}

            {showChatModal && selectedForm && (
                <div className={styles.chatModal} onClick={handleCloseChat}>
                    <div className={styles.chatModalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModalButton} onClick={handleCloseChat}>×</button>
                        
                        <div className={styles.userInfo}>
                            <h2>Информация о заявителе</h2>
                            <div className={styles.userInfoGrid}>
                                <div className={styles.userInfoRow}>
                                    <span className={styles.userInfoLabel}>ФИО:</span>
                                    <span className={styles.userInfoValue}>{selectedForm.FIO}</span>
                                </div>
                                <div className={styles.userInfoRow}>
                                    <span className={styles.userInfoLabel}>Адрес:</span>
                                    <span className={styles.userInfoValue}>{selectedForm.Address}</span>
                                </div>
                                <div className={styles.userInfoRow}>
                                    <span className={styles.userInfoLabel}>Телефон:</span>
                                    <span className={styles.userInfoValue}>{selectedForm.Phone}</span>
                                </div>
                                <div className={styles.userInfoRow}>
                                    <span className={styles.userInfoLabel}>Дата заявки:</span>
                                    <span className={styles.userInfoValue}>
                                        {new Date(selectedForm.Data).toLocaleString('ru-RU')}
                                    </span>
                                </div>
                                <div className={styles.userInfoRow}>
                                    <span className={styles.userInfoLabel}>Статус:</span>
                                    <span 
                                        className={styles.statusBadge}
                                        style={{ 
                                            backgroundColor: `${FormStatusColors[selectedForm.Status]}20`,
                                            color: FormStatusColors[selectedForm.Status]
                                        }}
                                    >
                                        {FormStatusLabels[selectedForm.Status]}
                                    </span>
                                </div>
                                <div className={styles.userInfoRow}>
                                    <span className={styles.userInfoLabel}>Оператор:</span>
                                    <span className={styles.userInfoValue}>
                                        {selectedForm.ID_admin.Valid ? `ID: ${selectedForm.ID_admin.Int64}` : 'Не назначен'}
                                        {selectedForm.ID_admin.Valid && selectedForm.ID_admin.Int64 === currentAdminId && 
                                            ' (вы)'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <FormChat 
                            form={selectedForm} 
                            onMessageSent={() => {}}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormsComponent;
