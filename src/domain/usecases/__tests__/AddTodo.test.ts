import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddTodo } from '../AddTodo';
import type { TodoRepository } from '../../repositories/TodoRepository';
import type { Todo } from '../../entities/Todo';

describe('AddTodo Use Case', () => {
    let addTodo: AddTodo;
    let mockRepository: TodoRepository;

    beforeEach(() => {
        mockRepository = {
            getTodos: vi.fn(),
            saveTodo: vi.fn(),
            deleteTodo: vi.fn(),
            updateTodo: vi.fn(),
        };
        addTodo = new AddTodo(mockRepository);
    });

    it('should call repository.saveTodo with the correct todo', async () => {
        const todo: Todo = {
            id: '123',
            text: 'Test Todo',
            completed: false,
            createdAt: Date.now(),
            priority: 'medium'
        };

        await addTodo.execute(todo);

        expect(mockRepository.saveTodo).toHaveBeenCalledWith(todo);
        expect(mockRepository.saveTodo).toHaveBeenCalledTimes(1);
    });
});
