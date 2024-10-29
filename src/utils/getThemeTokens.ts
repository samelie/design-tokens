import { DarkThemeTokens, LightThemeTokens } from '..'

export type UndeterminedColorScheme = 'dark' | 'light' | 'system'

export type ThemeColorScheme = 'dark' | 'light'

export function getThemeColorScheme(colorScheme: UndeterminedColorScheme): ThemeColorScheme {
    if (colorScheme === 'system')
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    return colorScheme
}

export function getThemeTokens(colorScheme: UndeterminedColorScheme = 'system') {
    return getThemeColorScheme(colorScheme) === 'dark' ? DarkThemeTokens : LightThemeTokens
}
