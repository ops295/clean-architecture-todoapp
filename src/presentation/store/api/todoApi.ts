import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Todo } from '../../../domain/entities/Todo';
import { useCases } from '../../../infrastructure/di/container';

export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Todo'],
    endpoints: (builder) => ({
        getTodos: builder.query<Todo[], void>({
            queryFn: async () => {
                try {
                    const data = await useCases.getTodos.execute();
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Todo'],
        }),
        addTodo: builder.mutation<void, Todo>({
            queryFn: async (todo) => {
                try {
                    await useCases.addTodo.execute(todo);
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Todo'],
        }),
        updateTodo: builder.mutation<void, Todo>({
            queryFn: async (todo) => {
                try {
                    await useCases.updateTodo.execute(todo);
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Todo'],
        }),
        deleteTodo: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    await useCases.deleteTodo.execute(id);
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Todo'],
        }),
    }),
});

export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = todoApi;
