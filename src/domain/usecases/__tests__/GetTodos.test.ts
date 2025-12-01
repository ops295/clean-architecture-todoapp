import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTodos } from '../GetTodos';
import type { TodoRepository } from '../../repositories/TodoRepository';
import type { Todo } from '../../entities/Todo';

describe('GetTodos Use Case', () => {
    let getTodos: GetTodos;
    let mockRepository: TodoRepository;

    beforeEach(() => {
        mockRepository = {
            getTodos: vi.fn(),
            saveTodo: vi.fn(),
            deleteTodo: vi.fn(),
            updateTodo: vi.fn(),
        };
        getTodos = new GetTodos(mockRepository);
    });

    it('should return todos from the repository', async () => {
        const mockTodos: Todo[] = [
            { id: '1', text: 'Todo 1', completed: false, createdAt: 1000, priority: 'low' },
            { id: '2', text: 'Todo 2', completed: true, createdAt: 2000, priority: 'high' },
        ];

        (mockRepository.getTodos as any).mockResolvedValue(mockTodos);

        const result = await getTodos.execute();

        expect(result).toEqual(mockTodos);
        expect(mockRepository.getTodos).toHaveBeenCalledTimes(1);
    });
});
