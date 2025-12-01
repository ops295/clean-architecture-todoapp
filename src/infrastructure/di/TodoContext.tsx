import React, { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { LocalStorageTodoRepository } from '../../data/repositories/LocalStorageTodoRepository';
import { GetTodos } from '../../domain/usecases/GetTodos';
import { AddTodo } from '../../domain/usecases/AddTodo';
import { UpdateTodo } from '../../domain/usecases/UpdateTodo';
import { DeleteTodo } from '../../domain/usecases/DeleteTodo';
import type { Todo } from '../../domain/entities/Todo';

interface TodoContextType {
    todos: Todo[];
    loading: boolean;
    getTodos: () => Promise<void>;
    add: (text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => Promise<void>;
    update: (id: string, text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => Promise<void>;
    toggle: (id: string) => Promise<void>;
    remove: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    const repository = new LocalStorageTodoRepository();
    const getTodosUseCase = new GetTodos(repository);
    const addTodoUseCase = new AddTodo(repository);
    const updateTodoUseCase = new UpdateTodo(repository);
    const deleteTodoUseCase = new DeleteTodo(repository);

    const getTodos = async () => {
        setLoading(true);
        try {
            const fetchedTodos = await getTodosUseCase.execute();
            setTodos(fetchedTodos);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const add = async (text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => {
        try {
            const newTodo: Todo = {
                id: crypto.randomUUID(),
                text,
                priority,
                category,
                dueDate,
                completed: false,
                createdAt: Date.now(),
            };
            await addTodoUseCase.execute(newTodo);
            await getTodos();
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const update = async (id: string, text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => {
        try {
            const todoToUpdate = todos.find(t => t.id === id);
            if (!todoToUpdate) return;

            const updatedTodo = { ...todoToUpdate, text, priority, category, dueDate };
            await updateTodoUseCase.execute(updatedTodo);
            await getTodos();
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    const toggle = async (id: string) => {
        try {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                await updateTodoUseCase.execute({ ...todo, completed: !todo.completed });
                await getTodos();
            }
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteTodoUseCase.execute(id);
            await getTodos();
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    return (
        <TodoContext.Provider value={{ todos, loading, getTodos, add, update, toggle, remove }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodoContext = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodoContext must be used within a TodoProvider');
    }
    return context;
};
