import { parseToRgb, parseToHsl } from "polished";
import StyleDictionary from "style-dictionary";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { formatCss, oklch } from "culori";
import { SUPPORTED_THEMES } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CUSTOM_RGB = "color/custom-rgb-colors";
const CUSTOM_HSL = "color/custom-hsl-colors";
const CUSTOM_OKLCH = "color/custom-oklch-colors";
const CUSTOM_CSS = "color/custom-css-hex";
const CLASSED_VARIABLES = "css/classed-variables";
const HEADER_NAME = "radFileHeader";
const REMOVE_ONLY_CSS_VALUES = "css/only-css";
const TS_COLOR = "color/ts-colors";

const isTSColor = (prop: any) => {
    return prop.path.includes("color") && !prop.name.toLowerCase().includes("rgb") && !prop.name.toLowerCase().includes("hsl") && !prop.name.toLowerCase().includes("oklch");
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

const config = (function initSDConfig() {
    function getTSColors(theme: string) {
        return {
            transforms: ["name/camel", "size/rem", "color/hex"],
            format: "javascript/es6",
            buildPath: `output/`,
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
    function getJSConfig(theme: string) {
        return {
            transforms: ["name/camel", "size/rem", "color/hex"],
            format: "javascript/es6",
            buildPath: `output/`,
            files: [
                {
                    destination: `${theme}.ts`,
                    format: "javascript/es6",
                    filter: (prop: any) => {
                        return !prop.name.toLowerCase().includes("rgb") && !prop.path.includes("font");
                    },
                    options: {
                        outputReferences: true,
                        fileHeader: HEADER_NAME,
                    },
                },
            ],
        };
    }

    function getSCSS(name: string) {
        return {
            transforms: ["attribute/cti", "time/seconds", "size/rem", "color/css"],
            transformGroup: "scss",
            buildPath: `output/`,
            files: [
                {
                    filter: (prop: any) => {
                        return !prop.name.toLowerCase().includes("rgb") && !prop.path.includes("font");
                    },
                    destination: `${name}.scss`,
                    format: "scss/variables",
                    options: { fileHeader: HEADER_NAME },
                },
            ],
        };
    }

    function getCSS(name: string) {
        return {
            // Custom transforms for RGB, HSL, OKLCH, and standard CSS hex
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
            buildPath: `output/`,
            prefix: "ai",
            files: [
                {
                    destination: `${name}.css`,
                    format: CLASSED_VARIABLES,
                    options: { fileHeader: HEADER_NAME, outputReferences: true, theme: name },
                },
            ],
        };
    }

    return { getCSS, getJSConfig, getSCSS, getTSColors };
})();

// Function to create JSON token files from TypeScript modules
async function createJsonTokenFiles() {
    // Create temp directory for JSON files
    const tempDir = join(__dirname, 'temp-tokens');
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(join(tempDir, 'shared'), { recursive: true });
    await fs.mkdir(join(tempDir, 'color'), { recursive: true });

    // Import and convert shared tokens
    const { color: sharedColors } = await import('./src/tokens/shared/color.ts');
    const { sizing } = await import('./src/tokens/shared/sizing.ts');
    const { font } = await import('./src/tokens/shared/font.ts');

    await fs.writeFile(
        join(tempDir, 'shared', 'color.json'),
        JSON.stringify(sharedColors, null, 2)
    );
    await fs.writeFile(
        join(tempDir, 'shared', 'sizing.json'),
        JSON.stringify(sizing, null, 2)
    );
    await fs.writeFile(
        join(tempDir, 'shared', 'font.json'),
        JSON.stringify(font, null, 2)
    );

    // Import and convert theme-specific color tokens
    for (const theme of SUPPORTED_THEMES) {
        const { color: themeColors } = await import(`./src/tokens/color/${theme}.ts`);
        await fs.writeFile(
            join(tempDir, 'color', `${theme}.json`),
            JSON.stringify(themeColors, null, 2)
        );
    }

    return tempDir;
}

async function buildThemes() {
    // Create JSON token files first
    const tokenDir = await createJsonTokenFiles();

    try {
        for (const name of SUPPORTED_THEMES) {
            const sd = new StyleDictionary({
                source: [`${tokenDir}/shared/*.json`, `${tokenDir}/color/${name}.json`],

            // Style Dictionary v5 hooks configuration
            hooks: {
                filters: {
                    [REMOVE_ONLY_CSS_VALUES]: {
                        filter: (prop: any) => {
                            return !prop.name.toLowerCase().includes("rgb") && !prop.path.includes("font");
                        }
                    },
                    [TS_COLOR]: {
                        filter: isTSColor
                    }
                },
                transforms: {
                    [CUSTOM_RGB]: {
                        type: "value",
                        filter: containsRGB,
                        transitive: true,
                        transform: (prop: any) => {
                            const color = parseToRgb(prop.original.value);
                            return `${color.red},${color.green},${color.blue}`;
                        }
                    },
                    [CUSTOM_HSL]: {
                        type: "value",
                        filter: containsHSL,
                        transitive: true,
                        transform: (prop: any) => {
                            // Use the actual value from the token, which should be a hex color
                            const hexValue = prop.value || prop.original?.value || prop.original?.$value;
                            const color = parseToHsl(hexValue);
                            const h = Math.round(color.hue);
                            const s = Math.round(color.saturation * 100);
                            const l = Math.round(color.lightness * 100);
                            return `${h} ${s}% ${l}%`;
                        }
                    },
                    [CUSTOM_OKLCH]: {
                        type: "value",
                        filter: containsOKLCH,
                        transitive: true,
                        transform: (prop: any) => {
                            // Use the actual value from the token
                            const hexValue = prop.value || prop.original?.value || prop.original?.$value;
                            const color = oklch(hexValue);
                            if (!color) return hexValue;
                            // Format: L C H (lightness, chroma, hue)
                            const l = color.l?.toFixed(3) ?? "0";
                            const c = color.c?.toFixed(3) ?? "0";
                            const h = color.h?.toFixed(1) ?? "0";
                            return `${l} ${c} ${h}`;
                        }
                    },
                    [CUSTOM_CSS]: {
                        type: "value",
                        filter: (prop: any) => {
                            // Only convert colors that are NOT rgb/hsl/oklch variants
                            return prop.path.includes("color") &&
                                   !prop.name.includes("rgb") &&
                                   !prop.name.includes("hsl") &&
                                   !prop.name.includes("oklch");
                        },
                        transitive: true,
                        transform: (prop: any) => {
                            // Simple hex conversion (same as color/css for non-alpha colors)
                            return prop.value;
                        }
                    }
                },
                formats: {
                    [CLASSED_VARIABLES]: (opts: any) => {
                        const { dictionary, file, options } = opts;
                        const { outputReferences, theme, fileHeader: header } = options;

                        // Use dictionary.allTokens to format CSS variables manually
                        const cssVars = dictionary.allTokens
                            .map((token: any) => {
                                const value = outputReferences && token.original && token.original.$value && token.original.$value !== token.value
                                    ? `var(--${token.name})`
                                    : token.value;
                                return `  --${token.name}: ${value};`;
                            })
                            .join('\n');

                        return `/**
  * ${header(file).join("\n  * ")}
  **/

.${theme} {
${cssVars}
}

`;
                    }
                },
                fileHeaders: {
                    [HEADER_NAME]: () => {
                        const msg = `This lovely file was brought to you via automation`;
                        const warning = `Please do not update directly, as your changes will not persist`;
                        return [msg, warning];
                    }
                }
            },

            platforms: {
                // Disable TypeScript exports due to invalid identifiers (numbers like "100")
                // colorKeys: config.getTSColors(name),
                // js: config.getJSConfig(name),
                scss: config.getSCSS(name),
                css: config.getCSS(name),
            },
        });

            await sd.hasInitialized;
            await sd.buildAllPlatforms();
        }
    } finally {
        // Clean up temporary files
        await fs.rm(tokenDir, { recursive: true, force: true });
    }
}

buildThemes().catch(console.error);