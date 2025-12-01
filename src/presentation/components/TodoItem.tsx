import React, { useState } from 'react';
import type { Todo } from '../../domain/entities/Todo';
import { motion } from 'framer-motion';
import { Trash2, Check, Edit2, X, Save, Calendar, Tag } from 'lucide-react';
import styles from './TodoItem.module.css';

interface Props {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSave = () => {
        if (editText.trim()) {
            onUpdate(todo.id, editText);
            setIsEditing(false);
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'var(--priority-high)';
            case 'medium': return 'var(--priority-medium)';
            case 'low': return 'var(--priority-low)';
            default: return 'var(--text-secondary)';
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={styles.item}
            style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}
        >
            <div className={styles.mainContent}>
                <button
                    className={`${styles.checkbox} ${todo.completed ? styles.checked : ''}`}
                    onClick={() => onToggle(todo.id)}
                    aria-label="Toggle todo"
                >
                    {todo.completed && <Check size={16} color="white" strokeWidth={3} />}
                </button>

                <div className={styles.contentWrapper}>
                    {isEditing ? (
                        <input
                            className={styles.input}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            autoFocus
                        />
                    ) : (
                        <div className={styles.textWrapper}>
                            <span className={`${styles.text} ${todo.completed ? styles.completedText : ''}`}>
                                {todo.text}
                            </span>
                            <div className={styles.metaData}>
                                {todo.category && (
                                    <span className={styles.tag}>
                                        <Tag size={12} /> {todo.category}
                                    </span>
                                )}
                                {todo.dueDate && (
                                    <span className={`${styles.tag} ${todo.dueDate < Date.now() ? styles.overdue : ''}`}>
                                        <Calendar size={12} /> {formatDate(todo.dueDate)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className={styles.actionBtn} aria-label="Save"><Save size={18} /></button>
                        <button onClick={() => setIsEditing(false)} className={styles.actionBtn} aria-label="Cancel"><X size={18} /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className={styles.actionBtn} aria-label="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => onDelete(todo.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete"><Trash2 size={18} /></button>
                    </>
                )}
            </div>
        </motion.div>
    );
};
