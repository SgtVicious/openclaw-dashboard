# Contributing to Mission Control

Thank you for your interest in contributing to Mission Control! We welcome contributions from the community and are pleased to have you join us.

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- PostgreSQL (for production) or SQLite (for development)

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/mission-control.git
   cd mission-control
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

5. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

## 📋 Types of Contributions

### 🐛 Bug Reports

Before creating bug reports, please check the existing issues to see if the problem has already been reported.

**Good bug reports include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or GIFs (if applicable)
- Environment details (OS, browser, Node version)

### 💡 Feature Requests

We love feature requests! Please provide:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Mockups or examples (if applicable)

### 🔧 Pull Requests

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests as needed

4. Update documentation if necessary

5. Commit with clear, descriptive messages:
   ```bash
   git commit -m "feat: add real-time notifications widget"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots of UI changes (if applicable)
   - Testing instructions

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Enable strict mode
- Define proper interfaces and types
- Avoid `any` type

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow the design system
- Ensure responsive design
- Support both light and dark themes

### Testing

- Write unit tests for utilities
- Write integration tests for API routes
- Write component tests for React components
- Aim for >80% code coverage

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

Example:
```
feat: add real-time notifications widget

- Implement WebSocket connection for real-time updates
- Add notification preferences UI
- Include sound and visual alerts
- Write comprehensive tests

Closes #123
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Writing Tests

- Use Jest for unit tests
- Use React Testing Library for component tests
- Use Playwright for e2e tests
- Write tests that focus on behavior, not implementation

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Update API documentation
- Include examples in documentation

## 🔍 Code Review Process

1. All submissions require review before merging
2. Reviewers will check for:
   - Code quality and style
   - Test coverage
   - Documentation updates
   - Performance implications
   - Security considerations

3. Address feedback promptly and professionally
4. Maintain a positive, collaborative tone

## 🏷️ Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority:high` - Urgent issues
- `priority:medium` - Important but not urgent
- `priority:low` - Nice to have

## 🎉 Recognition

Contributors are recognized in:
- Our README.md file
- Release notes
- Special thanks in documentation

## ❓ Questions?

If you have questions about contributing:
- Check our documentation
- Ask in discussions
- Join our Discord community
- Email us at contributors@mission-control.dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Mission Control better for everyone! 🚀