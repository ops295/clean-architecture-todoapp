# Clean Architecture Todo App

A modern, minimal Todo App built with React and Clean Architecture.

## Architecture

The application follows the Clean Architecture principles, separating concerns into distinct layers:

```mermaid
graph TD
    subgraph Presentation Layer
        UI[React Components]
        ViewModel[Custom Hooks / ViewModels]
    end

    subgraph Domain Layer
        Entities[Entities (Todo)]
        UseCases[Use Cases (GetTodos, AddTodo...)]
        Interfaces[Repository Interfaces]
    end

    subgraph Data Layer
        RepoImpl[Repository Implementation]
        DataSource[Data Source (LocalStorage)]
    end

    subgraph Infrastructure Layer
        DI[Dependency Injection (Context)]
    end

    UI --> ViewModel
    ViewModel --> UseCases
    UseCases --> Interfaces
    UseCases --> Entities
    RepoImpl --> Interfaces
    RepoImpl --> DataSource
    DI --> RepoImpl
    DI --> UseCases
```

## Folder Structure

```
src/
├── domain/             # Business Logic (Inner Layer)
│   ├── entities/       # Core business objects
│   ├── repositories/   # Interfaces for data access
│   └── usecases/       # Application business rules
├── data/               # Data Access (Outer Layer)
│   └── repositories/   # Implementation of repositories
├── infrastructure/     # Frameworks & Drivers
│   └── di/             # Dependency Injection setup
└── presentation/       # UI Layer
    ├── components/     # React Components
    ├── hooks/          # ViewModels / Logic
    └── styles/         # Global styles & themes
```

## Features

- **Create/Edit/Delete Tasks**: Full CRUD operations.
- **Filters**: Filter by All, Active, Completed.
- **Dark Mode**: Toggle between light and dark themes.
- **Local Storage Sync**: Data persists across reloads.
- **Clean Architecture**: Decoupled and testable code structure.

## Getting Started

1. `npm install`
2. `npm run dev`
