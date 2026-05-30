import React, { useState, useEffect } from 'react';
import Loader from '../UI/Loader/Loader';
import styles from './TariffComponent.module.css';
import TariffTable from './TariffTable';
import TariffModal from './TariffModal';
import { TariffService } from '../../API/TariffService';
import { TariffI, CreateTariffDto } from '../../types/tariff.types';

const TariffsComponent: React.FC = () => {
    const [tariffs, setTariffs] = useState<TariffI[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTariff, setSelectedTariff] = useState<TariffI | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTariffs();
    }, []);

    const fetchTariffs = async () => {
        setStatus('loading');
        try {
            const response = await TariffService.getAll();
            console.log('Tariffs response:', response);
            
            if (Array.isArray(response)) {
                setTariffs(response);
            } else if (response.data && Array.isArray(response.data)) {
                setTariffs(response.data);
            } else {
                setTariffs([]);
            }
            
            setStatus('succeeded');
            setError(null);
        } catch (err) {
            setStatus('failed');
            setError(err instanceof Error ? err.message : 'Ошибка загрузки тарифов');
            console.error('Error fetching tariffs:', err);
        }
    };

    const handleCreate = () => {
        setSelectedTariff(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tariff: TariffI) => {
        setSelectedTariff(tariff);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тариф?')) {
            setIsLoading(true);
            try {
                await TariffService.delete(id);
                await fetchTariffs();
            } catch (err) {
                console.error('Error deleting tariff:', err);
                setError(err instanceof Error ? err.message : 'Ошибка при удалении тарифа');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSetCurrent = async (id: number) => {
        setIsLoading(true);
        try {
            await TariffService.setCurrent(id);
            await fetchTariffs();
        } catch (err) {
            console.error('Error setting current tariff:', err);
            setError(err instanceof Error ? err.message : 'Ошибка при установке текущего тарифа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: CreateTariffDto & { id?: number }) => {
        setIsLoading(true);
        try {
            if (data.id) {
                // Обновление
                await TariffService.update(data as any);
            } else {
                // Создание
                await TariffService.create(data);
            }
            setIsModalOpen(false);
            await fetchTariffs();
        } catch (err) {
            console.error('Error saving tariff:', err);
            setError(err instanceof Error ? err.message : 'Ошибка при сохранении тарифа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTariff(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Фильтрация тарифов
    const filteredTariffs = tariffs.filter(tariff => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            tariff.period.toLowerCase().includes(term) ||
            tariff.basis.toLowerCase().includes(term)
        );
    });

    if (status === 'loading' && tariffs.length === 0) {
        return (
            <div className={styles.loadingContainer}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление тарифами</h1>
                <button
                    onClick={handleCreate}
                    className={styles.createButton}
                >
                    Создать тариф
                </button>
            </div>

            <div className={styles.searchForm}>
                <div className={styles.searchInputGroup}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Поиск по периоду или основанию..."
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

            <TariffTable
                tariffs={filteredTariffs}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetCurrent={handleSetCurrent}
            />

            <TariffModal
                isOpen={isModalOpen}
                tariff={selectedTariff}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default TariffsComponent;
