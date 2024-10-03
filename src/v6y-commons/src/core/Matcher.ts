const matched = (value: unknown) => ({
    on: () => matched(value),
    otherwise: () => value,
});

const Matcher = (value: unknown = null) => ({
    on: (predicate: (value: unknown) => boolean, fn: (value: unknown) => unknown) =>
        predicate(value) ? matched(fn(value)) : Matcher(value),
    otherwise: (fn: (value: unknown) => unknown) => fn(value),
});

export default Matcher;
