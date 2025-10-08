import type { UserConfig } from "./types/config";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CONFIG_FILE_NAMES = [
    "design-tokens.config.ts",
    "design-tokens.config.mts",
    "design-tokens.config.js",
    "design-tokens.config.mjs",
    "design-tokens.config.cjs",
];

/**
 * Attempts to find a config file in the current directory
 */
export function findConfigFile(cwd: string = process.cwd()): string | null {
    for (const fileName of CONFIG_FILE_NAMES) {
        const filePath = resolve(cwd, fileName);
        if (existsSync(filePath)) {
            return filePath;
        }
    }
    return null;
}

/**
 * Loads and validates a design tokens configuration file
 */
export async function loadConfig(
    configPath?: string,
    cwd: string = process.cwd(),
): Promise<UserConfig> {
    const resolvedPath = configPath
        ? resolve(cwd, configPath)
        : findConfigFile(cwd);

    if (!resolvedPath) {
        throw new Error(
            `No configuration file found. Run 'design-tokens init' to create one, or specify a path with --config`,
        );
    }

    if (!existsSync(resolvedPath)) {
        throw new Error(`Configuration file not found at: ${resolvedPath}`);
    }

    try {
        // Use dynamic import with file URL for cross-platform compatibility
        const fileUrl = pathToFileURL(resolvedPath).href;
        const module = await import(fileUrl);
        const config = module.default || module;

        if (!config || typeof config !== "object") {
            throw new Error("Configuration file must export a config object");
        }

        // Basic validation
        if (!config.themes || !Array.isArray(config.themes)) {
            throw new Error("Configuration must include a 'themes' array");
        }

        if (config.themes.length === 0) {
            throw new Error("At least one theme must be defined");
        }

        for (const theme of config.themes) {
            if (!theme.name) {
                throw new Error("Each theme must have a 'name' property");
            }
            if (!theme.colors || typeof theme.colors !== "object") {
                throw new Error(`Theme '${theme.name}' must have a 'colors' object`);
            }
        }

        return config as UserConfig;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to load config from ${resolvedPath}: ${error.message}`);
        }
        throw error;
    }
}
