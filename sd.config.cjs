const { parseToRgb } = require("polished");
const StyleDictionary = require("style-dictionary");
const { SUPPORTED_THEMES } = require("./constants.cjs");

const CUSTOM_RGB = "color/custom-rgb-colors";
const CLASSED_VARIABLES = "css/classed-variables";
const HEADER_NAME = "radFileHeader";
const REMOVE_ONLY_CSS_VALUES = "css/only-css";
const TS_COLOR = "color/ts-colors";

const isTSColor = prop => {
    return prop.path.includes("color") && !prop.name.toLowerCase().includes("rgb");
};

const containsRGB = prop => {
    const { name, attributes } = prop;
    const { category, type, item, subitem } = attributes;
    return [category, type, item, subitem].includes("color") && name.includes("rgb");
};

(function initCustomTransforms() {
    /**
     * @description CSS Only Values
     */
    StyleDictionary.registerFilter({
        name: REMOVE_ONLY_CSS_VALUES,
        matcher: prop => {
            return !prop.name.toLowerCase().includes("rgb") && !prop.path.includes("font");
        },
    });

    /**
     * @description
     *
     * Generates all colors which should be ColorKey in JS Theme obj
     */
    StyleDictionary.registerFilter({
        name: TS_COLOR,
        matcher: isTSColor,
    });

    /**
     * @description This adds a matcher to selectively filter by token name - only apply RGB when it contains that in the token name
     */
    StyleDictionary.registerTransform({
        name: CUSTOM_RGB,
        type: "value",
        matcher: containsRGB,
        transformer: prop => {
            const color = parseToRgb(prop.original.value);
            return `${color.red},${color.green},${color.blue}`;
        },
    });

    /**
     * @description Custom header for generated files (to remove date mostly, so that we don't bulk updates in git when modifying single value)
     */
    function initHeader() {
        const headerConfig = {
            name: HEADER_NAME,
            fileHeader: () => {
                const msg = `This lovely file was brought to you via automation`;
                const warning = `Please do not update directly, as your changes will not persist`;
                return [msg, warning];
            },
        };
        StyleDictionary.registerFileHeader(headerConfig);
    }

    /**
     * @description
     * We want to scope CSS Variables to class name (e.g. lca-dark) instead of :root
     * This will create a className from the given file -> if file name is `lca-dark.ts`, it will create a `.lca-dark` class
     */
    function registerCustomCSSVariableClasses() {
        const name = CLASSED_VARIABLES;

        const { formattedVariables } = StyleDictionary.formatHelpers;

        StyleDictionary.registerFormat({
            name,
            formatter(opts) {
                const { dictionary, file, options } = opts;
                const { outputReferences, theme, fileHeader: header } = options;
                return `/**
  * ${header(file).join("\n  * ")}
  **/

.${theme} {
${formattedVariables({ format: "css", dictionary, outputReferences })}
}

`;
            },
        });
    }

    initHeader();
    registerCustomCSSVariableClasses();
})();

const config = (function initSDConfig() {
    function getTSColors(theme) {
        return {
            transforms: ["name/ti/camel", "size/rem", "color/hex"],
            format: "javascript/es6",
            buildPath: `output/`,
            files: [
                {
                    destination: `${theme}.ts`,
                    format: "javascript/es6",
                    filter: TS_COLOR,
                    options: {
                        outputReferences: true,
                        fileHeader: HEADER_NAME,
                    },
                },
            ],
        };
    }
    function getJSConfig(theme) {
        return {
            transforms: ["name/ti/camel", "size/rem", "color/hex"],
            format: "javascript/es6",
            buildPath: `output/`,
            files: [
                {
                    destination: `${theme}.ts`,
                    format: "javascript/es6",
                    filter: REMOVE_ONLY_CSS_VALUES,
                    options: {
                        outputReferences: true,
                        fileHeader: HEADER_NAME,
                    },
                },
            ],
        };
    }

    function getSCSS(name) {
        return {
            transforms: ["attribute/cti", "time/seconds", "content/icon", "size/rem", "color/css"],
            transformGroup: "scss",
            buildPath: `output/`,
            files: [
                {
                    filter: REMOVE_ONLY_CSS_VALUES,
                    destination: `${name}.scss`,
                    format: "scss/variables",
                    options: { fileHeader: HEADER_NAME },
                },
            ],
        };
    }

    function getCSS(name) {
        return {
            // Same transforms as "CSS" OOTB transformGroup + custom rgb
            transforms: [
                "attribute/cti",
                "name/cti/kebab",
                "time/seconds",
                "content/icon",
                "size/rem",
                "color/css",
                CUSTOM_RGB,
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

SUPPORTED_THEMES.forEach(name => {
    const mapping = {
        source: [`build/tokens/shared/*.js`, `build/tokens/*/${name}.js`],
        platforms: {
            colorKeys: config.getTSColors(name),
            js: config.getJSConfig(name),
            scss: config.getSCSS(name),
            css: config.getCSS(name),
        },
    };

    StyleDictionary.extend(mapping).buildAllPlatforms();
});
