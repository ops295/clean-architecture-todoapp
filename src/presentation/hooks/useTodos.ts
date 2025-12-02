import {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} from '../store/api/todoApi';
import type { Todo } from '../../domain/entities/Todo';

export const useTodos = () => {
    const { data: todos = [], isLoading: loading, refetch } = useGetTodosQuery();
    const [addTodo] = useAddTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();

    const add = async (text: string, priority: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            priority,
            category,
            dueDate,
            completed: false,
            createdAt: Date.now(),
        };
        try {
            await addTodo(newTodo).unwrap();
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const update = async (id: string, text: string, priority?: 'low' | 'medium' | 'high', category?: string, dueDate?: number) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            try {
                await updateTodo({
                    ...todo,
                    text,
                    priority: priority ?? todo.priority,
                    category: category ?? todo.category,
                    dueDate: dueDate ?? todo.dueDate
                }).unwrap();
            } catch (error) {
                console.error('Failed to update todo:', error);
            }
        }
    };

    const toggle = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            try {
                await updateTodo({ ...todo, completed: !todo.completed }).unwrap();
            } catch (error) {
                console.error('Failed to toggle todo:', error);
            }
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteTodo(id).unwrap();
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    return {
        todos,
        loading,
        getTodos: refetch,
        add,
        update,
        toggle,
        remove
    };
};
