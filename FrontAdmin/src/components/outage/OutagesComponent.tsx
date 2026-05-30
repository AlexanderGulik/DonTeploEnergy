import React, { useState, useEffect } from 'react';
import Loader from '../UI/Loader/Loader';
import styles from './OutageComponent.module.css';
import OutageTable from './OutageTable';
import OutageModal from './OutageModal';
import { OutageService } from '../../API/OutagesService';
import { OutageI, CreateOutageDto } from '../../types/outage.types';

const OutagesComponent: React.FC = () => {
    const [outages, setOutages] = useState<OutageI[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOutage, setSelectedOutage] = useState<OutageI | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOutages();
    }, []);

    const fetchOutages = async () => {
        setStatus('loading');
        try {
            const response = await OutageService.getAll();
            console.log('Outages response:', response);
            
            if (Array.isArray(response)) {
                setOutages(response);
            } else if (response.data && Array.isArray(response.data)) {
                setOutages(response.data);
            } else {
                setOutages([]);
            }
            
            setStatus('succeeded');
            setError(null);
        } catch (err) {
            setStatus('failed');
            setError(err instanceof Error ? err.message : 'Ошибка загрузки отключений');
            console.error('Error fetching outages:', err);
        }
    };

    const handleCreate = () => {
        setSelectedOutage(null);
        setIsModalOpen(true);
    };

    const handleEdit = (outage: OutageI) => {
        setSelectedOutage(outage);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить это отключение?')) {
            setIsLoading(true);
            try {
                await OutageService.delete(id);
                await fetchOutages();
            } catch (err) {
                console.error('Error deleting outage:', err);
                setError(err instanceof Error ? err.message : 'Ошибка при удалении отключения');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        setIsLoading(true);
        try {
            await OutageService.updateStatus(id, newStatus);
            await fetchOutages();
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err instanceof Error ? err.message : 'Ошибка при обновлении статуса');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: CreateOutageDto & { id?: number }) => {
        setIsLoading(true);
        try {
            if (data.id) {
                await OutageService.update(data as any);
            } else {
                await OutageService.create(data);
            }
            setIsModalOpen(false);
            await fetchOutages();
        } catch (err) {
            console.error('Error saving outage:', err);
            setError(err instanceof Error ? err.message : 'Ошибка при сохранении отключения');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOutage(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const filteredOutages = outages.filter(outage => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            outage.address.toLowerCase().includes(term) ||
            outage.reason.toLowerCase().includes(term)
        );
    });

    if (status === 'loading' && outages.length === 0) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление отключениями</h1>
                <button
                    onClick={handleCreate}
                    className={styles.createButton}
                >
                    Создать отключение
                </button>
            </div>

            <div className={styles.searchForm}>
                <div className={styles.searchInputGroup}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Поиск по адресу или причине..."
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
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

            <OutageTable
                outages={filteredOutages}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
            />

            <OutageModal
                isOpen={isModalOpen}
                outage={selectedOutage}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default OutagesComponent;
