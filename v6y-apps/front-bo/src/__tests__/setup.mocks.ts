import React from 'react';
import { vi } from 'vitest';

export const mockPush = vi.fn();

vi.mock('next/headers', () => ({
    cookies: vi.fn(async () => ({
        get: vi.fn((name: string) => {
            if (name === 'auth') {
                return { value: 'mock-auth-token' };
            }
            return undefined;
        }),
        set: vi.fn(),
        delete: vi.fn(),
    })),
    headers: vi.fn(() => ({
        get: vi.fn(),
    })),
}));

vi.mock('@refinedev/core', () => ({
    useList: vi.fn(() => ({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
    })),
    useCreate: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false,
        isSuccess: false,
    })),
    useUpdate: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false,
        isSuccess: false,
    })),
    useDelete: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false,
        isSuccess: false,
    })),
    useOne: vi.fn(() => ({
        data: null,
        isLoading: false,
        error: null,
    })),
}));

vi.mock('react-i18next', () => ({
    useTranslation: vi.fn(() => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
            language: 'en',
        },
    })),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

export {};
