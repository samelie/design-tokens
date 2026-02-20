import { describe, expect, it } from "vitest";
import { configTemplate } from "../templates";

describe("configTemplate", () => {
    it("is a non-empty string", () => {
        expect(typeof configTemplate).toBe("string");
        expect(configTemplate.length).toBeGreaterThan(0);
    });

    it("contains defineConfig import", () => {
        expect(configTemplate).toContain("import { defineConfig } from '@adddog/design-tokens'");
    });

    it("contains export default defineConfig call", () => {
        expect(configTemplate).toContain("export default defineConfig(");
    });

    it("defines a light theme", () => {
        expect(configTemplate).toContain("name: 'light'");
    });

    it("defines a dark theme", () => {
        expect(configTemplate).toContain("name: 'dark'");
    });

    it("includes primary color scale", () => {
        expect(configTemplate).toContain("primary0:");
        expect(configTemplate).toContain("primary500:");
        expect(configTemplate).toContain("primary950:");
    });

    it("includes accent color scale", () => {
        expect(configTemplate).toContain("accent50:");
        expect(configTemplate).toContain("accent800:");
    });

    it("includes semantic colors", () => {
        expect(configTemplate).toContain("positive");
        expect(configTemplate).toContain("negative");
        expect(configTemplate).toContain("warning");
    });

    it("includes baseColors section", () => {
        expect(configTemplate).toContain("baseColors:");
    });

    it("includes sizing section", () => {
        expect(configTemplate).toContain("sizing:");
        expect(configTemplate).toContain("spacing0:");
        expect(configTemplate).toContain("spacing8:");
    });

    it("includes font section", () => {
        expect(configTemplate).toContain("font:");
        expect(configTemplate).toContain("family:");
        expect(configTemplate).toContain("sizeMd:");
    });

    it("includes output configuration", () => {
        expect(configTemplate).toContain("output:");
        expect(configTemplate).toContain("directory:");
        expect(configTemplate).toContain("formats:");
        expect(configTemplate).toContain("prefix:");
    });

    it("includes css and scss and ts in formats array", () => {
        expect(configTemplate).toContain("'css'");
        expect(configTemplate).toContain("'scss'");
        expect(configTemplate).toContain("'ts'");
    });
});
