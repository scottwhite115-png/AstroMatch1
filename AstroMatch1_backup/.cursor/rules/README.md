# AstroMatch Cursor Rules

This directory contains Cursor IDE rules for the AstroMatch project.

## 📁 Rule Files

- **`astromatch-core.mdc`** - Core development principles (always applied)
- **`astromatch-frontend.mdc`** - React/UI development rules
- **`astromatch-supabase.mdc`** - Supabase integration rules
- **`astromatch-matching-engine.mdc`** - Astrological matching rules
- **`astromatch-data-fetching.mdc`** - SWR and data fetching patterns
- **`astromatch-anti-patterns.mdc`** - What to avoid (always applied)

## 🎯 How Cursor Rules Work

Each `.mdc` file contains:
- **Frontmatter**: Description, globs, and alwaysApply settings
- **Content**: Markdown-formatted rules and guidelines

## 📝 Adding New Rules

1. Create a new `.mdc` file in this directory
2. Use kebab-case naming: `your-rule-name.mdc`
3. Include proper frontmatter:
   ```yaml
   ---
   description: Short description of the rule's purpose
   globs: optional/path/pattern/**/*
   alwaysApply: false
   ---
   ```

## 🔄 Rule Application

- **alwaysApply: true** - Applied to all files
- **alwaysApply: false** - Applied only to files matching globs
- **globs** - File patterns to apply rules to

## 📋 Rule Categories

- **Core**: Project principles and standards
- **Frontend**: React components and UI
- **Supabase**: Database and authentication
- **Matching**: Astrological calculations
- **Data Fetching**: SWR patterns and API calls
- **Anti-patterns**: What to avoid
