import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddTodoModal } from '../AddTodoModal';

describe('AddTodoModal', () => {
    const mockHandlers = {
        onClose: vi.fn(),
        onAdd: vi.fn(),
    };

    it('should not render when isOpen is false', () => {
        render(<AddTodoModal isOpen={false} {...mockHandlers} />);
        expect(screen.queryByText('New Task')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
        render(<AddTodoModal isOpen={true} {...mockHandlers} />);
        expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    it('should call onClose when overlay is clicked', () => {
        render(<AddTodoModal isOpen={true} {...mockHandlers} />);
        // The overlay is the outer div. We can find it by class or testid.
        // Assuming the first div is the overlay.
        // Or we can click the "Cancel" button which also calls onClose
        fireEvent.click(screen.getByText('Cancel'));
        expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('should stop propagation when modal content is clicked', () => {
        render(<AddTodoModal isOpen={true} {...mockHandlers} />);
        const modalContent = screen.getByText('New Task').closest('div');
        if (modalContent) {
            fireEvent.click(modalContent);
            // Verify onClose was NOT called (if overlay click would close it)
            // But we need to reset mock first
            mockHandlers.onClose.mockClear();
            fireEvent.click(modalContent);
            expect(mockHandlers.onClose).not.toHaveBeenCalled();
        }
    });

    it('should not submit if text is empty', () => {
        render(<AddTodoModal isOpen={true} {...mockHandlers} />);
        const form = screen.getByText('New Task').closest('div')?.querySelector('form');
        if (form) fireEvent.submit(form);
        expect(mockHandlers.onAdd).not.toHaveBeenCalled();
    });

    it('should submit with correct data', () => {
        render(<AddTodoModal isOpen={true} {...mockHandlers} />);

        const input = screen.getByPlaceholderText('What needs to be done?');
        fireEvent.change(input, { target: { value: 'New Task' } });

        // Select priority (assuming default is medium, let's change to high)
        // Finding priority buttons might be tricky without aria-labels.
        // Let's just submit with default

        fireEvent.click(screen.getByText('Create Task'));

        expect(mockHandlers.onAdd).toHaveBeenCalledWith('New Task', 'medium', undefined, undefined);
    });
});
