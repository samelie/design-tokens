export const generateRGB = <T extends object>(colors: T) => {
    const entries = Object.entries(colors);

    // Generate RGB, HSL, and OKLCH variants for each color
    const result = entries.reduce((acc, entry) => {
        const [k, obj] = entry;
        const { value } = obj;

        // Add RGB variant - keep original hex, transform will convert it
        const rgbKey = `${k}-rgb`;
        const rgbVal = value;

        // Add HSL variant - keep original hex, transform will convert it
        const hslKey = `${k}-hsl`;
        const hslVal = value;

        // Add OKLCH variant - keep original hex, transform will convert it
        const oklchKey = `${k}-oklch`;
        const oklchVal = value;

        return {
            ...acc,
            [rgbKey]: { value: rgbVal },
            [hslKey]: { value: hslVal },
            [oklchKey]: { value: oklchVal },
        };
    }, colors);

    return result;
};
