# Contributing to LuxAI

Thank you for your interest in contributing to LuxAI! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js >= 18.18 or 20+
- npm (comes with Node.js)
- Git

### Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/lighting-os.git
   cd lighting-os
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Before Making Changes

1. Read the TODO Protocol in `docs/TODO.md`
2. Review the code guidelines in `README.md`
3. Ensure your development environment is set up correctly

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code standards:
   - Use TypeScript strict mode
   - Prefer Tailwind utilities over custom CSS
   - Keep components in `src/components/` with PascalCase filenames
   - Follow the preflight → plan → implement → validate → document workflow

3. Test your changes:
   ```bash
   npm run lint      # Run ESLint
   npm run build     # Build the project
   npm run dev       # Test in development mode
   ```

### Code Standards

- **TypeScript**: Use strict mode, provide proper types
- **React**: Use functional components with hooks
- **Styling**: Tailwind CSS utilities preferred
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Performance**: Optimize images, lazy load heavy components
- **Security**: Never commit secrets or sensitive data

### Commit Messages

Follow conventional commits format:

```
feat: add new lighting scene composer
fix: resolve aurora animation performance issue
docs: update README with deployment instructions
style: improve button hover states
refactor: simplify command palette logic
test: add unit tests for scene generator
chore: update dependencies
```

### Pull Request Process

1. Update your branch with the latest `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Link to related issues

4. Ensure CI checks pass:
   - ESLint passes
   - Build succeeds
   - No TypeScript errors

5. Address review feedback and update your PR

## Project Structure

```
lighting-os/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles and theme tokens
│   ├── components/       # React components
│   ├── lib/              # Utilities and libraries
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── docs/                 # Documentation
└── tools/                # Build and dev tools
```

## Available Scripts

```bash
npm run dev       # Start dev server
npm run dev:3003  # Start dev server on port 3003
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run lux       # Run Luxin CLI tool
```

## Testing

Currently, the project uses:
- ESLint for code quality
- TypeScript for type checking
- Manual testing in development

We welcome contributions to add automated testing!

## Reporting Issues

When reporting issues, please include:

1. Clear description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots (for UI issues)
5. Environment details (OS, browser, Node version)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
