import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTodoContext, TodoProvider } from '../TodoContext';
import React from 'react';

describe('TodoContext', () => {
    it('should throw error when used outside provider', () => {
        // Suppress console.error for this test as React will log an error about missing context
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            renderHook(() => useTodoContext());
        }).toThrow('useTodoContext must be used within a TodoProvider');

        consoleSpy.mockRestore();
    });

    it('should provide context values when used within provider', () => {
        const { result } = renderHook(() => useTodoContext(), {
            wrapper: ({ children }) => <TodoProvider>{children}</TodoProvider>
        });

        expect(result.current).toHaveProperty('getTodos');
        expect(result.current).toHaveProperty('add');
        expect(result.current).toHaveProperty('update');
        expect(result.current).toHaveProperty('toggle');
        expect(result.current).toHaveProperty('remove');
    });
});
