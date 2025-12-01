import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Flag } from 'lucide-react';
import styles from './AddTodoModal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => void;
}

export const AddTodoModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(
                text,
                priority,
                category.trim() || undefined,
                dueDate ? new Date(dueDate).getTime() : undefined
            );
            setText('');
            setPriority('medium');
            setCategory('');
            setDueDate('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.overlay}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: "100%" }}
                        animate={{ opacity: 1, scale: 1, y: "0%" }}
                        exit={{ opacity: 0, scale: 0.95, y: "100%" }}
                        className={styles.modalContainer}
                    >
                        <div className={styles.modal}>
                            <div className={styles.header}>
                                <h2>New Task</h2>
                                <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <input
                                        className={styles.mainInput}
                                        placeholder="What needs to be done?"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.optionsGrid}>
                                    <div className={styles.option}>
                                        <label><Flag size={16} /> Priority</label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as any)}
                                            className={styles.select}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div className={styles.option}>
                                        <label><Tag size={16} /> Category</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Work"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className={styles.subInput}
                                        />
                                    </div>

                                    <div className={styles.option}>
                                        <label><Calendar size={16} /> Due Date</label>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className={styles.subInput}
                                        />
                                    </div>
                                </div>

                                <div className={styles.footer}>
                                    <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.addBtn} disabled={!text.trim()}>Create Task</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
