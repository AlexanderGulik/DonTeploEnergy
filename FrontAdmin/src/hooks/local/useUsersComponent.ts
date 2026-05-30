import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { useActions } from '../../hooks/useActions';
import { useUsers } from '../../hooks/useUsers';
import { fetchUsers, addUserBalance } from '../../store/users/users.slice';

interface FormErrors {
    balance?: string;
    submit?: string;
}

export const useUsersComponent = () => {
    const dispatch = useAppDispatch();
    const { setCurrentPageUsers, clearErrorUsers } = useActions();
    const { users, status, error, currentPage, totalPages } = useUsers();
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [balance, setBalance] = useState('');
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState('');

    useEffect(() => {
        if (searchId.trim()) {
            dispatch(fetchUsers({ page: currentPage, limit: 15, id: searchId.trim() }));
        } else {
            dispatch(fetchUsers({ page: currentPage, limit: 15 }));
        }
    }, [dispatch, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPageUsers(page);
    };

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (searchId.trim()) {
                await dispatch(fetchUsers({ page: 1, limit: 15, id: searchId.trim() })).unwrap();
                setCurrentPageUsers(1);
            } else {
                await dispatch(fetchUsers({ page: 1, limit: 15 })).unwrap();
                setCurrentPageUsers(1);
            }
        } catch (error) {
            console.error('Ошибка при поиске:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setSearchId(value);
    };

    const handleClearSearch = async () => {
        try {
            await dispatch(fetchUsers({ page: 1, limit: 15 })).unwrap();
            setSearchId('');
            setCurrentPageUsers(1);
        } catch (error) {
            console.error('Ошибка при очистке поиска:', error);
        }
    };

    const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*[,]?\d{0,2}$/;
        if (regex.test(value)) {
            setBalance(value);
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!balance) {
            errors.balance = 'Введите сумму';
            isValid = false;
        } else {
            const balanceValue = parseFloat(balance.replace(',', '.'));
            if (isNaN(balanceValue) || balanceValue <= 0) {
                errors.balance = 'Сумма должна быть положительным числом';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setFormErrors({});
            await dispatch(addUserBalance({
                id_user: selectedUser.toString(),
                newBalance: parseFloat(balance.replace(',', '.'))
            })).unwrap();
            setSelectedUser(null);
            setBalance('');
            if (searchId.trim()) {
                await dispatch(fetchUsers({ page: currentPage, limit: 15, id: searchId.trim() })).unwrap();
            } else {
                await dispatch(fetchUsers({ page: currentPage, limit: 15 })).unwrap();
            }
        } catch (err) {
            console.error('Ошибка при обновлении баланса:', err);
            if (err) {
                setFormErrors({ submit: `${err}` });
            } else {
                setFormErrors({ submit: 'Произошла ошибка при обновлении баланса' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setBalance('');
        setFormErrors({});
    };

    return {
        users,
        status,
        error,
        currentPage,
        totalPages,
        selectedUser,
        balance,
        formErrors,
        isLoading,
        searchId,
        handlePageChange,
        handleSearchSubmit,
        handleSearchChange,
        handleClearSearch,
        handleBalanceChange,
        handleSubmit,
        handleCloseModal,
        setSelectedUser,
        setBalance,
        setFormErrors,
        setIsLoading,
        setSearchId,
        clearErrorUsers,
    }
}
