# Contributing to N-400 Prep Companion

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/n400-prep-companion.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Branch Naming Conventions

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions or updates

## Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <subject>

<body>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure all tests pass: `npm run test:unit && npm run test:e2e`
3. Run linter: `npm run lint`
4. Run type checking: `npm run type-check`
5. Update documentation as needed
6. Submit PR with clear description of changes
7. Link related issues in the PR description

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Run Prettier for formatting
- Follow ESLint rules
- Write unit tests for new features
- Keep functions small and focused
- Use meaningful variable names

## Testing

- Write unit tests for all new functionality
- Ensure existing tests pass
- Aim for high code coverage
- Test edge cases

## Questions?

Feel free to open an issue for questions or discussions.
