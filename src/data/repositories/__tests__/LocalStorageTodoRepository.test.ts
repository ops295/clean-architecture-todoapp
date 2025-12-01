import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageTodoRepository } from '../LocalStorageTodoRepository';
import type { Todo } from '../../../domain/entities/Todo';

describe('LocalStorageTodoRepository', () => {
    let repository: LocalStorageTodoRepository;
    const STORAGE_KEY = 'clean_arch_todos';

    beforeEach(() => {
        repository = new LocalStorageTodoRepository();
        localStorage.clear();
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Storage.prototype, 'getItem');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should save a todo to localStorage', async () => {
        const todo: Todo = {
            id: '1',
            text: 'Test Todo',
            completed: false,
            createdAt: Date.now(),
            priority: 'medium'
        };

        await repository.saveTodo(todo);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            JSON.stringify([todo])
        );
    });

    it('should retrieve todos from localStorage', async () => {
        const todos: Todo[] = [
            { id: '1', text: 'Todo 1', completed: false, createdAt: 1000, priority: 'low' }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

        const result = await repository.getTodos();

        expect(result).toEqual(todos);
        expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return empty array if no todos in localStorage', async () => {
        const result = await repository.getTodos();
        expect(result).toEqual([]);
    });

    it('should delete a todo', async () => {
        const todo: Todo = { id: '1', text: 'To Delete', completed: false, createdAt: 1000, priority: 'low' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([todo]));

        await repository.deleteTodo('1');

        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([]));
    });

    it('should update a todo', async () => {
        const todo: Todo = { id: '1', text: 'Original', completed: false, createdAt: 1000, priority: 'low' };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([todo]));

        const updatedTodo = { ...todo, text: 'Updated' };
        await repository.updateTodo(updatedTodo);

        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([updatedTodo]));
    });

    it('should handle null data in localStorage', async () => {
        localStorage.setItem(STORAGE_KEY, 'null'); // or just don't set it, but getItem returns null
        (localStorage.getItem as any).mockReturnValue(null);

        const result = await repository.getTodos();
        expect(result).toEqual([]);
    });
});
