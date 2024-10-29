import * as DarkThemeTokens from "../output/dark";
import * as LightThemeTokens from "../output/light";
import type { ThemeColorKeys } from "./types/color";

export type ThemeTokens = Record<ThemeColorKeys, string>;
export { DarkThemeTokens, LightThemeTokens };
export * from "./utils/getThemeTokens";
