# TeamView

## Overview
TeamView is an Angular application that displays bug metrics and ticket information using interactive charts. Built with Angular 20.3.0, PrimeNG, and Chart.js, it provides a visual dashboard for tracking bug-related data.

## Project Information
- **Framework**: Angular CLI 20.3.7
- **Language**: TypeScript 5.9.2
- **UI Library**: PrimeNG 20.2.0 with Aura theme
- **Charts**: Chart.js 4.5.1
- **Started**: October 29, 2025

## Architecture

### Project Structure
```
src/
├── app/
│   ├── components/        # Reusable chart components
│   │   └── chart/         # Bar, polar, and menu charts
│   ├── features/          # Feature modules
│   │   ├── bugs/          # Bug tracking features
│   │   │   ├── bug-metrics/   # Bug metrics display
│   │   │   ├── bug-tickets/   # Bug ticket list
│   │   │   ├── services/      # Bug data services
│   │   │   └── models/        # Bug data models
│   │   └── teams/         # Team-related features
│   ├── app.ts             # Root component
│   ├── app.config.ts      # App configuration
│   └── app.routes.ts      # Routing configuration
└── index.html
```

### Key Features
- Bug ticket visualization with interactive charts
- Bug metrics tracking and display
- PrimeNG component integration
- Zoneless change detection (modern Angular)
- Responsive dashboard layout

### Services
- **TicketService**: Manages bug ticket data
- **TicketStoreService**: State management for tickets
- **BugPortFactory**: Factory for creating bug data adapters
- Includes Azure DevOps integration ports

## Development

### Running the Application
The application runs automatically via the Server workflow:
- **Port**: 5000 (configured for Replit)
- **Host**: 0.0.0.0 (allows proxy access)
- **Command**: `npx ng serve`

### Configuration Notes
- Analytics disabled in angular.json
- All hosts allowed for Replit proxy compatibility
- Development mode enabled by default
- Source maps enabled for debugging

### Build System
- Uses Angular's latest application builder
- SCSS for styling
- Production build includes optimization and hashing
- Development build includes source maps

## Dependencies

### Main Dependencies
- Angular ecosystem (core, common, forms, router, platform-browser)
- PrimeNG UI components with themes
- Chart.js for data visualization
- RxJS for reactive programming

### Dev Dependencies
- Angular CLI and build tools
- TypeScript compiler
- Karma test runner with Jasmine
- Chrome launcher for testing

## Recent Changes
- **2025-10-29**: Initial Replit setup
  - Configured Angular dev server for port 5000
  - Set host to 0.0.0.0 and enabled all hosts
  - Installed npm dependencies
  - Verified application runs successfully
  - Server workflow configured and tested

## Notes
- The app uses zoneless change detection (modern Angular approach)
- Mock data is available in features/bugs/mock/tickets.ts
- Azure DevOps integration ports are present but may need configuration
- TailwindCSS warning in console (loaded via CDN, should be installed for production)
