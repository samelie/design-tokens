import type {
    BuildResult,
    ResolvedConfig,
    ThemeDefinition,
} from "./types/config";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { oklch } from "culori";
import { parseToHsl, parseToRgb } from "polished";
import StyleDictionary from "style-dictionary";

const CUSTOM_RGB = "color/custom-rgb-colors";
const CUSTOM_HSL = "color/custom-hsl-colors";
const CUSTOM_OKLCH = "color/custom-oklch-colors";
const CUSTOM_CSS = "color/custom-css-hex";
const CLASSED_VARIABLES = "css/classed-variables";
const HEADER_NAME = "radFileHeader";
const TS_COLOR = "color/ts-colors";

const isTSColor = (prop: any) => {
    return (
        prop.path.includes("color") &&
        !prop.name.toLowerCase().includes("rgb") &&
        !prop.name.toLowerCase().includes("hsl") &&
        !prop.name.toLowerCase().includes("oklch")
    );
};

const containsRGB = (prop: any) => {
    return prop.name && prop.name.includes("rgb");
};

const containsHSL = (prop: any) => {
    return prop.name && prop.name.includes("hsl");
};

const containsOKLCH = (prop: any) => {
    return prop.name && prop.name.includes("oklch");
};

function getTSColors(theme: string, buildPath: string) {
    return {
        transforms: ["name/camel", "size/rem", "color/hex"],
        format: "javascript/es6",
        buildPath,
        files: [
            {
                destination: `${theme}.ts`,
                format: "javascript/es6",
                filter: isTSColor,
                options: {
                    outputReferences: true,
                    fileHeader: HEADER_NAME,
                },
            },
        ],
    };
}

// Unused but kept for future TS export support
// function getJSConfig(theme: string, buildPath: string) {
// 	return {
// 		transforms: ["name/camel", "size/rem", "color/hex"],
// 		format: "javascript/es6",
// 		buildPath,
// 		files: [
// 			{
// 				destination: `${theme}.ts`,
// 				format: "javascript/es6",
// 				filter: (prop: any) => {
// 					return (
// 						!prop.name.toLowerCase().includes("rgb") &&
// 						!prop.path.includes("font")
// 					);
// 				},
// 				options: {
// 					outputReferences: true,
// 					fileHeader: HEADER_NAME,
// 				},
// 			},
// 		],
// 	};
// }

function getSCSS(name: string, buildPath: string) {
    return {
        transforms: ["attribute/cti", "time/seconds", "size/rem", "color/css"],
        transformGroup: "scss",
        buildPath,
        files: [
            {
                filter: (prop: any) => {
                    return (
                        !prop.name.toLowerCase().includes("rgb") &&
                        !prop.path.includes("font")
                    );
                },
                destination: `${name}.scss`,
                format: "scss/variables",
                options: { fileHeader: HEADER_NAME },
            },
        ],
    };
}

function getCSS(name: string, buildPath: string, prefix: string) {
    return {
        transforms: [
            "attribute/cti",
            "name/kebab",
            "time/seconds",
            "size/rem",
            CUSTOM_RGB,
            CUSTOM_HSL,
            CUSTOM_OKLCH,
            CUSTOM_CSS,
        ],
        buildPath,
        prefix,
        files: [
            {
                destination: `${name}.css`,
                format: CLASSED_VARIABLES,
                options: {
                    fileHeader: HEADER_NAME,
                    outputReferences: true,
                    theme: name,
                },
            },
        ],
    };
}

function normalizeTokenValue(value: string | { value: string }): { value: string } {
    return typeof value === "string" ? { value } : value;
}

async function createJsonTokenFiles(
    config: ResolvedConfig,
    tempDir: string,
): Promise<void> {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(join(tempDir, "shared"), { recursive: true });
    await fs.mkdir(join(tempDir, "color"), { recursive: true });

    // Write base colors if provided
    if (config.baseColors && Object.keys(config.baseColors).length > 0) {
        const normalizedColors: Record<string, { value: string }> = {};
        for (const [key, val] of Object.entries(config.baseColors)) {
            normalizedColors[key] = normalizeTokenValue(val);
        }
        await fs.writeFile(
            join(tempDir, "shared", "color.json"),
            JSON.stringify({ color: normalizedColors }, null, 2),
        );
    }

    // Write sizing tokens if provided
    if (config.sizing && Object.keys(config.sizing).length > 0) {
        await fs.writeFile(
            join(tempDir, "shared", "sizing.json"),
            JSON.stringify({ sizing: config.sizing }, null, 2),
        );
    }

    // Write font tokens if provided
    if (config.font && Object.keys(config.font).length > 0) {
        await fs.writeFile(
            join(tempDir, "shared", "font.json"),
            JSON.stringify({ font: config.font }, null, 2),
        );
    }

    // Write theme-specific color tokens
    for (const theme of config.themes) {
        const normalizedColors: Record<string, { value: string }> = {};
        for (const [key, val] of Object.entries(theme.colors)) {
            normalizedColors[key] = normalizeTokenValue(val);
        }
        await fs.writeFile(
            join(tempDir, "color", `${theme.name}.json`),
            JSON.stringify({ color: normalizedColors }, null, 2),
        );
    }
}

