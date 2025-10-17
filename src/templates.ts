/**
 * Template for the initial design-tokens.config.ts file
 */
export const configTemplate = `import { defineConfig } from '@adddog/design-tokens';

export default defineConfig({
  themes: [
    {
      name: 'light',
      colors: {
        // Primary colors (for backgrounds, surfaces, text)
        primary0: '#ffffff',
        primary50: '#F2F3F4',
        primary100: '#D7D8DB',
        primary200: '#BCBFC2',
        primary300: '#A2A4A9',
        primary400: '#888A8F',
        primary500: '#6E7076',
        primary600: '#505359',
        primary700: '#2B2F33',
        primary800: '#1C1D21',
        primary900: '#0E0F12',
        primary950: '#000000',

        // Accent colors (brand colors, call-to-actions)
        accent50: '#E5E9FF',
        accent100: '#B8C1FF',
        accent200: '#8C9BFF',
        accent300: '#667BFF',
        accent400: '#334EFF',
        accent500: '#2C42D3',
        accent600: '#2435A7',
        accent700: '#1C2779',
        accent800: '#1A1E36',

        // Semantic colors
        positive50: '#E1F5E8',
        positive100: '#B0E9C3',
        positive200: '#80DD9F',
        positive300: '#50D17B',
        positive400: '#20C557',
        positive500: '#1B9F47',
        positive600: '#167737',
        positive700: '#104E25',
        positive800: '#182C22',

        negative50: '#FFD0D0',
        negative100: '#F7A4A4',
        negative200: '#EF7979',
        negative300: '#ED5151',
        negative400: '#D63333',
        negative500: '#B82121',
        negative600: '#901E1E',
        negative700: '#691212',
        negative800: '#2F191B',

        warning50: '#FFF3D6',
        warning100: '#FFE49F',
        warning200: '#FFD66A',
        warning300: '#FFC736',
        warning400: '#FFB800',
        warning500: '#D59A03',
        warning600: '#AA7C05',
        warning700: '#715100',
        warning800: '#322B17',
      },
    },
    {
      name: 'dark',
      colors: {
        // Primary colors (inverted for dark mode)
        primary0: '#040405',
        primary50: '#15161A',
        primary100: '#24262A',
        primary200: '#2B2F33',
        primary300: '#505359',
        primary400: '#6E7076',
        primary500: '#888A8F',
        primary600: '#A2A4A9',
        primary700: '#BCBFC2',
        primary800: '#D7D8DB',
        primary900: '#F2F3F4',
        primary950: '#ffffff',

        // Accent colors (adjusted for dark mode)
        accent50: '#1A1E36',
        accent100: '#1C2779',
        accent200: '#2435A7',
        accent300: '#2C42D3',
        accent400: '#334EFF',
        accent500: '#667BFF',
        accent600: '#8C9BFF',
        accent700: '#B8C1FF',
        accent800: '#E5E9FF',

        // Semantic colors (adjusted for dark mode)
        positive50: '#182C22',
        positive100: '#104E25',
        positive200: '#167737',
        positive300: '#1B9F47',
        positive400: '#20C557',
        positive500: '#50D17B',
        positive600: '#80DD9F',
        positive700: '#B0E9C3',
        positive800: '#E1F5E8',

        negative50: '#2F191B',
        negative100: '#691212',
        negative200: '#901E1E',
        negative300: '#B82121',
        negative400: '#D63333',
        negative500: '#ED5151',
        negative600: '#EF7979',
        negative700: '#F7A4A4',
        negative800: '#FFD0D0',

        warning50: '#322B17',
        warning100: '#715100',
        warning200: '#AA7C05',
        warning300: '#D59A03',
        warning400: '#FFB800',
        warning500: '#FFC736',
        warning600: '#FFD66A',
        warning700: '#FFE49F',
        warning800: '#FFF3D6',
      },
    },
  ],

  // Optional: Define base colors that all themes can reference
  baseColors: {
    white: '#ffffff',
    black: '#000000',
    blue500: '#2C42D3',
    green500: '#1B9F47',
    red500: '#B82121',
    yellow500: '#D59A03',
  },

  // Optional: Define sizing tokens
  sizing: {
    spacing0: { value: '0' },
    spacing1: { value: '4px' },
    spacing2: { value: '8px' },
    spacing3: { value: '12px' },
    spacing4: { value: '16px' },
    spacing5: { value: '24px' },
    spacing6: { value: '32px' },
    spacing7: { value: '48px' },
    spacing8: { value: '64px' },
  },

  // Optional: Define font tokens
  font: {
    family: { value: 'system-ui, -apple-system, sans-serif' },
    sizeXs: { value: '12px' },
    sizeSm: { value: '14px' },
    sizeMd: { value: '16px' },
    sizeLg: { value: '18px' },
    sizeXl: { value: '24px' },
    size2xl: { value: '32px' },
  },

  // Output configuration
  output: {
    directory: './tokens',
    formats: ['css', 'scss', 'ts'],
    prefix: 'dt', // CSS variable prefix
  },
});
`;
