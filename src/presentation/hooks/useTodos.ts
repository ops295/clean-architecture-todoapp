import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../../domain/entities/Todo';
import { useTodoContext } from '../../infrastructure/di/TodoContext';
import { v4 as uuidv4 } from 'uuid';

export const useTodos = () => {
    const { getTodos, addTodo, updateTodo, deleteTodo } = useTodoContext();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTodos.execute();
            // Sort by createdAt desc
            setTodos(data.sort((a, b) => b.createdAt - a.createdAt));
        } finally {
            setLoading(false);
        }
    }, [getTodos]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const add = async (text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => {
        const newTodo: Todo = {
            id: uuidv4(),
            text,
            completed: false,
            createdAt: Date.now(),
            priority,
            category,
            dueDate,
        };
        await addTodo.execute(newTodo);
        await fetchTodos();
    };

    const toggle = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await updateTodo.execute({ ...todo, completed: !todo.completed });
            await fetchTodos();
        }
    };

    const remove = async (id: string) => {
        await deleteTodo.execute(id);
        await fetchTodos();
    };

    const update = async (id: string, text: string) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await updateTodo.execute({ ...todo, text });
            await fetchTodos();
        }
    };

    return { todos, loading, add, toggle, remove, update };
};
