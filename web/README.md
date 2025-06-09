# Vibe Wiki Web Application

React-based frontend for the Vibe Wiki interactive whiteboard.

## Features

- Interactive canvas drawing interface
- Multiple drawing tools (pen, eraser, selection)
- Undo/Redo functionality
- Export selected areas as images

## Tech Stack

- React
- TypeScript
- Konva.js for canvas manipulation
- Jest + React Testing Library for testing

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

## Project Structure

```
web/
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main application component
├── __tests__/         # Test files
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Testing

The project uses Jest and React Testing Library for testing. Test files are located in the `__tests__` directory. Key test areas include:

- Tool selection and switching
- Drawing functionality
- Selection and export features
- Undo/Redo operations

Run tests with:
```bash
npm test
``` 