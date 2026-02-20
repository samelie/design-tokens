import { describe, expect, it } from "vitest";
import { defineConfig, resolveConfig } from "../config";

describe("defineConfig", () => {
    it("returns the same config object passed in", () => {
        const config = {
            themes: [{ name: "light", colors: { primary: "#fff" } }],
        };
        expect(defineConfig(config)).toBe(config);
    });
});

describe("resolveConfig", () => {
    const minimalConfig = {
        themes: [{ name: "test", colors: { bg: "#000" } }],
    };

    it("provides default output directory", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.output.directory).toBe("./output");
    });

    it("provides default output formats", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.output.formats).toEqual(["css", "scss", "ts"]);
    });

    it("provides default output prefix", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.output.prefix).toBe("dt");
    });

    it("provides empty baseColors when not specified", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.baseColors).toEqual({});
    });

    it("provides empty sizing when not specified", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.sizing).toEqual({});
    });

    it("provides empty font when not specified", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.font).toEqual({});
    });

    it("preserves user-specified themes", () => {
        const resolved = resolveConfig(minimalConfig);
        expect(resolved.themes).toBe(minimalConfig.themes);
    });

    it("preserves user-specified output overrides", () => {
        const config = {
            ...minimalConfig,
            output: {
                directory: "./custom",
                formats: ["css" as const],
                prefix: "my",
            },
        };
        const resolved = resolveConfig(config);
        expect(resolved.output.directory).toBe("./custom");
        expect(resolved.output.formats).toEqual(["css"]);
        expect(resolved.output.prefix).toBe("my");
    });

    it("preserves user-specified baseColors", () => {
        const config = {
            ...minimalConfig,
            baseColors: { white: "#fff" },
        };
        const resolved = resolveConfig(config);
        expect(resolved.baseColors).toEqual({ white: "#fff" });
    });

    it("preserves user-specified sizing", () => {
        const config = {
            ...minimalConfig,
            sizing: { sm: { value: "4px" } },
        };
        const resolved = resolveConfig(config);
        expect(resolved.sizing).toEqual({ sm: { value: "4px" } });
    });

    it("preserves user-specified font", () => {
        const config = {
            ...minimalConfig,
            font: { body: { value: "16px" } },
        };
        const resolved = resolveConfig(config);
        expect(resolved.font).toEqual({ body: { value: "16px" } });
    });

    it("fills in missing output fields with defaults", () => {
        const config = {
            ...minimalConfig,
            output: { directory: "./dist" },
        };
        const resolved = resolveConfig(config);
        expect(resolved.output.directory).toBe("./dist");
        expect(resolved.output.formats).toEqual(["css", "scss", "ts"]);
        expect(resolved.output.prefix).toBe("dt");
    });
});
