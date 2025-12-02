# Documentation Index

This directory contains comprehensive documentation for the Clean Architecture Todo App.

## Core Documentation

- **[README.md](../README.md)** - Main project overview, features, and getting started guide
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Deep dive into Clean Architecture implementation

## Advanced Guides

- **[ARCHITECTURE_EXPANSION.md](./ARCHITECTURE_EXPANSION.md)** - How the architecture grows from simple to complex while maintaining Clean Architecture principles
  - Phase-by-phase evolution diagrams
  - Folder structure expansion
  - Decorator pattern for feature stacking
  - Timeline of architectural growth

- **[REDUX_API_INTEGRATION.md](./REDUX_API_INTEGRATION.md)** - Integrating Redux and Backend API
  - Redux as presentation layer state management
  - API repository implementation
  - Hybrid offline-first repository
  - Configuration-based repository selection
  - Complete code examples

## Quick Links

### For Learning Clean Architecture
1. Start with [README.md](../README.md) - Understand the basics
2. Read [ARCHITECTURE.md](../ARCHITECTURE.md) - Deep dive into layers
3. Study [ARCHITECTURE_EXPANSION.md](./ARCHITECTURE_EXPANSION.md) - See how it scales

### For Implementation
1. [REDUX_API_INTEGRATION.md](./REDUX_API_INTEGRATION.md) - Add Redux and API support
2. [ARCHITECTURE_EXPANSION.md](./ARCHITECTURE_EXPANSION.md) - Understand expansion patterns

## Key Concepts

### The Dependency Rule
> Source code dependencies must point only inward, toward higher-level policies.

### The Onion Architecture
```
┌─────────────────────────────────┐
│    Presentation Layer           │
│  ┌───────────────────────────┐  │
│  │  Infrastructure Layer     │  │
│  │  ┌─────────────────────┐  │  │
│  │  │   Data Layer        │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │ Domain Layer  │  │  │  │
│  │  │  │   (Core)      │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Core Principles

1. **Independence** - Business logic independent of frameworks
2. **Testability** - Easy to test at every layer
3. **Flexibility** - Swap implementations without breaking core
4. **Maintainability** - Clear separation of concerns

## Contributing

When adding new features, remember:
- ✅ Domain layer should remain framework-agnostic
- ✅ Add new implementations in outer layers
- ✅ Use dependency injection for wiring
- ✅ Maintain the dependency rule
- ✅ Write tests at appropriate layers

## Resources

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture Book](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
