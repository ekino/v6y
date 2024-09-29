const matched = (value: unknown) => ({
    with: () => matched(value),
    otherwise: () => value,
});

const Matcher = (value: unknown = null) => ({
    with: (predicate: (value: unknown) => boolean, fn: (value: unknown) => unknown) =>
        predicate(value) ? matched(fn(value)) : Matcher(value),
    otherwise: (fn: (value: unknown) => unknown) => fn(value),
});

export default Matcher;
