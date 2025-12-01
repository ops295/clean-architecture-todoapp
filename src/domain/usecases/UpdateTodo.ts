import type { TodoRepository } from '../repositories/TodoRepository';
import type { Todo } from '../entities/Todo';

export class UpdateTodo {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    execute(todo: Todo): Promise<void> {
        return this.todoRepository.updateTodo(todo);
    }
}
