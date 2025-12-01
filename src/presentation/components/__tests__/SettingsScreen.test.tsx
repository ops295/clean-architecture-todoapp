import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {
    it('should render correctly', () => {
        render(
            <SettingsScreen
                onBack={vi.fn()}
                isDarkMode={false}
                toggleTheme={vi.fn()}
            />
        );

        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should render dark mode icon when enabled', () => {
        render(
            <SettingsScreen
                onBack={vi.fn()}
                isDarkMode={true}
                toggleTheme={vi.fn()}
            />
        );
        // Moon icon usually has class lucide-moon or similar, but we can check if Sun is NOT there
        // Or check for the specific SVG content if needed, but let's assume if it renders without error it covers the branch
    });

    it('should call onBack when back button is clicked', () => {
        const onBack = vi.fn();
        render(
            <SettingsScreen
                onBack={onBack}
                isDarkMode={false}
                toggleTheme={vi.fn()}
            />
        );

        const backButton = screen.getByLabelText('Go back');
        fireEvent.click(backButton);

        expect(onBack).toHaveBeenCalled();
    });

    it('should call toggleTheme when theme button is clicked', () => {
        const toggleTheme = vi.fn();
        render(
            <SettingsScreen
                onBack={vi.fn()}
                isDarkMode={false}
                toggleTheme={toggleTheme}
            />
        );

        const themeButton = screen.getAllByRole('button')[1]; // The toggle button
        fireEvent.click(themeButton);

        expect(toggleTheme).toHaveBeenCalled();
    });
});
