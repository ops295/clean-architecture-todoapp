import { useState, useEffect } from 'react';

import { useTodos } from './presentation/hooks/useTodos';
import { TodoList } from './presentation/components/TodoList';
import { TodoFilters, type FilterType } from './presentation/components/TodoFilters';
import { AddTodoModal } from './presentation/components/AddTodoModal';
import { SettingsScreen } from './presentation/components/SettingsScreen';
import { Stats } from './presentation/components/Stats';
import { Settings, Plus } from 'lucide-react';
import './presentation/styles/global.css';

const TodoApp = () => {
  const { todos, loading, add, toggle, remove, update } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'settings'>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter =
      filter === 'all' ? true :
        filter === 'active' ? !todo.completed :
          todo.completed;

    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (currentScreen === 'settings') {
    return (
      <SettingsScreen
        onBack={() => setCurrentScreen('home')}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', paddingBottom: '6rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tasks</h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
            Manage your tasks efficiently
          </p>
        </div>
        <button
          onClick={() => setCurrentScreen('settings')}
          style={{
            padding: '0.75rem',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </header>

      <Stats todos={todos} />

      <TodoFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={toggle}
          onDelete={remove}
          onUpdate={update}
        />
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          zIndex: 40
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Add Task"
      >
        <Plus size={28} />
      </button>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={add}
      />
    </div>
  );
};

const App = () => {
  return (
    <TodoApp />
  );
};

export default App;
