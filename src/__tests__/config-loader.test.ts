import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findConfigFile } from "../config-loader";

const PKG_ROOT = join(import.meta.dirname, "../..");

describe("findConfigFile", () => {
    it("finds design-tokens.config.ts in the package root", () => {
        const result = findConfigFile(PKG_ROOT);
        expect(result).toBe(join(PKG_ROOT, "design-tokens.config.ts"));
    });

    it("returns null when no config exists in a directory", () => {
        // Use a directory that definitely has no config file
        const result = findConfigFile("/tmp");
        expect(result).toBeNull();
    });

    it("returns the first matching config file name", () => {
        // Since the package root has design-tokens.config.ts, it should match that first
        const result = findConfigFile(PKG_ROOT);
        expect(result).toContain("design-tokens.config.ts");
    });
});

describe("loadConfig", () => {
    // loadConfig uses dynamic import and requires actual config file modules,
    // so we test the error paths that don't need actual imports

    it("is exported as a function", async () => {
        const { loadConfig } = await import("../config-loader");
        expect(typeof loadConfig).toBe("function");
    });

    it("throws when no config file found and no path given", async () => {
        const { loadConfig } = await import("../config-loader");
        await expect(loadConfig(undefined, "/tmp")).rejects.toThrow(
            "No configuration file found",
        );
    });

    it("throws when explicit path does not exist", async () => {
        const { loadConfig } = await import("../config-loader");
        await expect(
            loadConfig("nonexistent-config.ts", "/tmp"),
        ).rejects.toThrow("Configuration file not found at");
    });
});
