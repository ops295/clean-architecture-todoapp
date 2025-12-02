# Clean Architecture Expansion Guide

## How the Architecture Grows While Respecting Clean Architecture Principles

This document shows how the architecture **expands** from a simple app to a complex system while maintaining the **Dependency Rule**.

---

## The Core Principle: Onion Architecture Expansion

```
Simple App                    Complex App
    
   ┌─────┐                 ┌───────────────┐
   │ UI  │                 │   UI Layer    │
   └─────┘                 │  + Redux      │
      ↓                    │  + Sagas      │
   ┌─────┐                 └───────────────┘
   │Core │                        ↓
   └─────┘                 ┌───────────────┐
      ↓                    │ Infrastructure│
   ┌─────┐                 │  + DI         │
   │Local│                 │  + Config     │
   └─────┘                 │  + Middleware │
                           └───────────────┘
                                  ↓
                           ┌───────────────┐
                           │  Data Layer   │
                           │  + API        │
                           │  + Cache      │
                           │  + Sync       │
                           └───────────────┘
                                  ↓
                           ┌───────────────┐
                           │ DOMAIN (SAME!)│
                           │  Use Cases    │
                           │  Entities     │
                           │  Interfaces   │
                           └───────────────┘
```

**Key Insight**: The domain core **never changes**. We add **new outer layers**.

---

## Phase 1: Current Architecture (Simple)

### Layer Diagram

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  ┌─────────────────────────────────┐   │
│  │    React Components + Hooks     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────────┐
│      Infrastructure Layer               │
│  ┌─────────────────────────────────┐   │
│  │      React Context (DI)         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓ injects
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  ┌─────────────────────────────────┐   │
│  │  LocalStorageTodoRepository     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓ implements
┌─────────────────────────────────────────┐
│    DOMAIN LAYER (Core)                  │
│  ┌─────────────────────────────────┐   │
│  │  Use Cases (AddTodo, GetTodos)  │   │
│  │  Entities (Todo)                │   │
│  │  Repository Interface           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Folder Structure

```
src/
├── domain/              # ← CORE (never changes)
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── data/                # ← Simple implementation
│   └── repositories/
│       └── LocalStorageTodoRepository.ts
├── infrastructure/      # ← Simple DI
│   └── di/
│       └── TodoContext.tsx
└── presentation/        # ← Simple UI
    ├── components/
    └── hooks/
```

---

## Phase 2: Add Backend API (Expanding Data Layer)

### New Layer Diagram

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (UNCHANGED)                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Infrastructure Layer               │
│  ┌─────────────────────────────────┐   │
│  │  Context + Repository Factory   │   │ ← NEW: Factory pattern
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Data Layer (EXPANDED)           │
│  ┌─────────────────────────────────┐   │
│  │  LocalStorageTodoRepository     │   │
│  │  ApiTodoRepository         ← NEW│   │
│  │  HybridTodoRepository      ← NEW│   │
│  │  CachingDecorator          ← NEW│   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    DOMAIN LAYER (UNCHANGED!)            │
│  Same interface, same use cases         │
└─────────────────────────────────────────┘
```

### Expanded Folder Structure

```
src/
├── domain/              # ← UNCHANGED
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── data/                # ← EXPANDED
│   └── repositories/
│       ├── LocalStorageTodoRepository.ts
│       ├── ApiTodoRepository.ts        ← NEW
│       ├── HybridTodoRepository.ts     ← NEW
│       ├── CachingTodoRepository.ts    ← NEW
│       └── decorators/                 ← NEW
│           └── CachingDecorator.ts
├── infrastructure/      # ← EXPANDED
│   ├── di/
│   │   └── TodoContext.tsx
│   ├── config/                         ← NEW
│   │   ├── environment.ts
│   │   └── repositoryFactory.ts
│   └── http/                           ← NEW
│       └── apiClient.ts
└── presentation/        # ← UNCHANGED
    ├── components/
    └── hooks/
```

### What Changed?

✅ **Added**: Multiple repository implementations  
✅ **Added**: Configuration layer  
✅ **Added**: HTTP client infrastructure  
❌ **NOT Changed**: Domain layer (use cases, entities, interfaces)  
❌ **NOT Changed**: Presentation layer (components still call same use cases)

---

## Phase 3: Add Redux (Expanding Presentation Layer)

### New Layer Diagram

```
┌─────────────────────────────────────────┐
│    Presentation Layer (EXPANDED)        │
│  ┌─────────────────────────────────┐   │
│  │  Components                     │   │
│  │  Redux Store + Slices      ← NEW│   │
│  │  Redux Thunks              ← NEW│   │
│  │  Selectors                 ← NEW│   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Infrastructure Layer (EXPANDED)        │
│  ┌─────────────────────────────────┐   │
│  │  Redux Store Config        ← NEW│   │
│  │  Redux Middleware          ← NEW│   │
│  │  Repository Factory             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Data Layer                      │
│         (UNCHANGED from Phase 2)        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    DOMAIN LAYER (STILL UNCHANGED!)      │
└─────────────────────────────────────────┘
```

### Expanded Folder Structure

```
src/
├── domain/              # ← STILL UNCHANGED
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── data/                # ← Same as Phase 2
│   └── repositories/
│       ├── LocalStorageTodoRepository.ts
│       ├── ApiTodoRepository.ts
│       ├── HybridTodoRepository.ts
│       └── CachingTodoRepository.ts
├── infrastructure/      # ← EXPANDED
│   ├── di/
│   │   └── TodoContext.tsx
│   ├── config/
│   │   ├── environment.ts
│   │   └── repositoryFactory.ts
│   ├── store/                          ← NEW
│   │   ├── configureStore.ts
│   │   └── middleware/
│   └── http/
│       └── apiClient.ts
└── presentation/        # ← EXPANDED
    ├── components/
    ├── hooks/
    └── store/                          ← NEW
        ├── slices/
        │   └── todoSlice.ts
        └── selectors/
            └── todoSelectors.ts
