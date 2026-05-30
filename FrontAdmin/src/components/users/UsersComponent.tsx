import React from 'react';
import { useUsersComponent } from '../../hooks/local/useUsersComponent';
import UserTable from './UsersTable';
import SearchForm from './SearchForm';
import Loader from '../UI/Loader/Loader';
import styles from './UsersComponent.module.css';

const UsersComponent: React.FC = () => {
    const {
        users,
        status,
        error,
        currentPage,
        totalPages,
        formErrors,
        isLoading,
        searchId,
        searchByEmail,
        handlePageChange,
        handleSearchChange,
        handleSearchSubmit,
        handleClearSearch,
        handleSearchTypeChange,
        handleToggleActive,
        clearErrorUsers,
    } = useUsersComponent();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Управление пользователями</h1>

            <SearchForm
                searchId={searchId}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={handleClearSearch}
            />

            {error && (
                <div className={styles.error}>
                    {error}
                    <button onClick={clearErrorUsers} className={styles.errorClose}>
                        ×
                    </button>
                </div>
            )}

            {formErrors.submit && (
                <div className={styles.error}>
                    {formErrors.submit}
                </div>
            )}

            {status === 'loading' ? (
                <div className={styles.loadingContainer}>
                    <Loader />
                </div>
            ) : (
                <UserTable
                    users={users}
                    isLoading={isLoading}
                    onToggleActive={handleToggleActive}
                />
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                            disabled={status === 'loading'}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UsersComponent;
