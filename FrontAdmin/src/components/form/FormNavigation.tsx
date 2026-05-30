import React from 'react';
import styles from './FormComponent.module.css';

export type ViewMode = 'active' | 'archive';

interface FormNavigationProps {
    currentMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    activeCount: number;
    archiveCount: number;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
    currentMode,
    onModeChange,
    activeCount,
    archiveCount
}) => {
    return (
        <div className={styles.navigation}>
            <button
                className={`${styles.navButton} ${currentMode === 'active' ? styles.active : ''}`}
                onClick={() => onModeChange('active')}
            >
                <span className={styles.navText}>Активные заявки</span>
                {activeCount > 0 && (
                    <span className={styles.navBadge}>{activeCount}</span>
                )}
            </button>
            
            <button
                className={`${styles.navButton} ${currentMode === 'archive' ? styles.active : ''}`}
                onClick={() => onModeChange('archive')}
            >
                <span className={styles.navText}>Архив</span>
                {archiveCount > 0 && (
                    <span className={styles.navBadge}>{archiveCount}</span>
                )}
            </button>
        </div>
    );
};

export default FormNavigation;
