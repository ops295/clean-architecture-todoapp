import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../../../domain/entities/Todo';

export type FilterType = 'all' | 'active' | 'completed';

interface OptimisticTodo extends Todo {
    isOptimistic?: boolean;
    tempId?: string;
}

interface TodoState {
    // UI State
    filter: FilterType;
    searchQuery: string;

    // Optimistic Updates
    optimisticTodos: OptimisticTodo[];

    // Undo/Redo
    history: Array<{
        action: string;
        data: any;
        timestamp: number;
    }>;
    historyIndex: number;
}

const initialState: TodoState = {
    filter: 'all',
    searchQuery: '',
    optimisticTodos: [],
    history: [],
    historyIndex: -1,
};

const MAX_HISTORY = 10;

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        // Filter & Search
        setFilter: (state, action: PayloadAction<FilterType>) => {
            state.filter = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        // Optimistic Updates
        todoAddedOptimistic: (state, action: PayloadAction<OptimisticTodo>) => {
            state.optimisticTodos.push({ ...action.payload, isOptimistic: true });
            addToHistory(state, 'add', action.payload);
        },
        todoConfirmed: (state, action: PayloadAction<{ tempId: string; realId: string }>) => {
            const index = state.optimisticTodos.findIndex(t => t.id === action.payload.tempId);
            if (index !== -1) {
                state.optimisticTodos.splice(index, 1);
            }
        },
        todoRollback: (state, action: PayloadAction<string>) => {
            state.optimisticTodos = state.optimisticTodos.filter(t => t.id !== action.payload);
        },

        todoUpdatedOptimistic: (state, action: PayloadAction<Todo>) => {
            const index = state.optimisticTodos.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.optimisticTodos[index] = { ...action.payload, isOptimistic: true };
            } else {
                state.optimisticTodos.push({ ...action.payload, isOptimistic: true });
            }
            addToHistory(state, 'update', action.payload);
        },

        todoDeletedOptimistic: (state, action: PayloadAction<string>) => {
            const todo = state.optimisticTodos.find(t => t.id === action.payload);
            if (todo) {
                addToHistory(state, 'delete', todo);
            }
            state.optimisticTodos = state.optimisticTodos.filter(t => t.id !== action.payload);
        },

        clearOptimistic: (state) => {
            state.optimisticTodos = [];
        },

        // Undo/Redo
        undo: (state) => {
            if (state.historyIndex > 0) {
                state.historyIndex--;
                // The actual undo logic would be handled by the component
                // This just tracks the history index
            }
        },
        redo: (state) => {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                // The actual redo logic would be handled by the component
            }
        },
        clearHistory: (state) => {
            state.history = [];
            state.historyIndex = -1;
        },
    },
});

// Helper function to add to history
function addToHistory(state: TodoState, action: string, data: any) {
    // Remove any history after current index (if we're not at the end)
    if (state.historyIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.historyIndex + 1);
    }

    // Add new history entry
    state.history.push({
        action,
        data,
        timestamp: Date.now(),
    });

    // Limit history size
    if (state.history.length > MAX_HISTORY) {
        state.history.shift();
    } else {
        state.historyIndex++;
    }
}

export const {
    setFilter,
    setSearchQuery,
    todoAddedOptimistic,
    todoConfirmed,
    todoRollback,
    todoUpdatedOptimistic,
    todoDeletedOptimistic,
    clearOptimistic,
    undo,
    redo,
    clearHistory,
} = todoSlice.actions;

export default todoSlice.reducer;
