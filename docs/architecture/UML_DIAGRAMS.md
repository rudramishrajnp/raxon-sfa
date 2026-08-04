# UML Diagrams

## 1. Component Diagram
```mermaid
componentDiagram
    component [Flutter UI] as UI
    component [Riverpod State] as State
    component [Repositories] as Repos
    component [Dio Network Client] as Net
    component [Drift SQLite] as DB
    
    UI --> State
    State --> Repos
    Repos --> Net
    Repos --> DB
```

## 2. Package Diagram
```mermaid
graph TD
    subgraph lib
        core[core/]
        features[features/]
        shared[shared_widgets/]
    end
    
    subgraph features
        auth[auth]
        mtp[mtp]
        dcr[dcr]
    end
    
    features --> core
    features --> shared
    auth --> core
```

## 3. Class Diagram (Partial)
```mermaid
classDiagram
    class User {
        +UUID id
        +String name
        +String role
        +login()
        +logout()
    }
    class Role {
        +String name
        +List permissions
    }
    User "*" -- "1" Role : has
```
*(Other diagrams such as Sequence and Activity are covered in FLOW_DIAGRAMS.md)*
