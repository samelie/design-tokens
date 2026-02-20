import { describe, expect, it } from "vitest";
import { generateRGB } from "../generateRgb";

describe("generateRGB", () => {
    it("adds rgb, hsl, oklch variants for each color entry", () => {
        const input = {
            red: { value: "#ff0000" },
            blue: { value: "#0000ff" },
        };
        const result = generateRGB(input);

        // Original keys preserved
        expect(result).toHaveProperty("red");
        expect(result).toHaveProperty("blue");

        // RGB variants
        expect(result).toHaveProperty("red-rgb");
        expect(result["red-rgb"]).toEqual({ value: "#ff0000" });
        expect(result).toHaveProperty("blue-rgb");
        expect(result["blue-rgb"]).toEqual({ value: "#0000ff" });

        // HSL variants
        expect(result).toHaveProperty("red-hsl");
        expect(result["red-hsl"]).toEqual({ value: "#ff0000" });
        expect(result).toHaveProperty("blue-hsl");
        expect(result["blue-hsl"]).toEqual({ value: "#0000ff" });

        // OKLCH variants
        expect(result).toHaveProperty("red-oklch");
        expect(result["red-oklch"]).toEqual({ value: "#ff0000" });
        expect(result).toHaveProperty("blue-oklch");
        expect(result["blue-oklch"]).toEqual({ value: "#0000ff" });
    });

    it("returns object with 4x the keys (original + 3 variants per entry)", () => {
        const input = {
            white: { value: "#ffffff" },
        };
        const result = generateRGB(input);
        // 1 original + 3 variants = 4
        expect(Object.keys(result)).toHaveLength(4);
    });

    it("handles empty input", () => {
        const result = generateRGB({});
        expect(Object.keys(result)).toHaveLength(0);
    });

    it("preserves original values unchanged", () => {
        const input = {
            green: { value: "#00ff00" },
        };
        const result = generateRGB(input);
        expect(result.green).toEqual({ value: "#00ff00" });
    });

    it("handles many color entries", () => {
        const input = {
            a: { value: "#111111" },
            b: { value: "#222222" },
            c: { value: "#333333" },
            d: { value: "#444444" },
            e: { value: "#555555" },
        };
        const result = generateRGB(input);
        // 5 original + 5*3 variants = 20
        expect(Object.keys(result)).toHaveLength(20);

        for (const key of Object.keys(input)) {
            expect(result).toHaveProperty(`${key}-rgb`);
            expect(result).toHaveProperty(`${key}-hsl`);
            expect(result).toHaveProperty(`${key}-oklch`);
        }
    });

    it("variant values match the original hex value (transforms happen later in pipeline)", () => {
        const input = {
            primary: { value: "#abcdef" },
        };
        const result = generateRGB(input);
        expect(result["primary-rgb"].value).toBe("#abcdef");
        expect(result["primary-hsl"].value).toBe("#abcdef");
        expect(result["primary-oklch"].value).toBe("#abcdef");
    });
});
