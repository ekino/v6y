const matched = (x) => ({
    with: () => matched(x),
    otherwise: () => x,
});

export const Matcher = (value) => ({
    with: (predicat, fn) => (predicat(value) ? matched(fn(value)) : Matcher(value)),
    otherwise: (fn) => fn(value),
});
