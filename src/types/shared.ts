export type DesignTokenValue = {
    value: string;
};

export type PrimaryFontConfig = {
    100: DesignTokenValue;
    150: DesignTokenValue;
    200: DesignTokenValue;
    250: DesignTokenValue;
    300: DesignTokenValue;
    350: DesignTokenValue;
    400: DesignTokenValue;
    450: DesignTokenValue;
    550: DesignTokenValue;
    650: DesignTokenValue;
    750: DesignTokenValue;
    850: DesignTokenValue;
    950: DesignTokenValue;
};

export type MonoFontConfig = {
    mono100: DesignTokenValue;
    mono150: DesignTokenValue;
    mono200: DesignTokenValue;
    mono250: DesignTokenValue;
    mono300: DesignTokenValue;
    mono350: DesignTokenValue;
    mono400: DesignTokenValue;
    mono450: DesignTokenValue;
    mono550: DesignTokenValue;
    mono650: DesignTokenValue;
    mono750: DesignTokenValue;
    mono850: DesignTokenValue;
    mono950: DesignTokenValue;
};

export type ScaleConfig = {
    scale0: DesignTokenValue;
    scale100: DesignTokenValue;
    scale200: DesignTokenValue;
    scale300: DesignTokenValue;
    scale400: DesignTokenValue;
    scale500: DesignTokenValue;
    scale550: DesignTokenValue;
    scale600: DesignTokenValue;
    scale650: DesignTokenValue;
    scale700: DesignTokenValue;
    scale750: DesignTokenValue;
    scale800: DesignTokenValue;
    scale850: DesignTokenValue;
    scale900: DesignTokenValue;
    scale950: DesignTokenValue;
    scale1000: DesignTokenValue;
    scale1200: DesignTokenValue;
    scale1400: DesignTokenValue;
    scale1600: DesignTokenValue;
    scale2400: DesignTokenValue;
    scale3200: DesignTokenValue;
    scale4800: DesignTokenValue;
};

export type FontConfig = PrimaryFontConfig & MonoFontConfig;
