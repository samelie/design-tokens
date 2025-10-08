import type {
    ResolvedConfig,
    UserConfig,
} from "./types/config";

/**
 * Helper function to define a design tokens configuration
 */
export function defineConfig(config: UserConfig): UserConfig {
    return config;
}

/**
 * Resolves user config with defaults
 */
export function resolveConfig(userConfig: UserConfig): ResolvedConfig {
    return {
        themes: userConfig.themes,
        baseColors: userConfig.baseColors ?? {},
        sizing: userConfig.sizing ?? {},
        font: userConfig.font ?? {},
        output: {
            directory: userConfig.output?.directory ?? "./output",
            formats: userConfig.output?.formats ?? ["css", "scss", "ts"],
            prefix: userConfig.output?.prefix ?? "dt",
        },
    };
}
