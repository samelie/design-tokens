/* eslint-disable no-barrel-files/no-barrel-files */
import type { ThemeColorKeys } from "./types/color";
import * as DarkThemeTokens from "../output/dark";
import * as LightThemeTokens from "../output/light";

export type ThemeTokens = Record<ThemeColorKeys, string>;
export { DarkThemeTokens, LightThemeTokens };
export * from "./utils/getThemeTokens";
