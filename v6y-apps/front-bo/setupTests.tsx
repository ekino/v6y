/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup } from '@testing-library/react';
import { List } from '@v6y/ui-kit/components/atoms/app/List.tsx';
import dynamic from 'next/dynamic';
import { afterEach, beforeEach, vi } from 'vitest';

vi.mock('next/dynamic', async () => {
    const dynamicModule = await vi.importActual<typeof import('next/dynamic')>('next/dynamic');
    return {
        default: (loader: () => Promise<{ default: React.ComponentType<any> }>) => {
            const DynamicComponent = dynamicModule.default(loader, { ssr: false });

            // Force preload if available
            if (DynamicComponent.preload) {
                DynamicComponent.preload();
            }

            return DynamicComponent;
        },
    };
});

const formErrors: Record<string, { message: string }> = {}; // Global error state for the mock

beforeEach(() => {
    Object.keys(formErrors).forEach((key) => delete formErrors[key]); // Clear all errors before each test
});

afterEach(() => {
    cleanup();
});

vi.mock('@v6y/ui-kit/components/atoms/admin/DeleteButton', () => ({
    default: vi.fn(({ recordItemId }) => (
        <button data-testid={`delete-${recordItemId}`} />
    )),
}));

vi.mock('@v6y/ui-kit/components/atoms/admin/EditButton', () => ({
    default: vi.fn(({ recordItemId }) => <button data-testid={`edit-${recordItemId}`} />),
}));

vi.mock('@v6y/ui-kit/components/atoms/admin/ShowButton', () => ({
    default: vi.fn(({ recordItemId }) => <button data-testid={`show-${recordItemId}`} />),
}));

vi.mock('@v6y/ui-kit/components/atoms/app/Space', () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@v6y/ui-kit/components/types/AdminTableType', () => ({
    default: {},
}));

vi.mock('@v6y/ui-kit/components/atoms/app/Table', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table">{children}</div>,
}));

vi.mock('@v6y/ui-kit/components/atoms/app/Descriptions', () => ({
    default: Object.assign(
        ({ children }: { children: React.ReactNode }) => (
            <dl data-testid="mock-descriptions">{children}</dl>
        ),
        {
            Item: ({ label, children }: { label: string; children: React.ReactNode }) => {
                return (
                    <div data-testid="mock-descriptions-item">
                        <dt data-testid="mock-label">{label}</dt>
                        <dd data-testid="mock-value">{children}</dd>
                    </div>
                );
            },
        },
    ),
}));

vi.mock('@v6y/ui-kit/components/organisms/app/TextView', () => ({
    default: ({ content }: { content: string }) => <span>{content}</span>,
}));

vi.mock('@v6y/ui-kit/api/types/AdminHttpError', () => ({
    AdminHttpError: class AdminHttpError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'AdminHttpError';
        }
    },
}));

vi.mock('@v6y/ui-kit/components/atoms/app/Result', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-result">{children}</div>,
}));

vi.mock('@v6y/ui-kit/translation/useTranslationProvider', () => ({
    default: vi.fn(() => ({
        translate: vi.fn((key) => key),
        t: vi.fn((key) => key),
    })),
}));

vi.mock('@v6y/ui-kit/components/pages/admin/AdminAuthenticatedWrapper', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-auth-wrapper">{children}</div>,
}));

vi.mock('@v6y/ui-kit/components/organisms/admin/AdminErrorView', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-error-view">{children}</div>,
}));

vi.mock('@v6y/ui-kit/components/pages/admin/AdminNavigationWrapper', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-nav-wrapper">{children}</div>,
}));

vi.mock('@v6y/ui-kit/components/types/SelectOptionType', () => ({
    default: {},
}));

vi.mock('@v6y/ui-kit/translation/TranslationType', () => ({
    default: {},
}));

vi.mock('@v6y/ui-kit/components/organisms/app/Links', () => ({
    default: ({ links }: { links: Array<{ label: string; value: string }> }) => (
        <ul>
            {links.map((link, index) => (
                <li key={index}>
                    <a href={link.value}>{link.label}</a>
                </li>
            ))}
        </ul>
    ),
}));

vi.mock('@v6y/ui-kit/providers/types/AdminAuthProviderType', () => ({
    AdminAuthProviderType: {},
}));

vi.mock('@v6y/ui-kit/providers/admin/AdminDataProvider', () => ({
    createDataProvider: vi.fn(() => ({})),
    createLiveProvider: vi.fn(() => ({})),
}));

vi.mock('@v6y/ui-kit/providers/admin/AdminProvider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-admin-provider">{children}</div>,
}));
