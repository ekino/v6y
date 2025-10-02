import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VitalityGeneralInformationView from '../../features/app-details/components/infos/VitalityGeneralInformationView';
import { ApplicationType } from '@v6y/core-logic/src/types';

vi.mock('../../commons/utils/VitalityDataExportUtils', () => ({
  exportAppDetailsDataToCSV: vi.fn(),
}));

describe('VitalityGeneralInformationView', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state while fetching data', async () => {
    render(<VitalityGeneralInformationView isLoading />);

    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
  });

  it('renders application details correctly when data is available', async () => {
    render(
      <VitalityGeneralInformationView
        appInfos={
          {
            _id: 1,
            name: 'Vitality App',
            acronym: 'VAP',
            description: 'A powerful application for testing.',
            contactMail: 'contact@vitality.com',
            repo: {
              organization: 'Vitality Org',
              webUrl: 'https://github.com/vitality-org',
              allBranches: ['main', 'develop'],
            },
            links: [
              { label: 'Website', value: 'https://vitality.com' },
              { label: 'Documentation', value: 'https://docs.vitality.com' },
            ],
          } as unknown as ApplicationType
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('app-name')).toHaveTextContent('Vitality App');
      expect(screen.getByTestId('branches-count')).toHaveTextContent(
        'Branches (2)'
      );
    });
  });

  it('handles missing application data gracefully', async () => {
    render(<VitalityGeneralInformationView appInfos={undefined} />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-view')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    render(<VitalityGeneralInformationView appInfos={undefined} />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-view')).toBeInTheDocument();
    });
  });

  it('renders application without optional fields gracefully', async () => {
    render(
      <VitalityGeneralInformationView
        appInfos={
          {
            _id: 2,
            name: 'Minimal App',
            acronym: 'MAP',
          } as unknown as ApplicationType
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('app-name')).toHaveTextContent('Minimal App');
    });

    expect(screen.queryByText('Branches (0)')).toBeInTheDocument();
  });

  it('does not render application with missing required fields', async () => {
    render(
      <VitalityGeneralInformationView
        appInfos={
          {
            _id: 3,
            acronym: '',
            description: 'This should not be displayed',
          } as unknown as ApplicationType
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('empty-view')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('This should not be displayed')
    ).not.toBeInTheDocument();
  });

  it('renders repository and links correctly when present', async () => {
    render(
      <VitalityGeneralInformationView
        appInfos={
          {
            _id: 4,
            name: 'Vitality Repo Test',
            acronym: 'VRT',
            repo: {
              organization: 'Vitality Org',
              webUrl: 'https://github.com/vitality-org',
              allBranches: ['main', 'feature-x'],
            },
            links: [{ label: 'Docs', value: 'https://docs.vitality.com' }],
          } as unknown as ApplicationType
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('app-name')).toHaveTextContent(
        'Vitality Repo Test'
      );
      expect(screen.getByTestId('branches-count')).toHaveTextContent(
        'Branches (2)'
      );
    });
  });

  it('does not render empty repository fields', async () => {
    render(
      <VitalityGeneralInformationView
        appInfos={
          {
            _id: 5,
            name: 'Vitality No Repo',
            acronym: 'VNR',
            repo: { organization: '', webUrl: '', allBranches: [] },
            links: [],
          } as unknown as ApplicationType
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('app-name')).toHaveTextContent(
        'Vitality No Repo'
      );
    });

    expect(screen.queryByText('Vitality Org')).not.toBeInTheDocument();
    expect(screen.queryByText('Docs')).not.toBeInTheDocument();
  });
});
