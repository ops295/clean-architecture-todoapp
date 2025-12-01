import React from 'react';
import { Search } from 'lucide-react';
import styles from './TodoFilters.module.css';

export type FilterType = 'all' | 'active' | 'completed';

interface Props {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const TodoFilters: React.FC<Props> = ({ currentFilter, onFilterChange, searchQuery, onSearchChange }) => {
    return (
        <div className={styles.container}>
            <div className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
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
        </div>
    );
};
