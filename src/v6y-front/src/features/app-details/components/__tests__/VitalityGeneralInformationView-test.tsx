import { render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useClientQuery } from '../../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import VitalityGeneralInformationView from '../infos/VitalityGeneralInformationView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

vi.mock('next/dynamic', async () => {
    return {
        __esModule: true,
        default: () => {
            const VitalityAppInfos = () => import("../../../../commons/components/application-info/VitalityAppInfos.tsx");
            return VitalityAppInfos;
        },
    };
});

// Mock useClientQuery
vi.mock('../../../../infrastructure/adapters/api/useQueryAdapter');

// Mock useNavigationAdapter
vi.mock('../../../../infrastructure/adapters/navigation/useNavigationAdapter');

describe('VitalityGeneralInformationView', () => {
    const mockAppDetailsInfo = {
        acronym: 'TA',
        contactMail: 'test@example.com',
        description: 'Test description',
        links: [
            {
                label: 'Production',
                value: 'https://test-app.com',
                description: '',
            },
        ],
        name: 'Test App',
        repo: {
            organization: 'test-org',
            webUrl: 'https://github.com/test-org/test-repo',
            gitUrl: 'https://github.com/test-org/test-repo',
            allBranches: ['main', 'develop'],

        },
        _id: 1,
    };

    beforeEach(() => {
        useClientQuery.mockReturnValue({
            isLoading: false,
            data: { getApplicationDetailsInfoByParams: mockAppDetailsInfo },
        });
        useNavigationAdapter.mockReturnValue({
            getUrlParams: vi.fn(() => ['1']),
            creatUrlQueryParam: vi.fn((key, value) => `${key}=${value}`),
        });
    });


    it('should render the component with app details',  async () => {
       render(<VitalityGeneralInformationView />);
       expect(screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_INFOS_TITLE)).toBeInTheDocument();
       
     waitFor(() => {
        expect(screen.getByText('Test App')).toBeInTheDocument();
        expect(screen.getByText('TA')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('test-org')).toBeInTheDocument();
        expect(screen.getByText('Production')).toBeInTheDocument();
    });
});
});