```

### What Changed?

✅ **Added**: Redux store, slices, middleware  
✅ **Added**: Store configuration in infrastructure  
❌ **NOT Changed**: Domain layer  
❌ **NOT Changed**: Data layer  
❌ **NOT Changed**: Use cases still called by thunks

---

## Phase 4: Add Advanced Features (Full Expansion)

### Complete Layer Diagram

```
┌───────────────────────────────────────────────┐
│         Presentation Layer                    │
│  ┌─────────────────────────────────────────┐ │
│  │  Components                             │ │
│  │  Redux Store + Slices                   │ │
│  │  Redux Saga/Thunks                      │ │
│  │  Selectors + Reselect                   │ │
│  │  UI State Management              ← NEW│ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│    Infrastructure Layer (Orchestration)       │
│  ┌─────────────────────────────────────────┐ │
│  │  Redux Store Configuration              │ │
│  │  Middleware (Logging, Analytics)   ← NEW│ │
│  │  Repository Factory                     │ │
│  │  Service Locator                   ← NEW│ │
│  │  Event Bus                         ← NEW│ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│         Data Layer (Multiple Sources)         │
│  ┌─────────────────────────────────────────┐ │
│  │  Repositories:                          │ │
│  │    - API Repository                     │ │
│  │    - LocalStorage Repository            │ │
│  │    - IndexedDB Repository          ← NEW│ │
│  │    - WebSocket Repository          ← NEW│ │
│  │  Decorators:                            │ │
│  │    - Caching Decorator                  │ │
│  │    - Retry Decorator               ← NEW│ │
│  │    - Logging Decorator             ← NEW│ │
│  │  Data Sources:                          │ │
│  │    - HTTP Client                        │ │
│  │    - WebSocket Client              ← NEW│ │
│  │    - Storage Adapters              ← NEW│ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│    DOMAIN LAYER (STILL THE SAME CORE!)        │
│  ┌─────────────────────────────────────────┐ │
│  │  Entities (Todo)                        │ │
│  │  Use Cases (AddTodo, GetTodos, etc.)    │ │
│  │  Repository Interface (ONE interface)   │ │
│  │  Business Rules                         │ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

### Complete Folder Structure

```
src/
├── domain/                    # ← CORE (never touched!)
│   ├── entities/
│   │   └── Todo.ts
│   ├── repositories/
│   │   └── TodoRepository.ts  # ← Same interface!
│   └── usecases/
│       ├── AddTodo.ts
│       ├── GetTodos.ts
│       ├── UpdateTodo.ts
│       └── DeleteTodo.ts
│
├── data/                      # ← Expanded with options
│   ├── repositories/
│   │   ├── LocalStorageTodoRepository.ts
│   │   ├── ApiTodoRepository.ts
│   │   ├── IndexedDBTodoRepository.ts    ← NEW
│   │   ├── WebSocketTodoRepository.ts    ← NEW
│   │   └── HybridTodoRepository.ts
│   ├── decorators/                        ← NEW
│   │   ├── CachingDecorator.ts
│   │   ├── RetryDecorator.ts
│   │   └── LoggingDecorator.ts
│   └── datasources/                       ← NEW
│       ├── http/
│       │   └── apiClient.ts
│       ├── websocket/
│       │   └── wsClient.ts
│       └── storage/
│           ├── localStorage.ts
│           └── indexedDB.ts
│
├── infrastructure/            # ← Orchestration layer
│   ├── di/
│   │   ├── container.ts                   ← NEW: DI Container
│   │   └── TodoContext.tsx
│   ├── config/
│   │   ├── environment.ts
│   │   ├── repositoryFactory.ts
│   │   └── featureFlags.ts                ← NEW
│   ├── store/
│   │   ├── configureStore.ts
│   │   └── middleware/
│   │       ├── logger.ts                  ← NEW
│   │       ├── analytics.ts               ← NEW
│   │       └── sync.ts                    ← NEW
│   ├── events/                            ← NEW
│   │   └── eventBus.ts
│   └── monitoring/                        ← NEW
│       ├── errorTracking.ts
│       └── performance.ts
│
└── presentation/              # ← Rich UI layer
    ├── components/
    │   ├── TodoList.tsx
    │   ├── TodoItem.tsx
    │   ├── AddTodoModal.tsx
    │   └── ... (same components)
    ├── hooks/
    │   ├── useTodos.ts
    │   └── useOptimisticUpdates.ts        ← NEW
    ├── store/
    │   ├── slices/
    │   │   ├── todoSlice.ts
    │   │   ├── uiSlice.ts                 ← NEW
    │   │   └── syncSlice.ts               ← NEW
    │   └── selectors/
    │       └── todoSelectors.ts
    └── sagas/                             ← NEW (if using Redux Saga)
        └── todoSagas.ts
```

