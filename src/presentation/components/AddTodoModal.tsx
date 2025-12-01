import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './AddTodoModal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (text: string) => void;
}

export const AddTodoModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text);
            setText('');
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
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                        style={{ position: 'fixed', top: '50%', left: '50%' }}
                        className={styles.modal}
                    >
                        <div className={styles.header}>
                            <h2>Add New Task</h2>
                            <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                className={styles.input}
                                placeholder="What needs to be done?"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                autoFocus
                            />
                            <div className={styles.footer}>
                                <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.addBtn} disabled={!text.trim()}>Add Task</button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
