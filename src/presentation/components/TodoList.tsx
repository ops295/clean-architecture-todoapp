import React from 'react';
import type { Todo } from '../../domain/entities/Todo';
import { TodoItem } from './TodoItem';
import { AnimatePresence } from 'framer-motion';

interface Props {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onToggle, onDelete, onUpdate }) => {
    if (todos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>No tasks found.</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Add one to get started!</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <AnimatePresence mode='popLayout'>
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
