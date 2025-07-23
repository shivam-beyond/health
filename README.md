# SISU Health Checker Frontend

A React-based web application for conducting health assessments through interactive questionnaires and providing personalized health insights.

## Features

- **Interactive Health Questionnaire**: Multi-step survey with smart question routing logic
- **Blood Pressure Simulator**: Tool for simulating blood pressure readings
- **Results Dashboard**: Visual presentation of health assessment results
- **Dark/Light Mode**: Toggleable theme preference with persistent state
- **Responsive Design**: Mobile-friendly interface for all devices

## Tech Stack

- **Framework**: React with Hooks + Context API for state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Custom CSS with theme support

## Project Structure

```
src/
├── assets/       # Static assets and constants
├── components/   # React components
│   ├── Header.jsx           # App header with dark mode toggle
│   ├── Footer.jsx           # App footer with copyright info
│   ├── Survey.jsx           # Main survey container
│   ├── Questionnaire.jsx    # Survey question form
│   ├── SingleChoice.jsx     # Single choice question component
│   ├── BPSimulator.jsx      # Blood pressure simulation tool
│   └── Results.jsx          # Results display component
├── reducers/     # State management reducers
├── services/     # API service layer
├── utils/        # Utility functions
├── App.jsx       # Main application component
└── index.css     # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   ```

2. Navigate to /fe and /be directories
   ```bash
   cd health-checker/fe
   cd health-checker/be
   ```

3. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your browser and navigate to http://localhost:5173

## Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed.
</ADDITIONAL_METADATA>

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to http://localhost:5173

## Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed.

## Development Workflow

- The application uses React's Context API for state management
- Survey questions are fetched from the API on initial load
- User responses are stored in the application state
- Navigation between questions is handled via the history stack

## API Integration

The frontend connects to health assessment APIs via the `healthService.js` module, which handles data fetching for:

- Survey questions
- Result submission
- Health insights

## Contributing

1. Create a feature branch from `main`
2. Implement your changes with appropriate tests
3. Submit a pull request for review

