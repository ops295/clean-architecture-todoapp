import React, { createContext, useContext, type ReactNode } from 'react';
import { LocalStorageTodoRepository } from '../../data/repositories/LocalStorageTodoRepository';
import { GetTodos } from '../../domain/usecases/GetTodos';
import { AddTodo } from '../../domain/usecases/AddTodo';
import { UpdateTodo } from '../../domain/usecases/UpdateTodo';
import { DeleteTodo } from '../../domain/usecases/DeleteTodo';

interface TodoContextType {
    getTodos: GetTodos;
    addTodo: AddTodo;
    updateTodo: UpdateTodo;
    deleteTodo: DeleteTodo;
}

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const repository = new LocalStorageTodoRepository();
    const getTodos = new GetTodos(repository);
    const addTodo = new AddTodo(repository);
    const updateTodo = new UpdateTodo(repository);
    const deleteTodo = new DeleteTodo(repository);

    return (
        <TodoContext.Provider value={{ getTodos, addTodo, updateTodo, deleteTodo }}>
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
