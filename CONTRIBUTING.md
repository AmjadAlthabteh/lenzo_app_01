# Contributing to LuxAI

Thank you for your interest in contributing to LuxAI! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm ci`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** and test them locally
5. **Commit your changes** with clear commit messages
6. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Code Guidelines

### TypeScript
- Use TypeScript strict mode
- Avoid using `any` type - prefer proper typing
- Export types and interfaces for reusable components
- Use type inference where possible

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Add JSDoc comments for complex components

### Styling
- Prefer Tailwind utilities over custom CSS
- Use semantic color tokens from the theme
- Ensure responsive design (mobile-first)
- Test dark mode compatibility

### File Organization
- Components go in `src/components/` with PascalCase names
- Utilities go in `src/lib/`
- Types go in `src/types/`
- Keep files focused and under 300 lines when possible

### Naming Conventions
- **Components**: PascalCase (`CommandPalette.tsx`)
- **Utilities**: camelCase (`luxCommands.ts`)
- **Types**: PascalCase for interfaces and types
- **Constants**: UPPER_SNAKE_CASE

## Commit Messages

Write clear, concise commit messages following this format:

```
type: brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Example
```
feat: add scene scheduling functionality

- Add DatePicker component for schedule selection
- Implement schedule storage in local state
- Add validation for schedule conflicts
- Update Scene interface with schedule field
```

## Pull Request Process

1. **Update documentation** if you're adding new features
2. **Test your changes** thoroughly in development mode
3. **Run type checking** and linting before submitting
4. **Keep PRs focused** - one feature or fix per PR
5. **Write a clear PR description** explaining what and why
6. **Link related issues** using keywords like "Fixes #123"

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] Tested on different screen sizes
- [ ] No console errors or warnings
- [ ] Documentation updated if needed

## Testing

Currently, the project focuses on type safety and linting. When writing code:

- Test components visually in the browser
- Check for TypeScript errors: `npm run typecheck`
- Check for console errors and warnings
- Test across different browsers if possible
- Verify responsive behavior on mobile

## Code Review

All submissions require review. We'll provide feedback on:

- Code quality and style
- TypeScript type safety
- Performance considerations
- Accessibility compliance
- Security concerns

## Questions?

If you have questions or need clarification:

- Open an issue for discussion
- Check existing issues and PRs
- Review the README.md and docs/ folder

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to LuxAI! 🎨
