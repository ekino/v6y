// VitalityEvolutionBranchGrouper.test.tsx
import { render } from '@testing-library/react';
import { EvolutionType } from '@v6y/commons';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import VitalityEvolutionBranchGrouper from '../evolutions/VitalityEvolutionBranchGrouper';

// Mock dynamic import to return the actual VitalityEvolutionStatusGrouper component
vi.mock('next/dynamic', () => ({
    default: vi.fn((callback) => callback().default),
}));

// Mock VitalitySelectGrouperView
vi.mock('../../../../commons/components/VitalitySelectGrouperView');

describe('VitalityEvolutionBranchGrouper', () => {
    const mockEvolutions: EvolutionType[] = [
        {
            _id: 57,
            appId: 1,
            category: 'Dependency-outdated',
            module: {
                appId: 1,
                url: 'https://gitlab.ekino.com/renault/mfs/myze-battery',
                branch: '1-poc-auth-obtenir-un-jwt',
                path: '/Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/1-poc-auth-obtenir-un-jwt/apps/front/package.json',
                status: 'outdated',
            },
            evolutionHelp: {
                category: 'Dependency-outdated',
                title: 'Default Title',
                description: 'Default Description',
                status: 'recommended',
                links: [],
            },
        },
        {
            _id: 58,
            appId: 1,
            category: 'Code-Complexity-maintainability-index',
            module: {
                appId: 1,
                url: 'https://gitlab.ekino.com/renault/mfs/myze-battery',
                branch: '1-poc-auth-obtenir-un-jwt',
                path: '/Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/1-poc-auth-obtenir-un-jwt/apps/front/package.json',
                status: 'outdated',
            },
            evolutionHelp: {
                _id: 12,
                category: 'Code-Complexity-maintainability-index',
                title: 'Default Title',
                description: 'Default Description',
                status: 'important',
                links: [],
            },
        },
    ];

    it('should render the component with evolutions', () => {
        render(<VitalityEvolutionBranchGrouper evolutions={mockEvolutions} />);

        expect(VitalitySelectGrouperView).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'evolution_branch_grouper_select',
                criteria: 'branch',
                hasAllGroup: true,
                placeholder: VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_PLACEHOLDER,
                label: VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_LABEL,
                helper: VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_HELPER,
                dataSource: mockEvolutions,
            }),
            expect.anything(),
        );
    });
});
