import type { Todo } from '../entities/Todo';

export interface TodoRepository {
    getTodos(): Promise<Todo[]>;
    saveTodo(todo: Todo): Promise<void>;
    deleteTodo(id: string): Promise<void>;
    updateTodo(todo: Todo): Promise<void>;
}
