import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { todoApi } from '../../store/api/todoApi';

const { mockStore } = vi.hoisted(() => {
    return { mockStore: { todos: [] as any[] } };
});

// Mock ApiTodoRepository
vi.mock('../../../data/repositories/ApiTodoRepository', () => {
    return {
        ApiTodoRepository: class {
            constructor() { }
            async getTodos() { return [...mockStore.todos]; }
            async saveTodo(todo: any) { mockStore.todos.push(todo); }
            async updateTodo(todo: any) {
                mockStore.todos = mockStore.todos.map(t => t.id === todo.id ? todo : t);
            }
            async deleteTodo(id: string) {
                mockStore.todos = mockStore.todos.filter(t => t.id !== id);
            }
        }
    };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
);

describe('useTodos Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        store.dispatch(todoApi.util.resetApiState());
        mockStore.todos = [
            { id: '1', text: 'Test', completed: false, createdAt: 1000, priority: 'low' }
        ];
    });

    it('should fetch todos on mount', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });

        // Initial loading state might be true or false depending on how fast the mock resolves
        // But eventually it should have data
        await waitFor(() => {
            expect(result.current.todos).toHaveLength(1);
        });

        expect(result.current.todos).toEqual([
            { id: '1', text: 'Test', completed: false, createdAt: 1000, priority: 'low' }
        ]);
    });

    it('should add a todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.todos).toHaveLength(1));

        await act(async () => {
            await result.current.add('New Task', 'medium');
        });

        await waitFor(() => {
            expect(result.current.todos).toHaveLength(2);
        });
        expect(result.current.todos.find(t => t.text === 'New Task')).toBeDefined();
    });

    it('should update a todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.todos).toHaveLength(1));

        await act(async () => {
            await result.current.update('1', 'Updated');
        });

        await waitFor(() => {
            expect(result.current.todos.find(t => t.id === '1')?.text).toBe('Updated');
        });
    });

    it('should remove a todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.todos).toHaveLength(1));

        await act(async () => {
            await result.current.remove('1');
        });

        await waitFor(() => {
            expect(result.current.todos).toHaveLength(0);
        });
    });

    it('should toggle a todo', async () => {
        const { result } = renderHook(() => useTodos(), { wrapper });
        await waitFor(() => expect(result.current.todos).toHaveLength(1));

        await act(async () => {
            await result.current.toggle('1');
        });

        await waitFor(() => {
            expect(result.current.todos.find(t => t.id === '1')?.completed).toBe(true);
        });
    });
});

