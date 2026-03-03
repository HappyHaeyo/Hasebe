# CLAUDE.md — AI Assistant Guide for Hasebe

This file provides instructions and context for AI assistants (Claude Code and others) working in this repository.

---

## Repository Overview

**Repository:** HappyHaeyo/Hasebe
**Current state:** Early / initial setup (one commit, one file)
**Primary branch:** `master`

The project is in its earliest stage. The only file currently present is `README.md`, which contains a placeholder heading. This document will be updated as the project grows.

---

## Repository Structure

```
Hasebe/
├── README.md      # Project overview (currently a placeholder)
└── CLAUDE.md      # This file — AI assistant guide
```

As files and directories are added, update the tree above to reflect the current layout.

---

## Git Workflow

### Branch naming

Feature and task branches must follow this pattern:

```
claude/<descriptive-slug>-<session-id>
```

Example: `claude/claude-md-mmb0ciui4gm6qhjl-dqDGD`

- Always develop on the designated feature branch, never directly on `master`.
- Create the branch locally if it does not already exist before making commits.

### Pushing changes

```bash
git push -u origin <branch-name>
```

- If push fails due to a network error, retry up to 4 times with exponential backoff (2 s, 4 s, 8 s, 16 s).
- Do **not** push to a branch other than the one designated for the current session without explicit permission from the user.

### Commit messages

- Use the imperative mood: "Add feature", "Fix bug", "Update docs".
- Keep the subject line under 72 characters.
- Add a blank line followed by a body paragraph when extra context is needed.
- Do not amend published commits; create new commits instead.

### Safety rules

- Never force-push to `master`.
- Never skip commit hooks (`--no-verify`).
- Never commit files that may contain secrets (`.env`, credential files, private keys).

---

## Development Conventions

Because the project has no language or framework committed yet, the conventions below are placeholders. **Update this section immediately when the tech stack is decided.**

| Concern | Convention |
|---|---|
| Language | TBD |
| Package manager | TBD |
| Linter / formatter | TBD |
| Test framework | TBD |
| CI system | TBD |

### General code style principles (apply regardless of language)

- Prefer clarity over cleverness.
- Avoid over-engineering: do not add abstractions, helpers, or configurability that are not required right now.
- Do not add docstrings, comments, or type annotations to code that was not changed.
- Only validate input at system boundaries (user input, external APIs); trust internal contracts.
- Delete unused code rather than commenting it out or adding backwards-compat shims.

---

## Working with AI Assistants

### Before making changes

1. Read the files you plan to modify; never propose changes to code you have not read.
2. Check for an existing implementation before creating a new file.
3. Understand the existing patterns in the codebase before suggesting modifications.

### Scope of changes

- Only make changes that are directly requested or clearly necessary for the task.
- A bug fix should not trigger surrounding refactors or style cleanups.
- A simple feature does not need extra configurability or feature flags.

### Security

- Do not introduce command injection, XSS, SQL injection, or other OWASP Top 10 vulnerabilities.
- Fix any security issues immediately upon noticing them.

### Risky / irreversible actions

Always confirm with the user before:

- Deleting files or branches.
- Dropping database tables or data.
- Force-pushing or hard-resetting git history.
- Pushing to remote branches (unless instructed up-front).
- Modifying CI/CD pipelines or shared infrastructure.

---

## Updating This File

Whenever a significant change is made to the project — new language or framework adopted, CI added, directory structure changed, coding conventions established — update the relevant sections of this file as part of that same commit or PR.
