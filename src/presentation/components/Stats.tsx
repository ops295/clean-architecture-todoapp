import React from 'react';
import type { Todo } from '../../domain/entities/Todo';
import styles from './Stats.module.css';

interface Props {
    todos: Todo[];
}

export const Stats: React.FC<Props> = ({ todos }) => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Progress</h3>
                <span>{percentage}%</span>
            </div>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className={styles.details}>
                <span>{completed} completed</span>
                <span>{total - completed} remaining</span>
            </div>
        </div>
    );
};
