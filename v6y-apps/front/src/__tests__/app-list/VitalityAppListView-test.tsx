import '@testing-library/jest-dom/vitest';
import type React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

// Stub only the navigation hook module so we don't import the whole ui-kit barrel
// which can pull in heavy/SSR code paths (and third-party ESM import quirks).
vi.mock('@v6y/ui-kit/src/hooks/useNavigationAdapter', () => ({
  useNavigationAdapter: () => ({
    getUrlParams: (keys?: string[]) => (keys ? keys.map(() => undefined) : undefined),
    createUrlQueryParam: () => '',
    removeUrlQueryParam: () => '',
    urlParams: '',
    pathname: '/',
    router: { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() },
    redirect: { to: () => {} },
  }),
}));

// Mock next/navigation to avoid "invariant expected app router to be mounted" when
// components (or ui-kit hooks) call useRouter/useSearchParams/usePathname/redirect.
vi.mock('next/navigation', () => {
  const URLSearchParams = globalThis.URLSearchParams;
  return {
    useSearchParams: () => new URLSearchParams(''),
    usePathname: () => '/',
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
    redirect: () => {},
  };
});

// Provide lightweight mocks for ui-kit-front primitives used by VitalitySearchBar
vi.mock('@v6y/ui-kit-front', async () => {
  const React = await vi.importActual<typeof import('react')>('react');
  return {
    Input: (props: Record<string, unknown>) => {
      const p = props as unknown as React.InputHTMLAttributes<HTMLInputElement>;
      return React.createElement('input', { 'data-testid': 'mock-search-input', ...p });
    },
    Button: (props: Record<string, unknown>) => {
      const p = props as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>;
      return React.createElement('button', { 'data-testid': 'mock-search-button', ...p }, p.children);
    },
  };
});

vi.mock('@v6y/core-logic', async () => {
    vi.importActual('@v6y/core-logic');
});

import VitalityAppList from '../../features/app-list/components/VitalityAppList';
import VitalityAppListHeader from '../../features/app-list/components/VitalityAppListHeader';
import VitalityAppListView from '../../features/app-list/components/VitalityAppListView';
import {
  useClientQuery,
  useInfiniteClientQuery,
} from '../../infrastructure/adapters/api/useQueryAdapter';

vi.mock('../../infrastructure/adapters/api/useQueryAdapter', () => {
  return {
    useClientQuery: vi.fn(() => ({
      isLoading: false,
      data: { getApplicationTotalByParams: 0 },
      refetch: vi.fn(),
    })),
    useInfiniteClientQuery: vi.fn(() => ({
      status: 'success',
      data: { pages: [] }, //  Always return a valid object
      fetchNextPage: vi.fn(),
      isFetching: false,
      isFetchingNextPage: false,
    })),
  };
});

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
  exportAppListDataToCSV: vi.fn(),
}));

describe('VitalityAppListView', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders search bar, selectable indicators, and app list', async () => {
    render(<VitalityAppListView />);
    expect(
      screen.getByText('vitality.searchPage.inputLabel')
    ).toBeInTheDocument();
    expect(
      screen.getByText('vitality.searchPage.inputHelper')
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-search-input')).toBeInTheDocument();
  });

  it('renders applications when data is available', async () => {
    (useInfiniteClientQuery as Mock).mockReturnValue({
      status: 'success',
      data: {
        pages: [
          {
            getApplicationListByPageAndParams: [
              { _id: 1, name: 'Vitality App' },
            ],
          },
        ],
      },
    });

    render(<VitalityAppList />);

    await waitFor(() => {
      expect(screen.getByText('Vitality App')).toBeInTheDocument();
    });
  });

  it('handles empty application list gracefully', async () => {
    (useInfiniteClientQuery as Mock).mockReturnValue({
      status: 'success',
      data: { pages: [] },
    });

    render(<VitalityAppList />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-view')).toBeInTheDocument();
    });
  });

  it('filters applications based on search and keywords', async () => {
    (useInfiniteClientQuery as Mock).mockReturnValue({
      status: 'success',
      data: {
        pages: [
          {
            getApplicationListByPageAndParams: [
              { _id: 3, name: 'Filtered App' },
            ],
          },
        ],
      },
    });

    render(<VitalityAppList />);

    await waitFor(() => {
      expect(screen.getByText('Filtered App')).toBeInTheDocument();
    });
  });

  it('shows total applications count when data is available', async () => {
    (useClientQuery as Mock).mockReturnValue({
      isLoading: false,
      data: { getApplicationTotalByParams: 25 },
    });
    render(<VitalityAppListHeader onExportApplicationsClicked={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.getByText('vitality.appListPage.totalLabel 25')
      ).toBeInTheDocument();
    });
  });
});
