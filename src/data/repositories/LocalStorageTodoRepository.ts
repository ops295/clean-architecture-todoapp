import type { Todo } from '../../domain/entities/Todo';
import type { TodoRepository } from '../../domain/repositories/TodoRepository';

const STORAGE_KEY = 'clean_arch_todos';

export class LocalStorageTodoRepository implements TodoRepository {
    async getTodos(): Promise<Todo[]> {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    async saveTodo(todo: Todo): Promise<void> {
        const todos = await this.getTodos();
        todos.push(todo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    async deleteTodo(id: string): Promise<void> {
        const todos = await this.getTodos();
        const newTodos = todos.filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    }

    async updateTodo(updatedTodo: Todo): Promise<void> {
        const todos = await this.getTodos();
        const newTodos = todos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    }
}
