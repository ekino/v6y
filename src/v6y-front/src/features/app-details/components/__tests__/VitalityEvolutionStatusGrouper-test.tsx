// VitalityEvolutionStatusGrouper.test.tsx
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { EvolutionType } from '@v6y/commons';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import VitalityEvolutionStatusGrouper from '../evolutions/VitalityEvolutionStatusGrouper';

// Mock dynamic import to return the actual VitalityModulesView component
vi.mock('next/dynamic', () => ({
    default: vi.fn((callback) => callback().default),
}));

// Mock VitalityTabGrouperView
vi.mock('../../../../commons/components/VitalityTabGrouperView');

describe('VitalityEvolutionStatusGrouper', () => {
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
        render(<VitalityEvolutionStatusGrouper evolutions={mockEvolutions} />);

        expect(VitalityTabGrouperView).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'evolution_status_grouper_tab',
                ariaLabelledby: 'evolution_status_grouper_tab_content',
                align: 'center',
                criteria: 'status',
                hasAllGroup: false,
                dataSource: mockEvolutions,
            }),
            undefined,
        );
    });
});
