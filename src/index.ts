/* eslint-disable no-barrel-files/no-barrel-files */
// Legacy exports (for backwards compatibility with internal monorepo usage)
import type { ThemeColorKeys } from "./types/color";
import * as DarkThemeTokens from "../output/dark";
import * as LightThemeTokens from "../output/light";

export type ThemeTokens = Record<ThemeColorKeys, string>;
export { DarkThemeTokens, LightThemeTokens };
export { buildTokens } from "./builder";

// New public API for library consumers
export { defineConfig, resolveConfig } from "./config";
export { findConfigFile, loadConfig } from "./config-loader";
export type {
    BaseColorDefinition,
    BuildResult,
    FontDefinition,
    OutputConfig,
    OutputFormat,
    ResolvedConfig,
    SizingDefinition,
    ThemeColorDefinition,
    ThemeDefinition,
    UserConfig,
} from "./types/config";
export * from "./utils/getThemeTokens";