---

## The Expansion Pattern: Decorator Pattern

### How Features Stack Without Changing Core

```typescript
// Domain layer - NEVER CHANGES
interface TodoRepository {
    getTodos(): Promise<Todo[]>;
    saveTodo(todo: Todo): Promise<void>;
}

// Data layer - ADD decorators
class CachingDecorator implements TodoRepository {
    constructor(private wrapped: TodoRepository) {}
    
    async getTodos(): Promise<Todo[]> {
        // Add caching logic
        const cached = cache.get('todos');
        if (cached) return cached;
        
        const todos = await this.wrapped.getTodos();
        cache.set('todos', todos);
        return todos;
    }
}

class RetryDecorator implements TodoRepository {
    constructor(private wrapped: TodoRepository) {}
    
    async getTodos(): Promise<Todo[]> {
        // Add retry logic
        for (let i = 0; i < 3; i++) {
            try {
                return await this.wrapped.getTodos();
            } catch (error) {
                if (i === 2) throw error;
                await delay(1000 * i);
            }
        }
    }
}

class LoggingDecorator implements TodoRepository {
    constructor(private wrapped: TodoRepository) {}
    
    async getTodos(): Promise<Todo[]> {
        console.log('Fetching todos...');
        const result = await this.wrapped.getTodos();
        console.log(`Fetched ${result.length} todos`);
        return result;
    }
}

// Infrastructure - COMPOSE decorators
const repository = new LoggingDecorator(
    new RetryDecorator(
        new CachingDecorator(
            new ApiTodoRepository('https://api.example.com')
        )
    )
);
```

**Result**: Features stack like layers without modifying the core!

---

## Key Architectural Principles During Expansion

### 1. **The Domain Core is Sacred**

```
❌ WRONG: Modifying domain for new features
✅ RIGHT: Adding new outer layers

Domain Layer:
  ✅ Add new use cases (if new business logic)
  ✅ Add new entities (if new concepts)
  ❌ Don't add framework dependencies
  ❌ Don't add infrastructure concerns
```

### 2. **Dependencies Point Inward**

```
Presentation → Infrastructure → Data → Domain
    ✅              ✅           ✅       ✅
    
Domain → Data
  ❌ NEVER!
```

### 3. **New Features = New Implementations**

```
Need caching?     → Add CachingDecorator (Data layer)
Need Redux?       → Add Redux (Presentation layer)
Need WebSockets?  → Add WsRepository (Data layer)
Need analytics?   → Add Middleware (Infrastructure layer)

Domain layer?     → UNCHANGED!
```

### 4. **Configuration Over Modification**

```typescript
// DON'T modify code
// DO configure behavior

const repository = createRepository({
    type: 'hybrid',
    cache: true,
    retry: true,
    logging: true,
});

// Same interface, different behavior!
```

---

## Evolution Timeline

```
Week 1: Simple App
  └─ LocalStorage + React Context

Month 1: Add API
  └─ ApiRepository + Factory pattern

Month 3: Add Redux
  └─ Redux Store + Thunks calling use cases

Month 6: Add Offline Support
  └─ HybridRepository + Sync logic

Year 1: Add Real-time
  └─ WebSocketRepository + Event bus

Year 2: Add Advanced Features
  └─ Caching, Retry, Analytics, Monitoring
  
Domain Layer: STILL THE SAME AFTER 2 YEARS!
```

---

## Summary: How Architecture Expands

### The Pattern

1. **Identify the layer** where the feature belongs
2. **Add new implementation** in that layer
3. **Keep domain layer unchanged**
4. **Use dependency injection** to wire it up

### The Layers Grow

- **Presentation**: Add Redux, Sagas, complex UI state
- **Infrastructure**: Add middleware, event bus, monitoring
- **Data**: Add new repositories, decorators, data sources
- **Domain**: Add new use cases ONLY for new business logic

### The Core Stays Pure

```
┌─────────────────────────────────────┐
│  Complex Outer Layers               │
│  (Redux, API, Cache, WebSocket)     │
│    ┌─────────────────────────────┐  │
│    │  Simple Core                │  │
│    │  (Use Cases, Entities)      │  │
│    │  NEVER CHANGES              │  │
│    └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

**This is Clean Architecture in action**: The system grows in complexity, but the core business logic remains simple, testable, and independent.
