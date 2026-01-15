# Claude Code Configuration for N-400 Prep Companion

## Project Overview

This is an **offline-first U.S. citizenship (N-400) interview preparation tool** built with React, TypeScript, and modern web technologies. The application helps users prepare for their naturalization interview through:

- **Visual Timeline**: Track personal history and important dates
- **Evidence Locker**: Organize documents with cloud link references
- **Civics Flashcards**: Study the 2008 version of civics questions
- **Offline Capability**: Works without internet, manual export/import for data portability

## Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (likely, based on modern React practices)
- **State Management**: React hooks and context
- **Storage**: LocalStorage for offline-first architecture
- **Testing**: Vitest (unit) and Playwright/Cypress (e2e)
- **Deployment Target**: Cloudflare Pages (*.pages.dev)

## Development Workflow (Boris Cherney's Best Practices)

### Core Principles

1. **Plan Mode First**: Before making edits, align on approach
   - Break down complex tasks into clear steps
   - Discuss architecture decisions before implementation
   - Identify potential issues early

2. **Tight Feedback Loop**: Set up automated browser testing
   - Run changes in browser after each edit
   - Verify UI works and "feels good"
   - Use Claude Chrome extension for automated verification
   - Iterate until the result is correct

3. **Parallel Sessions**: Run 5-10 browser sessions simultaneously
   - Maximize throughput on independent tasks
   - Accept that some sessions may hit unexpected issues
   - Focus on net productivity gains

### Safety and Best Practices

1. **Verification Before Commit**: 
   - Always test changes in browser before committing
   - Verify all features still work as expected
   - Check for console errors and warnings

2. **Incremental Changes**:
   - Make small, focused commits
   - Test after each logical change
   - Don't batch too many changes without testing

3. **Context Management**:
   - Focus on one feature/component at a time
   - Keep related code changes together
   - Reference existing patterns in the codebase

## Project Structure

```
n400-prep-companion/
├── .github/workflows/   # CI/CD pipelines
├── src/
│   ├── components/      # React components
│   ├── data/           # Static data files (civics questions, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── public/             # Static assets
├── tests/              # Test files
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Key Commands

```bash
npm install           # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run test:unit    # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

## Critical Considerations

### Data Privacy & Security
- **No backend**: All data stays in browser localStorage
- **No authentication**: Completely offline-first
- **Manual data export/import**: Users control their data
- **Sensitive information**: Handle immigration data with care

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Ensure localStorage availability
- Handle quota exceeded errors gracefully

### Offline-First Design
- All features must work without internet
- Cloud links in evidence locker are reference-only
- Export functionality must be reliable

### Accessibility
- Ensure keyboard navigation works
- Provide ARIA labels where needed
- Support screen readers for interview prep

## Current Development Phase

This project is in the **porting phase** from a Gemini AI Canvas application to a standalone React app. Key tasks:

1. ✅ Set up project structure
2. ✅ Configure TypeScript and build tools
3. ✅ Add CI/CD workflow
4. 🚧 Port Gemini components to React
5. ⏳ Implement offline storage
6. ⏳ Add data export/import
7. ⏳ Create comprehensive test coverage

## Working with Claude Code

### When to Use Plan Mode
- Adding new major features
- Refactoring components
- Changing data structures
- Modifying build configuration

### When to Auto-Accept Edits
- Bug fixes in existing code
- Style adjustments
- Adding tests
- Documentation updates

### Context to Always Include
- `package.json` for dependencies
- `tsconfig.json` for TypeScript config
- Relevant component files
- Related type definitions
- Test files when modifying features

### Red Flags to Watch For
- localStorage quota exceeded
- Breaking changes to data structure (affects existing users)
- Missing error handling for offline scenarios
- Accessibility regressions
- TypeScript type errors
- Test failures

## Testing Strategy

1. **Unit Tests**: Test utilities, hooks, and business logic
2. **Component Tests**: Test React components in isolation
3. **Integration Tests**: Test feature workflows
4. **E2E Tests**: Test complete user journeys in browser
5. **Manual Testing**: Verify offline behavior and data persistence

## Deployment

- **Platform**: Cloudflare Pages
- **Branch Strategy**: 
  - `main` branch → production
  - `feature/*` branches → preview deployments
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

## Questions to Ask Before Major Changes

1. Will this affect existing user data in localStorage?
2. Does this work offline?
3. Is this accessible?
4. Have I tested in the browser?
5. Are there TypeScript errors?
6. Do tests pass?
7. Is this documented?

## Communication Preferences

- Be direct and concise
- Focus on practical solutions
- Explain tradeoffs when relevant
- Ask for clarification if project context is unclear
- Propose alternatives when you see potential issues

---

**Remember**: This app helps real people prepare for a life-changing interview. Quality, reliability, and user experience matter.
