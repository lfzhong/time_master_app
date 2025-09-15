# Time Tracker App

A modern, responsive React + TypeScript time tracking application with Firebase integration and mobile-optimized design.

## Features

- ⏱️ **Task Management**: Create, edit, prioritize, and categorize tasks
- 📊 **Time Tracking**: Real-time tracking with accurate time measurements
- 📈 **Statistics**: Detailed analytics and insights on time usage
- 🔥 **Firebase Integration**: Cloud-based data persistence and synchronization
- 📱 **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast**: Built with Vite for optimal development experience
- 🏷️ **Task Organization**: Priority levels, categories, and due dates
- 🔄 **Drag & Drop**: Reorder tasks with intuitive drag and drop
- 📅 **Date Management**: Set and track task due dates

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Firebase project (for cloud data storage)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd time-tracker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase config to `src/firebase.ts`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Usage

### Task Management (/tasks)
- **Add Tasks**: Create new tasks with title, priority, category, and due date
- **Edit Tasks**: Click on task titles to edit them inline
- **Start/Stop Tracking**: Click the play/stop button to begin/end time tracking
- **Set Priorities**: Assign high, medium, low, or no priority to tasks
- **Categorize Tasks**: Organize tasks with custom categories
- **Set Due Dates**: Add due dates to tasks for better planning
- **Reorder Tasks**: Drag and drop tasks to reorder them
- **Delete Tasks**: Remove tasks you no longer need

### Statistics (/stats)
- **Overview**: See total time, task count, and session statistics
- **Task Breakdown**: Detailed time analysis per task with percentages
- **Recent Sessions**: View your latest completed work sessions
- **Daily Summary**: Today's productivity metrics
- **Category Analysis**: Time spent per category
- **Priority Distribution**: Time allocation by priority level

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navigation.tsx  # Navigation bar component
│   ├── TaskForm.tsx    # Task creation form
│   ├── TaskItem.tsx    # Individual task component
│   └── TaskList.tsx    # Task list container
├── pages/             # Main application pages
│   ├── TasksPage.tsx  # Task management and time tracking
│   └── StatsPage.tsx  # Statistics and analytics
├── store/             # State management
│   └── TimeTrackerContext.tsx # React Context for app state
├── context/           # Context definitions
│   └── TimeTrackerContext.ts # Context type definitions
├── hooks/             # Custom React hooks
│   └── useTimeTracker.ts # Time tracker hook
├── services/          # External services
│   └── firestore.ts   # Firebase Firestore integration
├── types/             # TypeScript type definitions
│   └── index.ts       # App interfaces and types
├── utils/             # Utility functions
│   ├── time.ts        # Time formatting utilities
│   └── helpers.ts     # General helper functions
├── firebase.ts        # Firebase configuration
└── App.tsx           # Main application component
```

## Technologies Used

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side routing and navigation
- **Firebase** - Cloud-based data storage and synchronization
- **Firestore** - NoSQL database for real-time data
- **React Context** - State management and data flow

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
- Cloud-based data persistence with Firebase
- Cross-device synchronization

### Task Management
- **Inline Editing**: Click on task titles to edit them directly
- **Priority System**: High, medium, low, and none priority levels
- **Category Organization**: Create and manage custom categories
- **Due Date Management**: Set and track task deadlines
- **Drag & Drop**: Intuitive task reordering
- **Smart Sorting**: Sort by custom order, date, priority, or category

### Data Persistence
- Firebase Firestore for cloud storage
- Real-time synchronization across devices
- Automatic saving on every state change
- Offline support with data sync when online

### Mobile-First Design
- **Touch-Optimized**: Large touch targets for mobile devices
- **Responsive Layout**: Adaptive design for all screen sizes
- **Mobile Navigation**: Collapsible menu for mobile screens
- **Improved Spacing**: Optimized padding and margins for mobile
- **Better Typography**: Larger text sizes for mobile readability

### User Experience
- **Intuitive Interface**: Clean, modern design with clear visual hierarchy
- **Keyboard Shortcuts**: Enter to save, Escape to cancel
- **Visual Feedback**: Hover states, loading indicators, and transitions
- **Accessibility**: ARIA labels and keyboard navigation support

## Deployment

### Firebase Hosting (Recommended)
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Other Hosting Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs
