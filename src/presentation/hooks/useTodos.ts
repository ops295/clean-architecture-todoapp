import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../../domain/entities/Todo';
import { useTodoContext } from '../../infrastructure/di/TodoContext';
import { v4 as uuidv4 } from 'uuid';

export const useTodos = () => {
    const { todos, loading, getTodos, add, update, toggle, remove } = useTodoContext();

    return {
        todos,
        loading,
        getTodos,
        add,
        update,
        toggle,
        remove
    };
};
