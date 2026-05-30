import React, { useState, useEffect } from 'react';
import { TariffI, CreateTariffDto } from '../../types/tariff.types';
import styles from './TariffComponent.module.css';

interface TariffModalProps {
    isOpen: boolean;
    tariff: TariffI | null;
    isLoading: boolean;
    onSubmit: (data: CreateTariffDto & { id?: number }) => void;
    onClose: () => void;
}

const TariffModal: React.FC<TariffModalProps> = ({
    isOpen,
    tariff,
    isLoading,
    onSubmit,
    onClose
}) => {
    const [formData, setFormData] = useState<CreateTariffDto>({
        period: '',
        basis: '',
        population: [''],
        budget: [''],
        isCurrent: false
    });

    useEffect(() => {
        if (tariff) {
            setFormData({
                period: tariff.period,
                basis: tariff.basis,
                population: tariff.population,
                budget: tariff.budget,
                isCurrent: tariff.isCurrent
            });
        } else {
            setFormData({
                period: '',
                basis: '',
                population: [''],
                budget: [''],
                isCurrent: false
            });
        }
    }, [tariff]);

    if (!isOpen) return null;

    const handlePopulationChange = (index: number, value: string) => {
        const newPopulation = [...formData.population];
        newPopulation[index] = value;
        setFormData({ ...formData, population: newPopulation });
    };

    const handleBudgetChange = (index: number, value: string) => {
        const newBudget = [...formData.budget];
        newBudget[index] = value;
        setFormData({ ...formData, budget: newBudget });
    };

    const addPopulationField = () => {
        setFormData({ ...formData, population: [...formData.population, ''] });
    };

    const addBudgetField = () => {
        setFormData({ ...formData, budget: [...formData.budget, ''] });
    };

    const removePopulationField = (index: number) => {
        if (formData.population.length > 1) {
            const newPopulation = formData.population.filter((_, i) => i !== index);
            setFormData({ ...formData, population: newPopulation });
        }
    };

    const removeBudgetField = (index: number) => {
        if (formData.budget.length > 1) {
            const newBudget = formData.budget.filter((_, i) => i !== index);
            setFormData({ ...formData, budget: newBudget });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Фильтруем пустые строки
        const submitData = {
            ...formData,
            population: formData.population.filter(p => p.trim() !== ''),
            budget: formData.budget.filter(b => b.trim() !== '')
        };
        
        if (tariff) {
            onSubmit({ ...submitData, id: tariff.id });
        } else {
            onSubmit(submitData);
        }
    };

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2>{tariff ? 'Редактировать тариф' : 'Создать тариф'}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Период</label>
                        <input
                            type="text"
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className={styles.input}
                            required
                            placeholder="Например: С 1 июля 2025 г."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Основание</label>
                        <input
                            type="text"
                            value={formData.basis}
                            onChange={(e) => setFormData({ ...formData, basis: e.target.value })}
                            className={styles.input}
                            required
                            placeholder="Постановление РСТ ДНР от ..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Тарифы для населения</label>
                        {formData.population.map((item, index) => (
                            <div key={index} className={styles.arrayField}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handlePopulationChange(index, e.target.value)}
                                    className={styles.input}
                                    placeholder="Введите тариф"
                                />
                                <div className={styles.arrayButtons}>
                                    {index === formData.population.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addPopulationField}
                                            className={styles.addButton}
                                            title="Добавить"
                                        >
                                            +
                                        </button>
                                    )}
                                    {formData.population.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePopulationField(index)}
                                            className={styles.removeButton}
                                            title="Удалить"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Тарифы для бюджета</label>
                        {formData.budget.map((item, index) => (
                            <div key={index} className={styles.arrayField}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleBudgetChange(index, e.target.value)}
                                    className={styles.input}
                                    placeholder="Введите тариф"
                                />
                                <div className={styles.arrayButtons}>
                                    {index === formData.budget.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addBudgetField}
                                            className={styles.addButton}
                                            title="Добавить"
                                        >
                                            +
                                        </button>
                                    )}
                                    {formData.budget.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBudgetField(index)}
                                            className={styles.removeButton}
                                            title="Удалить"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                  

                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : tariff ? 'Сохранить' : 'Создать'}
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

export default TariffModal;
