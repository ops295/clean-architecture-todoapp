import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { todoApi } from '../../store/api/todoApi';

// Mock repository to throw errors
vi.mock('../../../data/repositories/ApiTodoRepository', () => {
    return {
        ApiTodoRepository: class {
            async getTodos() { return [{ id: '1', text: 'Task', completed: false, createdAt: 1000 }]; }
            async saveTodo() { throw new Error('Save failed'); }
            async updateTodo() { throw new Error('Update failed'); }
            async deleteTodo() { throw new Error('Delete failed'); }
        }
    };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
);

describe('useTodos Error Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        store.dispatch(todoApi.util.resetApiState());
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should handle error when adding todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.add('New Task', 'medium');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to add todo:', expect.anything());
    });

    it('should handle error when updating todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.update('1', 'Updated Task', 'medium');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to update todo:', expect.anything());
    });

    it('should handle error when toggling todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.toggle('1');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to toggle todo:', expect.anything());
    });

    it('should handle error when deleting todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.remove('1');
        });
        expect(console.error).toHaveBeenCalledWith('Failed to delete todo:', expect.anything());
    });
});

