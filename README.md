# N-400 Prep Companion

A self-contained offline tool for U.S. citizenship (N-400) interview preparation.

## Features
- Visual timeline for tracking history
- Evidence locker with cloud link references
- Civics study flashcards (2008 version)
- Offline-first with manual export/import

## Usage
Visit [your-site.pages.dev] - no installation required.

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
npm run dev
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

### Testing
```bash
npm run test:unit
npm run test:e2e
```

## Project Structure
```
n400-prep-companion/
├── .github/workflows/     # CI/CD pipelines
├── src/
│   ├── components/       # React components
│   ├── data/            # Static data files
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── public/              # Static assets
└── tests/               # Test files
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License
MIT
