import React from 'react';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import styles from './SettingsScreen.module.css';

interface Props {
    onBack: () => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const SettingsScreen: React.FC<Props> = ({ onBack, isDarkMode, toggleTheme }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backBtn} aria-label="Go back">
                    <ArrowLeft size={20} />
                </button>
                <h2>Settings</h2>
            </div>

            <div className={styles.section}>
                <div className={styles.item}>
                    <div className={styles.itemInfo}>
                        <h3>Dark Mode</h3>
                        <p>Switch between light and dark themes</p>
                    </div>
                    <button onClick={toggleTheme} className={styles.themeToggle}>
                        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.item}>
                    <div className={styles.itemInfo}>
                        <h3>About</h3>
                        <p>Clean Architecture Todo App v1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
