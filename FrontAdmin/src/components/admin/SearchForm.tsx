import React from 'react';
import styles from './AdminComponent.module.css';

interface SearchFormProps {
    searchId: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onClearSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
    searchId,
    onSearchChange,
    onSearchSubmit,
    onClearSearch
}) => {
    return (
        <form onSubmit={onSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchInputGroup}>
                <input
                    type="text"
                    value={searchId}
                    onChange={onSearchChange}
                    placeholder="Поиск по ID Администратора"
                  
                    className={styles.searchInput}
                />
                {searchId && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className={styles.clearButton}
                    >
                        ×
                    </button>
                )}
            </div>
            <button type="submit" className={styles.searchButton}>
                Найти
            </button>
        </form>
    );
};

export default SearchForm; 

