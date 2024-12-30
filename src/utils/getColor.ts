import type { ColorImplementationKeys } from "../types/color";

import type { DesignTokenValue } from "../types/shared";
import { transparentize } from "polished";

type ThemeColorConfig = Record<ColorImplementationKeys, DesignTokenValue>;

interface CoercedOpts {
    disabled?: boolean;
}

const DISABLED_OPACITY = 0.7;

// TODO: Remove eslint disable and fix error (seems like function needs reworked - MRD)
// eslint-disable-next-line ts/no-explicit-any
function getNestedColor<T, K extends any[]>(obj: T, arr: K): DesignTokenValue {
    const errMsg = `Malformed object. You likely have a bad key for final entry ${arr}`;
    const result: DesignTokenValue | undefined = arr.reduce((prev: T | undefined, k) => {
        if (!prev) {
            throw new Error(errMsg);
        }
        // @ts-expect-error wahteverokay
        return prev[k];
    }, obj);
    // This is a util fn used by config generator. Throwing here will short-circuit bad config
    if (!result?.value) {
        throw new Error(errMsg);
    }
    return result;
}

const coerceValue = (colorConfig: DesignTokenValue, opts: CoercedOpts): DesignTokenValue => {
    const { disabled } = opts;
    const { value: color = "" } = colorConfig;
    const value = disabled ? transparentize(DISABLED_OPACITY, color) : color;
    return { ...colorConfig, value };
};

function getColor<T, Key>(obj: T, k: Key | Key[], opts: CoercedOpts = {}): DesignTokenValue {
    const config = Array.isArray(k) ? getNestedColor(obj, k) : getNestedColor(obj, [k]);
    return coerceValue(config, opts);
}

export const getColorFn = (obj: ThemeColorConfig) => (k: ColorImplementationKeys | ColorImplementationKeys[]) =>
    getColor(obj, k);
