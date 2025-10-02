// Lightweight mock for next/navigation used during tests and import analysis
export const redirect = (_to: string) => {
    // no-op in tests
};

export const usePathname = () => '/';

export const useRouter = () => ({
    push: (_url: string) => {},
    replace: (_url: string) => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
});

export const useSearchParams = () => ({
    get: (_key: string) => null,
});
