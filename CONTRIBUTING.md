# Contributing to CUET Lost & Found Box

Thank you for considering contributing to CUET Lost & Found Box! We welcome contributions from the community and are grateful for your support.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Style Guides](#style-guides)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for everyone. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Any conduct which could reasonably be considered inappropriate

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear and descriptive title
- Detailed steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Browser and OS information
- Error messages or console logs

**Example:**
```
**Title:** Search filter not working for "Electronics" category

**Description:**
When selecting "Electronics" from the category filter dropdown, 
no items are displayed even though there are 5 electronics items in the database.

**Steps to Reproduce:**
1. Navigate to search.html
2. Select "Electronics" from category dropdown
3. Click "Apply Filters"

**Expected:** Display 5 electronics items
**Actual:** No items displayed

**Browser:** Chrome 119.0
**OS:** Windows 11
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**Include these details:**
- Clear and descriptive title
- Detailed description of the proposed feature
- Explain why this enhancement would be useful
- List any alternative solutions you've considered
- Mockups or screenshots if applicable

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues perfect for beginners
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

---

## 💻 Development Setup

### Prerequisites

- Git
- Modern web browser
- Text editor (VS Code recommended)
- Basic knowledge of HTML, CSS, JavaScript

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/cuet-lost-found-box.git
   cd cuet-lost-found-box
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Set up local server**
   ```bash
   cd Frontend
   python -m http.server 8000
   # or use Live Server in VS Code
   ```

5. **Make your changes**
   - Edit files as needed
   - Test thoroughly in multiple browsers
   - Follow coding standards below

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill in the PR template

---

## 📏 Coding Standards

### HTML Guidelines

```html
<!-- ✅ Good -->
<div class="card">
    <h2 class="card-title">Item Name</h2>
    <p class="card-description">Description here</p>
</div>

<!-- ❌ Bad -->
<div class=card><h2>Item Name</h2><p>Description here</p></div>
```

**Rules:**
- Use semantic HTML5 elements
- Proper indentation (4 spaces)
- Close all tags
- Use lowercase for element and attribute names
- Add alt text to images
- Use meaningful class and ID names

### CSS Guidelines

```css
/* ✅ Good */
.search-container {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
}

/* ❌ Bad */
.sc{display:flex;gap:1rem;padding:1.5rem}
```

**Rules:**
- Use CSS custom properties (variables)
- Follow BEM naming convention where appropriate
- One selector per line for multiple selectors
- Properties on separate lines
- Use meaningful class names
- Group related properties
- Add comments for complex sections

### JavaScript Guidelines

```javascript
// ✅ Good
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ❌ Bad
function v(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
```

**Rules:**
- Use `const` and `let`, avoid `var`
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Use arrow functions for callbacks
- Follow camelCase naming
- Keep functions small and focused
- Handle errors properly
- Avoid global variables

### Commit Message Guidelines

Follow the conventional commits specification:

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance tasks

# Examples
feat(search): Add date range filter
fix(auth): Resolve login validation issue
docs(readme): Update installation instructions
style(css): Format navbar styles
refactor(report): Simplify form validation logic
```

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Check browser console for errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test responsive design on mobile devices
- [ ] Update documentation if needed
- [ ] Follow the coding standards
- [ ] Ensure no console.log() statements remain

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed:
- Browser tested: Chrome 119, Firefox 120
- Devices tested: Desktop, iPhone 12
- Test scenarios: ...

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No warnings in console
- [ ] Works on mobile devices
```

### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address review comments
4. Maintain clean commit history
5. Squash commits if requested
6. Merge only after approval

---

## 🐛 Reporting Bugs

### Security Vulnerabilities

⚠️ **Do NOT open public issues for security vulnerabilities.**

Instead, email security@cuet-lost-found.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 119]
- Version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information.
```

---

## 💡 Suggesting Enhancements

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Problem It Solves**
What problem does this feature address?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
What other solutions did you consider?

**Additional Context**
Mockups, examples, or related issues.
```

---

## 📝 Style Guides

### JavaScript Style Guide

- Use ES6+ features
- Prefer `const` over `let`
- Use template literals for strings
- Use async/await over promises
- Add error handling
- Write self-documenting code

### CSS Style Guide

- Mobile-first approach
- Use CSS Grid and Flexbox
- Prefer CSS custom properties
- Avoid !important
- Use relative units (rem, em, %)
- Follow existing color scheme

### Documentation Style Guide

- Use Markdown formatting
- Add code examples
- Include screenshots
- Keep language clear and concise
- Update table of contents
- Add cross-references

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Featured on project website (when available)

---

## ❓ Questions?

- Check [FAQ](docs/FAQ.md)
- Join our [Discord](https://discord.gg/cuet-lost-found) (when available)
- Email: dev@cuet-lost-found.com
- Open a discussion on GitHub

---

## 📚 Additional Resources

- [Frontend README](Frontend/README.md)
- [Quick Start Guide](Frontend/QUICKSTART.html)
- [Project Roadmap](docs/ROADMAP.md)
- [API Documentation](docs/API.md) (coming soon)

---

Thank you for contributing to making campus life easier for everyone! 🎓✨
