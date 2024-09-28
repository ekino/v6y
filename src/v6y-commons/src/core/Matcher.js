const matched = (value) => ({
    on: () => matched(value),
    otherwise: () => value,
});
const Matcher = (value = null) => ({
    on: (predicate, fn) => predicate(value) ? matched(fn(value)) : Matcher(value),
    otherwise: (fn) => fn(value),
});
export default Matcher;
