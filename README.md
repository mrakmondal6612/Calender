# Calendar Application

A powerful, feature-rich calendar application with event management, todo system, search, export functionality, and more.

## Features

- **4 Calendar Views**: Month, Week, Day, and Agenda views
- **Event Management**: Create, edit, delete events with categories, colors, recurrence, reminders
- **Todo System**: Full task management with priorities, subtasks, categories, bulk operations
- **Search**: Real-time search across events and todos
- **Export**: Export data as CSV, iCalendar (.ics), JSON, or Print/PDF
- **Settings**: Customizable time format, week start, timezone, holidays, theme
- **Keyboard Shortcuts**: Ctrl+K for search, arrow keys for navigation, number keys for view switching
- **Data Persistence**: All data saved to localStorage
- **Dark Mode**: Light, dark, and system theme options

## Prerequisites

- Node.js (v18 or higher)
- npm or bun

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Preview production build
npm run preview
```

## Project Structure

- `src/components/calendar/` - Calendar components (views, modals, panels)
- `src/hooks/` - React hooks (useCalendar, useTodos, useSettings)
- `src/lib/` - Utility functions and types
- `src/pages/` - Page components
- `src/components/ui/` - shadcn/ui components

## Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- date-fns (date handling)
- Lucide React (icons)
- Sonner (toast notifications)
