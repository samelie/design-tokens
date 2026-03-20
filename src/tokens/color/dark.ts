import type { ThemeColorKeys } from "../../types/color";
import type { DesignTokenValue } from "../../types/shared";
import { generateRGB, getColorFn } from "../../utils/index";
import { color as sharedColors } from "../shared/color";

const getColor = getColorFn(sharedColors);

const DARK_THEME_COLOR_TOKENS: Record<ThemeColorKeys, DesignTokenValue> = {
    accent50: getColor("blue800"),
    accent100: getColor("blue700"),
    accent200: getColor("blue600"),
    accent300: getColor("blue500"),
    accent400: getColor("blue400"),
    accent500: getColor("blue300"),
    accent600: getColor("blue200"),
    accent700: getColor("blue100"),
    accent800: getColor("blue50"),

    negative50: getColor("red800"),
    negative100: getColor("red700"),
    negative200: getColor("red600"),
    negative300: getColor("red500"),
    negative400: getColor("red400"),
    negative500: getColor("red300"),
    negative600: getColor("red200"),
    negative700: getColor("red100"),
    negative800: getColor("red50"),

    positive50: getColor("green800"),
    positive100: getColor("green700"),
    positive200: getColor("green600"),
    positive300: getColor("green500"),
    positive400: getColor("green400"),
    positive500: getColor("green300"),
    positive600: getColor("green200"),
    positive700: getColor("green100"),
    positive800: getColor("green50"),

    // NOTE: Some of the gray color steps are missing here because the contrast
    // between each step is not the same as it is in light mode. The following
    // gradation more closely matches that of light mode.
    primary0: getColor("gray950"),
    primary50: getColor("gray850"),
    primary100: getColor("gray750"),
    primary150: getColor("gray700"),
    primary200: getColor("gray650"),
    primary250: getColor("gray600"),
    primary300: getColor("gray600"),
    primary350: getColor("gray600"),
    primary400: getColor("gray500"),
    primary450: getColor("gray500"),
    primary500: getColor("gray400"),
    primary550: getColor("gray400"),
    primary600: getColor("gray300"),
    primary650: getColor("gray300"),
    primary700: getColor("gray200"),
    primary750: getColor("gray200"),
    primary800: getColor("gray100"),
    primary850: getColor("gray100"),
    primary900: getColor("gray50"),
    primary950: getColor("white"),

    warning50: getColor("yellow800"),
    warning100: getColor("yellow700"),
    warning200: getColor("yellow600"),
    warning300: getColor("yellow500"),
    warning400: getColor("yellow400"),
    warning500: getColor("yellow300"),
    warning600: getColor("yellow200"),
    warning700: getColor("yellow100"),
    warning800: getColor("yellow50"),

    dispositionAssumedFriend: getColor("greenNeon"),
    dispositionCivilian: getColor("purpleNeon"),
    dispositionFriend: getColor("blueNeon"),
    dispositionHostile: getColor("redNeon"),
    dispositionPending: getColor("gray50"),
    dispositionSuspect: getColor("orangeNeon"),
    dispositionUnknown: getColor("yellowNeon"),
} as const;

export type DarkThemeColorKeys = keyof typeof DARK_THEME_COLOR_TOKENS;

export const color = generateRGB(DARK_THEME_COLOR_TOKENS);
