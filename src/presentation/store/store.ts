import { configureStore } from '@reduxjs/toolkit';
import { todoApi } from './api/todoApi';
import todoReducer from './slices/todoSlice';

export const store = configureStore({
    reducer: {
        [todoApi.reducerPath]: todoApi.reducer,
        todos: todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
