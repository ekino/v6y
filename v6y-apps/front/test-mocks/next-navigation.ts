import { vi } from 'vitest';

export const redirect = vi.fn();
export const usePathname = () => '/';
export const useRouter = () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
});
export const useSearchParams = () => ({ get: (_key: string) => null });
