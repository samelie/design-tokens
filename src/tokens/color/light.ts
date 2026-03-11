import type { ThemeColorKeys } from "../../types/color";
import type { DesignTokenValue } from "../../types/shared";
import { generateRGB, getColorFn } from "../../utils/index";
import { color as sharedColors } from "../shared/color";

const getColor = getColorFn(sharedColors);

const LIGHT_THEME_COLOR_TOKENS: Record<ThemeColorKeys, DesignTokenValue> = {
    accent50: getColor("blue50"),
    accent100: getColor("blue100"),
    accent200: getColor("blue200"),
    accent300: getColor("blue300"),
    accent400: getColor("blue400"),
    accent500: getColor("blue500"),
    accent600: getColor("blue600"),
    accent700: getColor("blue700"),
    accent800: getColor("blue800"),

    negative50: getColor("red50"),
    negative100: getColor("red100"),
    negative200: getColor("red200"),
    negative300: getColor("red300"),
    negative400: getColor("red400"),
    negative500: getColor("red500"),
    negative600: getColor("red600"),
    negative700: getColor("red700"),
    negative800: getColor("red800"),

    positive50: getColor("green50"),
    positive100: getColor("green100"),
    positive200: getColor("green200"),
    positive300: getColor("green300"),
    positive400: getColor("green400"),
    positive500: getColor("green500"),
    positive600: getColor("green600"),
    positive700: getColor("green700"),
    positive800: getColor("green800"),

    primary0: getColor("white"),
    primary50: getColor("gray50"),
    primary100: getColor("gray100"),
    primary150: getColor("gray150"),
    primary200: getColor("gray200"),
    primary250: getColor("gray250"),
    primary300: getColor("gray300"),
    primary350: getColor("gray350"),
    primary400: getColor("gray400"),
    primary450: getColor("gray450"),
    primary500: getColor("gray500"),
    primary550: getColor("gray550"),
    primary600: getColor("gray600"),
    primary650: getColor("gray650"),
    primary700: getColor("gray700"),
    primary750: getColor("gray750"),
    primary800: getColor("gray800"),
    primary850: getColor("gray850"),
    primary900: getColor("gray900"),
    primary950: getColor("gray950"),

    warning50: getColor("yellow50"),
    warning100: getColor("yellow100"),
    warning200: getColor("yellow200"),
    warning300: getColor("yellow300"),
    warning400: getColor("yellow400"),
    warning500: getColor("yellow500"),
    warning600: getColor("yellow600"),
    warning700: getColor("yellow700"),
    warning800: getColor("yellow800"),

    dispositionAssumedFriend: getColor("greenNeon"),
    dispositionCivilian: getColor("purpleNeon"),
    dispositionFriend: getColor("blueNeon"),
    dispositionHostile: getColor("redNeon"),
    dispositionPending: getColor("gray50"),
    dispositionSuspect: getColor("orangeNeon"),
    dispositionUnknown: getColor("yellowNeon"),
};

export type LightThemeColorKeys = keyof typeof LIGHT_THEME_COLOR_TOKENS;

export const color = generateRGB(LIGHT_THEME_COLOR_TOKENS);
