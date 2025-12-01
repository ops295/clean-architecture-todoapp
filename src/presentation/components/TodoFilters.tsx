import React from 'react';
import styles from './TodoFilters.module.css';

export type FilterType = 'all' | 'active' | 'completed';

interface Props {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export const TodoFilters: React.FC<Props> = ({ currentFilter, onFilterChange }) => {
    return (
        <div className={styles.filters}>
            {(['all', 'active', 'completed'] as FilterType[]).map((filter) => (
                <button
                    key={filter}
                    className={`${styles.filterBtn} ${currentFilter === filter ? styles.active : ''}`}
                    onClick={() => onFilterChange(filter)}
                >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
            ))}
        </div>
    );
};
