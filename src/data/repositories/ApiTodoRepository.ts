import axios, { type AxiosInstance } from 'axios';
import type { TodoRepository } from '../../domain/repositories/TodoRepository';
import type { Todo } from '../../domain/entities/Todo';

export class ApiTodoRepository implements TodoRepository {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getTodos(): Promise<Todo[]> {
        const response = await this.client.get<Todo[]>('/todos');
        return response.data;
    }

    async saveTodo(todo: Todo): Promise<void> {
        await this.client.post('/todos', todo);
    }

    async deleteTodo(id: string): Promise<void> {
        await this.client.delete(`/todos/${id}`);
    }

    async updateTodo(todo: Todo): Promise<void> {
        await this.client.put(`/todos/${todo.id}`, todo);
    }
}
