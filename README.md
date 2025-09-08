# LeadHub Web

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.2.

## Prerequisites

Before running this frontend application, you need to start the backend services first.

### Backend Services

The LeadHub Web frontend depends on the backend API services. Make sure to run the backend first:

**Backend Repository:** [LeadsHub_Services](https://github.com/InteractiveTechHub/LeadsHub_Services)

1. **Clone and run the backend services:**
   ```bash
   git clone https://github.com/InteractiveTechHub/LeadsHub_Services.git
   cd LeadsHub_Services
   docker-compose up -d
   ```

2. **Verify backend is running:**
   - The backend services should be accessible and running
   - Check that the API endpoints are responding

## Running with Docker

### Development Environment

To run the application in development mode using Docker:

```bash
# Build and run with development configuration
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at `http://localhost:80` (if using docker-compose.web.yml) or through the configured domain.

### Production Environment

To run the application in production mode:

```bash
# Using the production image
docker-compose -f docker-compose.web.yml up -d
```

### Docker Build Options

You can build the Docker image with different configurations:

```bash
# Development build
docker build --build-arg BUILD_ENV=development -t leadhub-web:dev .

# Production build (default)
docker build --build-arg BUILD_ENV=production -t leadhub-web:prod .
```

## Project Architecture

### Overview

LeadHub Web is a modern Angular 19 application built with a modular architecture that follows Angular best practices. The application is designed for lead management and sales pipeline tracking with real-time communication capabilities.

### Technology Stack

- **Frontend Framework**: Angular 19.2.7
- **UI Library**: PrimeNG 19.1.0 with custom themes
- **Styling**: SCSS with PrimeFlex 4.0.0
- **State Management**: RxJS with BehaviorSubjects
- **Real-time Communication**: SignalR 8.0.7
- **Internationalization**: ngx-translate 16.0.4
- **Authentication**: JWT with custom guards
- **Calendar**: FullCalendar 6.1.17
- **Date Handling**: date-fns 4.1.0

### Project Structure

```
src/app/
├── authentication/          # Authentication module
│   ├── login/              # Login component
│   ├── models/             # Auth models (LoginModel, RegisterModel, Token)
│   ├── services/           # AuthService
│   └── shared/             # Guards and interceptors
├── core/                   # Core functionality
│   ├── Dtos/               # Data Transfer Objects
│   ├── enums/              # Application enums
│   ├── interfaces/         # TypeScript interfaces
│   ├── models/             # Domain models
│   ├── requests/           # API request models
│   ├── responses/          # API response models
│   ├── services/           # Core services (SignalR, Chat, Date)
│   └── utils/              # Utility functions and PrimeNG modules
├── pages/                  # Feature pages
│   ├── admin/              # Admin management pages
│   ├── calendar/           # Calendar functionality
│   ├── dashboard/          # Dashboard page
│   ├── layout/             # Main layout component
│   ├── leads-manager/      # Lead management
│   └── salespipeline/      # Sales pipeline management
└── repository/             # Data access layer
    ├── channel.repository.ts
    ├── company.repository.ts
    ├── consultant.repository.ts
    ├── LeadManager.repository.ts
    ├── salesPipeline.repository.ts
    └── whatsapp.repository.ts
```

### Architecture Patterns

#### 1. Repository Pattern
The application uses a repository pattern for data access, providing a clean separation between the data layer and business logic:

- **CompanyRepository**: Manages company data and Brazilian CNPJ/CEP lookups
- **ConsultantRepository**: Handles consultant management
- **LeadManagerRepository**: Manages lead operations and timeline events
- **SalesPipelineRepository**: Handles sales pipeline and stage management
- **WhatsAppRepository**: Manages WhatsApp integration

#### 2. Service Layer
Core services provide business logic and cross-cutting concerns:

- **AuthService**: Authentication and authorization
- **SignalRService**: Real-time communication with SignalR
- **ChatMessageService**: Message management and state
- **DateFormaterService**: Date formatting utilities

#### 3. Guard-based Security
Route protection using Angular guards:

- **authGuard**: Protects authenticated routes
- **Role-based access**: Different access levels (SysAdmin, Owner, Support, Manager, Consultant)

#### 4. Modular Architecture
The application is organized into feature modules:

- **Authentication Module**: Complete auth functionality
- **Core Module**: Shared services and utilities
- **Pages Module**: Feature-specific components
- **Repository Module**: Data access layer

### Key Features

#### Real-time Communication
- **SignalR Integration**: Real-time updates for leads and messages
- **WebSocket Support**: Automatic reconnection and error handling
- **Event-driven Architecture**: Reactive updates using RxJS

#### Internationalization
- **Multi-language Support**: English (en-US) and Portuguese (pt-BR)
- **Dynamic Language Switching**: Runtime language changes
- **Localized Components**: PrimeNG components with translations

#### Responsive Design
- **Mobile-first Approach**: Responsive layout with PrimeFlex
- **Collapsible Sidebar**: Adaptive navigation
- **Modern UI Components**: PrimeNG component library

#### Data Management
- **Filter System**: Advanced filtering with operators and connectors
- **Pagination**: Efficient data loading
- **State Management**: Reactive state with RxJS

## Development server (Local)

**Important:** Make sure the backend services are running before starting the frontend development server.

To start a local development server without Docker, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
