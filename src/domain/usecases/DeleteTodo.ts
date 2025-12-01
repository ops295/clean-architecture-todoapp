import type { TodoRepository } from '../repositories/TodoRepository';

export class DeleteTodo {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    execute(id: string): Promise<void> {
        return this.todoRepository.deleteTodo(id);
    }
}
