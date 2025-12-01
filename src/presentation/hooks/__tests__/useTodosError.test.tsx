import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { TodoProvider } from '../../../infrastructure/di/TodoContext';

// Mock repository to throw errors
vi.mock('../../../data/repositories/LocalStorageTodoRepository', () => {
    return {
        LocalStorageTodoRepository: class {
            getTodos = vi.fn().mockResolvedValue([{ id: '1', text: 'Task', completed: false, createdAt: 1000 }]);
            saveTodo = vi.fn().mockRejectedValue(new Error('Save failed'));
            updateTodo = vi.fn().mockRejectedValue(new Error('Update failed'));
            deleteTodo = vi.fn().mockRejectedValue(new Error('Delete failed'));
        },
    };
});

describe('useTodos Error Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should handle error when adding todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper: TodoProvider });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.add('New Task', 'medium');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to add todo:', expect.any(Error));
    });

    it('should handle error when updating todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper: TodoProvider });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.update('1', 'Updated Task', 'medium');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to update todo:', expect.any(Error));
    });

    it('should handle error when toggling todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper: TodoProvider });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.toggle('1');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to toggle todo:', expect.any(Error));
    });

    it('should handle error when deleting todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper: TodoProvider });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.remove('1');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to delete todo:', expect.any(Error));
    });
});
