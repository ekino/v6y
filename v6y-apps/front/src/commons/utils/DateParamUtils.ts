/**
 * Parses a date value coming from the API, which may be either an ISO date
 * string or a numeric epoch timestamp (in seconds or milliseconds) encoded
 * as a string. Passing a bare numeric string straight to `new Date(...)`
 * yields an `Invalid Date`, so numeric values are detected and normalized
 * before parsing. Returns `null` when the value is missing or unparsable.
 */
const parseDateValue = (value: string | null | undefined): Date | null => {
    if (!value) {
        return null;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    const isNumericTimestamp = /^\d+$/.test(trimmedValue);
    const date = isNumericTimestamp
        ? new Date(
              Number(trimmedValue) < 1_000_000_000_000
                  ? Number(trimmedValue) * 1000
                  : Number(trimmedValue),
          )
        : new Date(trimmedValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

export { parseDateValue };
