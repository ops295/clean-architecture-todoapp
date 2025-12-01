# Clean Architecture & TDD Strategy

This project follows Clean Architecture principles. Below is the architectural diagram including the testing strategy (Behavior Driven Development).

```mermaid
graph TD
    subgraph "Presentation Layer (UI)"
        UI[React Components]
        Hooks[Custom Hooks]
        ViewModel[View Models / Context]
    end

    subgraph "Domain Layer (Business Logic)"
        Entities[Entities (Todo)]
        UseCases[Use Cases (AddTodo, GetTodos, etc.)]
        RepoInterface[Repository Interfaces]
    end

    subgraph "Data Layer (Infrastructure)"
        RepoImpl[Repository Implementation]
        DataSource[Data Source (LocalStorage/API)]
    end

    subgraph "Tests (TDD/BDD)"
        UnitTests[Unit Tests (Domain Logic)]
        IntegrationTests[Integration Tests (Data & Repos)]
        ComponentTests[Component Tests (UI Behavior)]
    end

    UI --> Hooks
    Hooks --> ViewModel
    ViewModel --> UseCases
    UseCases --> RepoInterface
    UseCases --> Entities
    RepoImpl ..|> RepoInterface
    RepoImpl --> DataSource

    UnitTests -.-> UseCases
    UnitTests -.-> Entities
    IntegrationTests -.-> RepoImpl
    ComponentTests -.-> UI
```

## Testing Strategy

### 1. Domain Layer (Unit Tests)
- **Focus**: Pure business logic.
- **What to test**: Use Cases and Entities.
- **Mocking**: Mock Repository interfaces.
- **Goal**: Ensure business rules are correct independent of UI or Database.

### 2. Data Layer (Integration Tests)
- **Focus**: Data persistence and retrieval.
- **What to test**: Repository implementations.
- **Mocking**: Mock external data sources (e.g., LocalStorage, API).
- **Goal**: Ensure data is correctly saved and retrieved.

### 3. Presentation Layer (Component/Behavior Tests)
- **Focus**: User interactions and UI state.
- **What to test**: Components and Hooks.
- **Mocking**: Mock Use Cases or Context.
- **Goal**: Ensure the app behaves as expected from a user's perspective.