function resolveThemeInheritance(
    themes: ThemeDefinition[],
): ThemeDefinition[] {
    const themeMap = new Map(themes.map(t => [t.name, t]));
    const resolved: ThemeDefinition[] = [];

    for (const theme of themes) {
        if (!theme.extends) {
            resolved.push(theme);
            continue;
        }

        const parent = themeMap.get(theme.extends);
        if (!parent) {
            throw new Error(
                `Theme "${theme.name}" extends "${theme.extends}" which does not exist`,
            );
        }

        // Merge parent colors with child colors (child overrides parent)
        resolved.push({
            ...theme,
            colors: {
                ...parent.colors,
                ...theme.colors,
            },
        });
    }

    return resolved;
}

export async function buildTokens(
    config: ResolvedConfig,
): Promise<BuildResult> {
    const generatedFiles: string[] = [];
    const errors: string[] = [];

    // Create temp directory for JSON files
    const tempDir = join(process.cwd(), ".design-tokens-temp");

    try {
        // Resolve theme inheritance
        const resolvedThemes = resolveThemeInheritance(config.themes);

        // Create JSON token files
        await createJsonTokenFiles({ ...config, themes: resolvedThemes }, tempDir);

        // Build each theme
        for (const theme of resolvedThemes) {
            const buildPath = `${config.output.directory}/`;

            // Determine source files
            const sourceFiles = [
                `${tempDir}/shared/*.json`,
                `${tempDir}/color/${theme.name}.json`,
            ];

            const platforms: Record<string, any> = {};

            // Add platforms based on requested formats
            if (config.output.formats.includes("css")) {
                platforms.css = getCSS(theme.name, buildPath, config.output.prefix);
            }
            if (config.output.formats.includes("scss")) {
                platforms.scss = getSCSS(theme.name, buildPath);
            }
            if (config.output.formats.includes("ts")) {
                platforms.ts = getTSColors(theme.name, buildPath);
            }

            const sd = new StyleDictionary({
                source: sourceFiles,

                hooks: {
                    filters: {
                        [TS_COLOR]: isTSColor as any,
                    },
                    transforms: {
                        [CUSTOM_RGB]: {
                            type: "value",
                            filter: containsRGB as any,
                            transitive: true,
                            transform: (prop: any) => {
                                const color = parseToRgb(prop.original.value);
                                return `${color.red},${color.green},${color.blue}`;
                            },
                        },
                        [CUSTOM_HSL]: {
                            type: "value",
                            filter: containsHSL as any,
                            transitive: true,
                            transform: (prop: any) => {
                                const hexValue =
                                    prop.value || prop.original?.value || prop.original?.$value;
                                const color = parseToHsl(hexValue);
                                const h = Math.round(color.hue);
                                const s = Math.round(color.saturation * 100);
                                const l = Math.round(color.lightness * 100);
                                return `${h} ${s}% ${l}%`;
                            },
                        },
                        [CUSTOM_OKLCH]: {
                            type: "value",
                            filter: containsOKLCH as any,
                            transitive: true,
                            transform: (prop: any) => {
                                const hexValue =
                                    prop.value || prop.original?.value || prop.original?.$value;
                                const color = oklch(hexValue) as any;
                                if (!color) return hexValue;
                                const l = color.l?.toFixed(3) ?? "0";
                                const c = color.c?.toFixed(3) ?? "0";
                                const h = color.h?.toFixed(1) ?? "0";
                                return `${l} ${c} ${h}`;
                            },
                        },
                        [CUSTOM_CSS]: {
                            type: "value",
                            filter: ((prop: any) => {
                                return (
                                    prop.path.includes("color") &&
                                    !prop.name.includes("rgb") &&
                                    !prop.name.includes("hsl") &&
                                    !prop.name.includes("oklch")
                                );
                            }) as any,
                            transitive: true,
                            transform: (prop: any) => {
                                return prop.value;
                            },
                        },
                    },
                    formats: {
                        [CLASSED_VARIABLES]: (opts: any) => {
                            const { dictionary, file, options } = opts;
                            const { outputReferences, theme, fileHeader: header } = options;

                            const cssVars = dictionary.allTokens
                                .map((token: any) => {
                                    const value =
                                        outputReferences &&
                                        token.original &&
                                        token.original.$value &&
                                        token.original.$value !== token.value
                                            ? `var(--${token.name})`
                                            : token.value;
                                    return `  --${token.name}: ${value};`;
                                })
                                .join("\n");

                            return `/**
 * ${header(file).join("\n * ")}
 **/

.${theme} {
${cssVars}
}

`;
                        },
                    },
                    fileHeaders: {
                        [HEADER_NAME]: () => {
                            const msg = `This lovely file was brought to you via automation`;
                            const warning = `Please do not update directly, as your changes will not persist`;
                            return [msg, warning];
                        },
                    },
                },

                platforms,
            });

            await sd.hasInitialized;
            await sd.buildAllPlatforms();

            // Track generated files
            for (const format of config.output.formats) {
                const ext = format === "ts" ? "ts" : format;
                generatedFiles.push(join(buildPath, `${theme.name}.${ext}`));
            }
        }

        return {
            success: true,
            generatedFiles,
        };
    } catch (error) {
        errors.push(
            error instanceof Error ? error.message : "Unknown error occurred",
        );
        return {
            success: false,
            generatedFiles,
            errors,
        };
    } finally {
        // Clean up temporary files
        await fs.rm(tempDir, { recursive: true, force: true });
    }
}
