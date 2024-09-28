declare const Matcher: (value?: unknown) => {
    on: (predicate: (value: unknown) => boolean, fn: (value: unknown) => unknown) => any;
    otherwise: (fn: (value: unknown) => unknown) => unknown;
};
export default Matcher;
