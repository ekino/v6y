import { vi } from 'vitest';

import './setupTests';

Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue: () => {
            return '';
        },
    }),
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Chart libraries (e.g. recharts' ResponsiveContainer) observe their
// container's size; jsdom has no layout engine so this must be stubbed
// globally rather than per-test.
vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    },
);

// recharts v3's ResponsiveContainer measures its parent via
// getBoundingClientRect and refuses to render children at 0x0; jsdom reports
// 0 for all layout, so give elements a non-zero size during tests.
HTMLElement.prototype.getBoundingClientRect = function () {
    return {
        width: 320,
        height: 200,
        top: 0,
        left: 0,
        bottom: 200,
        right: 320,
        x: 0,
        y: 0,
        toJSON: () => ({}),
    } as DOMRect;
};
