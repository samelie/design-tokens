import type { DesignTokenValue } from "./shared";

export type OutputFormat = "css" | "scss" | "ts" | "json";

export interface ThemeColorDefinition {
    [key: string]: string | DesignTokenValue;
}

export interface ThemeDefinition {
    name: string;
    colors: ThemeColorDefinition;
    extends?: string; // Optional: inherit from another theme
}

export interface BaseColorDefinition {
    [key: string]: string | DesignTokenValue;
}

export interface SizingDefinition {
    [key: string]: DesignTokenValue;
}

export interface FontDefinition {
    [key: string]: DesignTokenValue;
}

export interface OutputConfig {
    directory?: string;
    formats?: OutputFormat[];
    prefix?: string;
}

export interface UserConfig {
    themes: ThemeDefinition[];
    baseColors?: BaseColorDefinition;
    sizing?: SizingDefinition;
    font?: FontDefinition;
    output?: OutputConfig;
}

export interface ResolvedConfig extends Required<Omit<UserConfig, "output">> {
    output: Required<OutputConfig>;
}

export interface BuildResult {
    success: boolean;
    generatedFiles: string[];
    errors?: string[];
}
