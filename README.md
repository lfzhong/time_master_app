# Time Tracker App

A modern React + TypeScript time tracking application with Tailwind CSS styling.

## Features

- ⏱️ **Task Management**: Create, start, stop, and delete tasks
- 📊 **Time Tracking**: Real-time tracking with accurate time measurements
- 📈 **Statistics**: Detailed analytics and insights on time usage
- 💾 **Local Storage**: Persistent data storage in browser
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast**: Built with Vite for optimal development experience

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd time-tracker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Usage

### Task Management (/tasks)
- **Add Tasks**: Create new tasks with title and optional description
- **Start/Stop Tracking**: Click Start to begin tracking time, Stop to end
- **View Progress**: See total time spent and current active status
- **Delete Tasks**: Remove tasks you no longer need

### Statistics (/stats)
- **Overview**: See total time, task count, and session statistics
- **Task Breakdown**: Detailed time analysis per task with percentages
- **Recent Sessions**: View your latest completed work sessions
- **Daily Summary**: Today's productivity metrics

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── Navigation.tsx  # Navigation bar component
├── pages/             # Main application pages
│   ├── TasksPage.tsx  # Task management and time tracking
│   └── StatsPage.tsx  # Statistics and analytics
├── store/             # State management
│   └── TimeTrackerContext.tsx # React Context for app state
├── types/             # TypeScript type definitions
│   └── index.ts       # App interfaces and types
├── utils/             # Utility functions
│   ├── time.ts        # Time formatting utilities
│   └── storage.ts     # Local storage management
└── App.tsx           # Main application component
```

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Context** - State management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Time Tracking
- Real-time timer updates every second
- Accurate time measurement using timestamps
- Automatic session recording when stopping tasks
- Persistent storage across browser sessions

### Data Persistence
- All data stored in browser's localStorage
- Automatic saving on every state change
- Data recovery on application restart

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly buttons and interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.