import { describe, expect, it, vi } from "vitest";
import { getThemeColorScheme } from "../getThemeTokens";

describe("getThemeColorScheme", () => {
    it("returns 'dark' when passed 'dark'", () => {
        expect(getThemeColorScheme("dark")).toBe("dark");
    });

    it("returns 'light' when passed 'light'", () => {
        expect(getThemeColorScheme("light")).toBe("light");
    });

    it("returns 'dark' when system prefers dark", () => {
        // Mock window.matchMedia for node environment
        const matchMedia = vi.fn().mockReturnValue({ matches: true });
        vi.stubGlobal("window", { matchMedia });

        expect(getThemeColorScheme("system")).toBe("dark");

        vi.unstubAllGlobals();
    });

    it("returns 'light' when system prefers light", () => {
        const matchMedia = vi.fn().mockReturnValue({ matches: false });
        vi.stubGlobal("window", { matchMedia });

        expect(getThemeColorScheme("system")).toBe("light");

        vi.unstubAllGlobals();
    });

    it("queries correct media string for system preference", () => {
        const matchMedia = vi.fn().mockReturnValue({ matches: false });
        vi.stubGlobal("window", { matchMedia });

        getThemeColorScheme("system");
        expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");

        vi.unstubAllGlobals();
    });
});
