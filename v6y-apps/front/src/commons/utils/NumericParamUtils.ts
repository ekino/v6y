/**
 * Parses a route/query param into a finite number, or `undefined` when the
 * value is missing or not a valid number.
 */
const parseNumericParam = (value?: string | null): number | undefined => {
    if (!value) {
        return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Resolves a numeric id, preferring an already-known value (e.g. a prop)
 * and falling back to a raw param (e.g. a URL param) when it isn't set.
 */
const resolveNumericId = (
    preferredId?: number,
    fallbackParam?: string | null,
): number | undefined => {
    return Number.isFinite(preferredId) ? preferredId : parseNumericParam(fallbackParam);
};

export { parseNumericParam, resolveNumericId };
