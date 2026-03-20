import type { FontConfig, PrimaryFontConfig } from "../../types/shared";

const primaryFont = "Inter";
const monoFont = "Source Code Pro";

const baseFont: PrimaryFontConfig = {
    100: {
        value: `400 10px/12px "${primaryFont}"`,
    },
    150: {
        value: `600 10px/14px "${primaryFont}"`,
    },
    200: {
        value: `400 12px/16px "${primaryFont}"`,
    },
    250: {
        value: `600 12px/16px "${primaryFont}"`,
    },
    300: {
        value: `400 14px/20px "${primaryFont}"`,
    },
    350: {
        value: `600 14px/20px "${primaryFont}"`,
    },
    400: {
        value: `400 16px/24px "${primaryFont}"`,
    },
    450: {
        value: `700 16px/20px "${primaryFont}"`,
    },
    550: {
        value: `700 18px/22px "${primaryFont}"`,
    },
    650: {
        value: `700 22px/28px "${primaryFont}"`,
    },
    750: {
        value: `700 28px/32px "${primaryFont}"`,
    },
    850: {
        value: `700 32px/40px "${primaryFont}"`,
    },
    950: {
        value: `700 36px/40px "${primaryFont}"`,
    },
};

function getFontConfig(): FontConfig {
    const config = Object.entries(baseFont).reduce((result, entry) => {
        const [k, obj] = entry;
        const { value: existing } = obj;
        const value = existing.replace(primaryFont, monoFont);
        const newKey = `mono${k}`;
        return { ...result, [newKey]: { value } };
    }, baseFont);
    return config as FontConfig;
}

export const font = getFontConfig();
