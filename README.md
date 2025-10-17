# @adddog/design-tokens

A configurable design token library built on [Style Dictionary](https://amzn.github.io/style-dictionary/) with CLI support for generating themes, colors, and design system tokens.

## Features

- 🎨 **Dynamic theme generation** from configuration files
- 🔧 **CLI tool** for building and managing tokens
- 🎯 **Multiple output formats**: CSS, SCSS, TypeScript, JSON
- 🌗 **Theme inheritance** for easy variant creation
- 👀 **Watch mode** for automatic rebuilds
- ✅ **Built-in validation** for configuration
- 📦 **Programmatic API** for advanced usage

## Installation

```bash
npm install @adddog/design-tokens
# or
pnpm add @adddog/design-tokens
# or
yarn add @adddog/design-tokens
```

## Quick Start

### 1. Initialize Configuration

```bash
npx design-tokens init
```

This creates a `design-tokens.config.ts` (or `.js`, `.mjs`) file in your project.

### 2. Define Your Themes

Edit the generated config file:

```typescript
import { defineConfig } from '@adddog/design-tokens';

export default defineConfig({
  themes: [
    {
      name: 'light',
      colors: {
        primary0: '#ffffff',
        primary500: '#6E7076',
        primary950: '#000000',
        accent500: '#2C42D3',
        // ... more color tokens
      }
    },
    {
      name: 'dark',
      extends: 'light', // Inherit from light theme
      colors: {
        primary0: '#000000',
        primary950: '#ffffff',
        // Only override what's different
      }
    }
  ],
  output: {
    directory: './tokens',
    formats: ['css', 'scss', 'ts'],
    prefix: 'dt',
  },
});
```

### 3. Build Your Tokens

```bash
npx design-tokens build
```

This generates token files in your specified output directory:
- `tokens/light.css`
- `tokens/dark.css`
- `tokens/light.scss`
- `tokens/dark.scss`
- etc.

### 4. Use Generated Tokens

In your CSS:
```css
@import './tokens/light.css';

/* Tokens are available as CSS custom properties */
.button {
  background-color: var(--dt-color-accent500);
  color: var(--dt-color-primary950);
}
```

In your HTML:
```html
<html class="light">
  <!-- Your app -->
</html>
```

Switch themes by changing the class:
```html
<html class="dark">
  <!-- Now using dark theme -->
</html>
```

## CLI Commands

### `design-tokens init`

Create a starter configuration file.

```bash
npx design-tokens init [options]

Options:
  -f, --force    Overwrite existing config file
```

### `design-tokens build`

Build design tokens from configuration.

```bash
npx design-tokens build [options]

Options:
  -c, --config <path>  Path to config file
  -w, --watch          Watch for changes and rebuild
```

### `design-tokens validate`

Validate your configuration file.

```bash
npx design-tokens validate [options]

Options:
  -c, --config <path>  Path to config file
```

## Configuration

### Full Configuration Example

```typescript
import { defineConfig } from '@adddog/design-tokens';

export default defineConfig({
  // Required: Define your themes
  themes: [
    {
      name: 'light',
      colors: {
        // Semantic color tokens
        primary0: '#ffffff',
        primary500: '#6E7076',
        primary950: '#000000',
        accent500: '#2C42D3',
        positive500: '#20C557',
        negative500: '#D63333',
        warning500: '#FFB800',
      }
    },
    {
      name: 'dark',
      extends: 'light', // Optional: inherit from another theme
      colors: {
        primary0: '#000000',
        primary950: '#ffffff',
      }
    }
  ],

  // Optional: Base colors shared across themes
  baseColors: {
    white: '#ffffff',
    black: '#000000',
    blue500: '#2C42D3',
    // Can reference in themes: { value: '{color.blue500}' }
  },

  // Optional: Sizing tokens
  sizing: {
    spacing0: { value: '0' },
    spacing1: { value: '4px' },
    spacing2: { value: '8px' },
    spacing4: { value: '16px' },
    spacing8: { value: '64px' },
  },

  // Optional: Font tokens
  font: {
    family: { value: 'system-ui, sans-serif' },
    sizeXs: { value: '12px' },
    sizeSm: { value: '14px' },
    sizeMd: { value: '16px' },
    sizeLg: { value: '18px' },
  },

  // Output configuration
  output: {
    directory: './tokens',       // Where to output files
    formats: ['css', 'scss', 'ts'], // Output formats
    prefix: 'dt',                 // CSS variable prefix
  },
});
```

### Theme Inheritance

Themes can extend other themes to reduce duplication:

```typescript
themes: [
  {
    name: 'base',
    colors: {
      primary500: '#6E7076',
      accent500: '#2C42D3',
    }
  },
  {
    name: 'light',
    extends: 'base',
    colors: {
      primary0: '#ffffff',
      primary950: '#000000',
    }
  },
  {
    name: 'dark',
    extends: 'base',
    colors: {
      primary0: '#000000',
      primary950: '#ffffff',
    }
  },
  {
    name: 'high-contrast',
    extends: 'dark',
    colors: {
      accent500: '#00FF00', // Override for accessibility
    }
  }
]
```

## Programmatic API

You can also use the library programmatically:

```typescript
import { buildTokens, loadConfig, resolveConfig } from '@adddog/design-tokens';

async function build() {
  const userConfig = await loadConfig('./my-tokens.config.ts');
  const config = resolveConfig(userConfig);
  const result = await buildTokens(config);

  if (result.success) {
    console.log('Generated:', result.generatedFiles);
  } else {
    console.error('Errors:', result.errors);
  }
}
```

## Output Formats

### CSS Variables

```css
.light {
  --dt-color-primary0: #ffffff;
  --dt-color-primary500: #6E7076;
  --dt-color-accent500: #2C42D3;
}
```

### SCSS Variables

```scss
$color-primary0: #ffffff;
$color-primary500: #6E7076;
$color-accent500: #2C42D3;
```

### TypeScript

```typescript
export const colorPrimary0 = "#ffffff";
export const colorPrimary500 = "#6E7076";
export const colorAccent500 = "#2C42D3";
```

## Internal Monorepo Usage

This package is also used internally within the monorepo. The workflow is:

### For Maintainers

1. **Edit the config**: Modify `design-tokens.config.ts` in the package root
2. **Build**: Run `pnpm build` to:
   - Build the library (CLI + API)
   - Generate internal tokens to `output/`
3. **Commit**: The generated `output/` files are committed to the repo

### For Consumers (Other Monorepo Packages)

Import the pre-generated tokens directly:

```typescript
import { DarkThemeTokens, LightThemeTokens } from '@adddog/design-tokens';
// or
import '@adddog/design-tokens/light.css';
import '@adddog/design-tokens/dark.css';
```

The internal build uses the same library API as external consumers, so everything stays in sync!

## TypeScript Support

The package includes full TypeScript definitions. All configuration types are exported:

```typescript
import type {
  UserConfig,
  ThemeDefinition,
  OutputConfig
} from '@adddog/design-tokens';
```

## Scripts

| Script | Description |
|--------|-------------|
| `build` | Build library and generate internal tokens |
| `build:cli` | Build CLI only |
| `lint` | Lint codebase |
| `lint:fix` | Fix linting issues |
| `types` | Type check |

## License

MIT

## Contributing

This package is part of a monorepo. See the main repository README for contribution guidelines.
