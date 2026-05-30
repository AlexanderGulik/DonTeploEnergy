import React from 'react';
import Loader from '../UI/Loader/Loader';
import styles from './AdminComponent.module.css';
import AdminTable from './AdminTable';
import SearchForm from './SearchForm';
import AdminModal from './AdminModal';
import { useAdminsComponent } from '../../hooks/local/useAdminsComponent';



const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
    
    if (formErrors[name as keyof FormErrors]) {
        setFormErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    }
};
const AdminsComponent: React.FC = () => {
    const {
        admins,
        status,
        error,
        currentPage,
        totalPages,
        selectedAdmin,
        formData,
        formErrors,
        isLoading,
        searchId,
        isModalOpen,
        handlePageChange,
        handleSearchChange,
        handleSearchSubmit,
        handleClearSearch,
        handleCreate,
        handleEdit,
        handleDelete,
        handleInputChange,
        handleSubmit,
        handleCloseModal,
        clearErrorAdmins
    } = useAdminsComponent();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление администраторами</h1>
                <button
                    onClick={handleCreate}
                    className={styles.createButton}
                >
                    Создать администратора
                </button>
            </div>

            <SearchForm
                searchId={searchId}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={handleClearSearch}
            />

            {error && (
                <div className={styles.error}>
                    {error}
                    <button onClick={clearErrorAdmins} className={styles.errorClose}>
                        ×
                    </button>
                </div>
            )}

            {status === 'loading' ? (
                <div className={styles.loadingContainer}>
                    <Loader />
                </div>
            ) : (
                <AdminTable
                    admins={admins}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <AdminModal
                isOpen={isModalOpen}
                admin={selectedAdmin}
                formData={formData}
                formErrors={formErrors}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onClose={handleCloseModal}
            />

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const isFirstPage = page === 1;
                        const isLastPage = page === totalPages;
                        const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                        
                        if (isFirstPage || isLastPage || isNearCurrentPage) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                                    disabled={status === 'loading'}
                                >
                                    {page}
                                </button>
                            );
                        }
                        
                        if (page === 2 || page === totalPages - 1) {
                            return <span key={`ellipsis-${page}`} className={styles.ellipsis}>...</span>;
                        }
                        
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminsComponent;
