/**
 * Internal monorepo configuration for @adddog/design-tokens
 * This config imports from existing token files to maintain compatibility
 * with the generateRGB() utility that creates rgb/hsl/oklch variants
 */
import { defineConfig } from "./src/index";
import { color as darkColors } from "./src/tokens/color/dark";
import { color as lightColors } from "./src/tokens/color/light";
import { color as sharedColors } from "./src/tokens/shared/color";
import { font } from "./src/tokens/shared/font";
import { sizing } from "./src/tokens/shared/sizing";

/**
 * Convert the generated token format to the config format
 * The existing tokens already have rgb/hsl/oklch variants from generateRGB()
 */
function convertTokensToConfig(tokens: Record<string, { value: string }>) {
    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(tokens)) {
        result[key] = val.value;
    }
    return result;
}

export default defineConfig({
    themes: [
        {
            name: "light",
            colors: convertTokensToConfig(lightColors),
        },
        {
            name: "dark",
            colors: convertTokensToConfig(darkColors),
        },
    ],

    // Base colors shared across all themes
    baseColors: convertTokensToConfig(sharedColors),

    // Sizing tokens
    sizing,

    // Font tokens
    font,

    // Output configuration
    output: {
        directory: "./output",
        formats: ["css", "scss", "ts"],
        prefix: "ai",
    },
});
