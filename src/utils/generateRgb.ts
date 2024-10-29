export const generateRGB = <T extends object>(colors: T) => {
    const entries = Object.entries(colors);
    return entries.reduce((result, entry) => {
        const [k, obj] = entry;
        const { value } = obj;
        const newKey = `${k}-rgb`;
        const newVal = `${value}ff`;
        return { ...result, [newKey]: { value: newVal } };
    }, colors);
};
