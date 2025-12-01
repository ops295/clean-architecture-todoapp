# Clean Architecture Todo App

A modern Todo application built with **React**, **TypeScript**, and **Clean Architecture** principles. This project demonstrates how to structure a frontend application with proper separation of concerns, testability, and maintainability.

[![Test Coverage](https://img.shields.io/badge/coverage-96%25-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-47%20passing-brightgreen)]()

## 🏗️ Clean Architecture Overview

This application follows **Uncle Bob's Clean Architecture** principles, organizing code into concentric layers where dependencies point inward. The inner layers contain business logic and are independent of frameworks, UI, and external agencies.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│         (React Components, Hooks, UI Logic)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Domain Layer                         │  │
│  │    (Business Logic, Entities, Use Cases)          │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │         Data Layer                          │ │  │
│  │  │  (Repository Implementations, Data Sources) │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                Infrastructure Layer                      │
│           (Dependency Injection, Context)                │
└─────────────────────────────────────────────────────────┘
```

### Dependency Rule

**The Dependency Rule**: Source code dependencies must point only inward, toward higher-level policies.

- **Inner layers** (Domain) know nothing about outer layers
- **Outer layers** (Presentation, Data) depend on inner layers
- **Business logic** is isolated from UI and infrastructure concerns

## 📁 Project Structure

```
src/
├── domain/                    # 🎯 CORE BUSINESS LOGIC (Innermost Layer)
│   ├── entities/              # Business objects
│   │   └── Todo.ts           # Todo entity definition
│   ├── repositories/          # Repository interfaces (contracts)
│   │   └── TodoRepository.ts # Abstract repository interface
│   └── usecases/             # Application business rules
│       ├── AddTodo.ts        # Use case: Add a todo
│       ├── GetTodos.ts       # Use case: Fetch todos
│       ├── UpdateTodo.ts     # Use case: Update a todo
│       ├── DeleteTodo.ts     # Use case: Delete a todo
│       └── __tests__/        # Unit tests for use cases
│
├── data/                      # 💾 DATA ACCESS LAYER
│   └── repositories/          # Repository implementations
│       ├── LocalStorageTodoRepository.ts  # LocalStorage implementation
│       └── __tests__/         # Integration tests
│
├── infrastructure/            # 🔧 FRAMEWORKS & DRIVERS
│   └── di/                    # Dependency Injection
│       ├── TodoContext.tsx   # React Context for DI
│       └── __tests__/        # DI tests
│
├── presentation/              # 🎨 UI LAYER (Outermost Layer)
│   ├── components/            # React components
│   │   ├── AddTodoModal.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoFilters.tsx
│   │   ├── Stats.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── __tests__/        # Component tests
│   ├── hooks/                 # Custom React hooks (ViewModels)
│   │   ├── useTodos.ts       # Todo management hook
│   │   └── __tests__/        # Hook tests
│   ├── styles/                # Styling
│   └── __tests__/            # Behavioral/E2E tests
│
├── test/                      # Test configuration
│   └── setup.ts
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

## 🎯 Clean Architecture Principles Applied

### 1. **Domain Layer (Business Logic)**

The domain layer is the heart of the application and contains:

#### Entities
Pure business objects with no dependencies on frameworks:

```typescript
// src/domain/entities/Todo.ts
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    dueDate?: number;
}
```

#### Repository Interfaces
Abstract contracts defining data operations:

```typescript
// src/domain/repositories/TodoRepository.ts
export interface TodoRepository {
    getTodos(): Promise<Todo[]>;
    saveTodo(todo: Todo): Promise<void>;
    updateTodo(todo: Todo): Promise<void>;
    deleteTodo(id: string): Promise<void>;
}
```

#### Use Cases
Single-responsibility business rules:

```typescript
// src/domain/usecases/AddTodo.ts
export class AddTodo {
    constructor(private repository: TodoRepository) {}
    
    async execute(todo: Todo): Promise<void> {
        await this.repository.saveTodo(todo);
    }
}
```

**Key Principles:**
- ✅ No framework dependencies
- ✅ Testable in isolation
- ✅ Reusable across different UIs
- ✅ Independent of data sources

### 2. **Data Layer (Infrastructure)**

Implements repository interfaces with concrete data sources:

```typescript
// src/data/repositories/LocalStorageTodoRepository.ts
export class LocalStorageTodoRepository implements TodoRepository {
    private storageKey = 'clean_arch_todos';
    
    async getTodos(): Promise<Todo[]> {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
    
    async saveTodo(todo: Todo): Promise<void> {
        const todos = await this.getTodos();
        todos.push(todo);
        localStorage.setItem(this.storageKey, JSON.stringify(todos));
    }
    // ... other implementations
}
```

**Key Principles:**
- ✅ Implements domain interfaces
- ✅ Handles external dependencies (localStorage, APIs)
- ✅ Can be swapped without affecting business logic
- ✅ Tested with integration tests

### 3. **Presentation Layer (UI)**

React components and hooks that interact with use cases:

```typescript
// src/presentation/hooks/useTodos.ts
export const useTodos = () => {
    const { todos, loading, add, update, toggle, remove } = useTodoContext();
    
    return {
        todos,
        loading,
        add,      // Calls AddTodo use case
        update,   // Calls UpdateTodo use case
        toggle,   // Calls UpdateTodo use case
        remove    // Calls DeleteTodo use case
    };
};
```

**Key Principles:**
- ✅ Depends on domain layer (use cases)
- ✅ No direct database/API calls
- ✅ Testable with mocked use cases
- ✅ Framework-specific (React)

### 4. **Infrastructure Layer (DI)**

Wires everything together using Dependency Injection:

```typescript
// src/infrastructure/di/TodoContext.tsx
export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const repository = new LocalStorageTodoRepository();
    const getTodosUseCase = new GetTodos(repository);
    const addTodoUseCase = new AddTodo(repository);
    // ... inject dependencies
    
    return (
        <TodoContext.Provider value={{ /* ... */ }}>
            {children}
        </TodoContext.Provider>
    );
};
```

**Key Principles:**
- ✅ Manages object creation and lifecycle
- ✅ Injects dependencies into use cases
- ✅ Easy to swap implementations (e.g., API instead of localStorage)

## 🧪 Testing Strategy (TDD/BDD)

This project achieves **96% test coverage** with a comprehensive testing strategy:

### Test Pyramid

```
        /\
       /  \      E2E/Behavioral Tests (7 tests)
      /____\     Integration Tests (6 tests)
     /      \    Component Tests (24 tests)
    /________\   Unit Tests (10 tests)
```

### 1. **Unit Tests** (Domain Layer)
Testing business logic in isolation:

```typescript
// src/domain/usecases/__tests__/AddTodo.test.ts
it('should add a todo via repository', async () => {
    const mockRepo = { saveTodo: vi.fn() };
    const addTodo = new AddTodo(mockRepo);
    
    await addTodo.execute(mockTodo);
    
    expect(mockRepo.saveTodo).toHaveBeenCalledWith(mockTodo);
});
```

### 2. **Integration Tests** (Data Layer)
Testing repository implementations:

```typescript
// src/data/repositories/__tests__/LocalStorageTodoRepository.test.ts
it('should save and retrieve todos from localStorage', async () => {
    const repository = new LocalStorageTodoRepository();
    await repository.saveTodo(todo);
    
    const todos = await repository.getTodos();
    expect(todos).toContainEqual(todo);
});
```

### 3. **Component Tests** (Presentation Layer)
Testing UI components:

```typescript
// src/presentation/components/__tests__/TodoItem.test.tsx
it('should toggle todo completion on checkbox click', async () => {
    render(<TodoItem todo={mockTodo} onToggle={mockToggle} />);
    
    await user.click(screen.getByLabelText('Toggle todo'));
    
    expect(mockToggle).toHaveBeenCalledWith(mockTodo.id);
});
```

### 4. **Behavioral Tests** (End-to-End)
Testing user workflows:

```typescript
// src/presentation/__tests__/AppBehavior.test.tsx
it('should allow a user to add, complete, and delete a task', async () => {
    render(<App />);
    
    // Add task
    await user.click(screen.getByLabelText('Add Task'));
    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Buy Groceries');
    await user.click(screen.getByText('Create Task'));
    
    // Complete task
    await user.click(screen.getByLabelText('Toggle todo'));
    
    // Delete task
    await user.click(screen.getByLabelText('Delete'));
    
    expect(screen.queryByText('Buy Groceries')).not.toBeInTheDocument();
});
```

## ✨ Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete todos
- ✅ **Priority Levels**: High, Medium, Low
- ✅ **Categories**: Organize todos by category
- ✅ **Due Dates**: Set deadlines for tasks
- ✅ **Filtering**: View All, Active, or Completed todos
- ✅ **Search**: Find todos by text
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Persistence**: Data saved to localStorage
- ✅ **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd totoapp

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## 🎓 Learning Resources

### Clean Architecture
- [The Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture Book](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

### Key Concepts Demonstrated

1. **Dependency Inversion Principle (DIP)**
   - High-level modules (use cases) don't depend on low-level modules (repositories)
   - Both depend on abstractions (interfaces)

2. **Single Responsibility Principle (SRP)**
   - Each use case has one reason to change
   - Components are focused and cohesive

3. **Interface Segregation Principle (ISP)**
   - Repository interface defines only necessary methods
   - Clients depend only on methods they use

4. **Separation of Concerns**
   - Business logic isolated from UI
   - Data access isolated from business logic
   - Framework dependencies at the edges

## 📊 Test Coverage

Current test coverage: **96.44%**

```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
All files             |   96.44 |    84.50 |   96.72 |   96.93
 Domain Layer         |  100.00 |   100.00 |  100.00 |  100.00
 Data Layer           |  100.00 |    75.00 |  100.00 |  100.00
 Infrastructure       |   96.22 |    66.66 |  100.00 |   98.00
 Presentation         |   96.61 |    90.00 |   92.00 |   96.55
```

## 🔄 Data Flow

```
User Action (UI)
    ↓
React Component
    ↓
Custom Hook (useTodos)
    ↓
Use Case (AddTodo, GetTodos, etc.)
    ↓
Repository Interface
    ↓
Repository Implementation
    ↓
Data Source (localStorage)
```

## 🛠️ Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Animation**: Framer Motion

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! This project serves as a reference implementation of Clean Architecture in React.

### Areas for Enhancement
- Add API repository implementation
- Implement offline-first sync
- Add more use cases (bulk operations, undo/redo)
- Enhance error handling and validation
- Add accessibility improvements

---

**Built with ❤️ using Clean Architecture principles**
