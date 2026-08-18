import { posix as posixPath } from 'node:path';

type QueryParamValue = string | number | boolean | undefined | null;

type BuildHttpUrlOptions = {
    protocol?: string;
    hostname?: string;
    port?: string | number;
    path?: string | (string | undefined | null)[];
    query?: Record<string, QueryParamValue>;
};

/**
 * Join URL path segments into a single, slash-normalized pathname.
 * Collapses duplicate slashes and always keeps a single leading slash, so
 * callers never have to reason about leading/trailing slashes themselves.
 */
const joinUrlPath = (...segments: (string | undefined | null)[]): string => {
    const cleaned = segments.filter((segment): segment is string => Boolean(segment?.length));
    if (!cleaned.length) {
        return '/';
    }
    return posixPath.join('/', ...cleaned);
};

/**
 * Append query parameters to a URL, skipping nullish/empty values and letting
 * URLSearchParams handle encoding.
 */
const appendQueryParams = (url: string | URL, params: Record<string, QueryParamValue>): string => {
    const target = url instanceof URL ? url : new URL(url);
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }
        target.searchParams.set(key, String(value));
    }
    return target.toString();
};

/**
 * Build an absolute HTTP(S) URL from its parts using the WHATWG URL API, so
 * path joining and encoding are handled consistently (no double slashes).
 */
const buildHttpUrl = ({
    protocol = 'http',
    hostname = 'localhost',
    port,
    path,
    query,
}: BuildHttpUrlOptions): string => {
    const url = new URL(`${protocol.replace(/:$/, '')}://${hostname}`);
    if (port !== undefined && port !== null && String(port).length) {
        url.port = String(port);
    }
    const segments = Array.isArray(path) ? path : [path];
    url.pathname = joinUrlPath(...segments);
    return query ? appendQueryParams(url, query) : url.toString();
};

const UrlUtils = {
    joinUrlPath,
    appendQueryParams,
    buildHttpUrl,
};

export { joinUrlPath, appendQueryParams, buildHttpUrl };
export default UrlUtils;
