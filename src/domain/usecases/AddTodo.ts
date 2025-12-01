import type { TodoRepository } from '../repositories/TodoRepository';
import type { Todo } from '../entities/Todo';

export class AddTodo {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    execute(todo: Todo): Promise<void> {
        return this.todoRepository.saveTodo(todo);
    }
}
