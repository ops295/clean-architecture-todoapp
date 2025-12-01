import type { TodoRepository } from '../repositories/TodoRepository';
import type { Todo } from '../entities/Todo';

export class GetTodos {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    execute(): Promise<Todo[]> {
        return this.todoRepository.getTodos();
    }
}
