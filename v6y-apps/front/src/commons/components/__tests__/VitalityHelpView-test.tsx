// VitalityHelpView.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import VitalityTerms from '../../config/VitalityTerms';
import VitalityHelpView from '../help/VitalityHelpView';

describe('VitalityHelpView', () => {
    const mockModule = {
        branch: '1-poc-auth-obtenir-un-jwt',
        path: '/Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/1-poc-auth-obtenir-un-jwt/apps/front/package.json',
        name: '',
        label: '',
        type: 'Code-Complexity',
        category: 'maintainability-index-project-average',
        score: 76.76,
        scoreUnit: '%',
        status: 'warning',
        auditHelp: {
            category: 'Code-Complexity-maintainability-index-project-average',
            title: 'Default Title',
            description: 'Default Description',
            explanation: 'Default Explanation',
        },
        statusHelp: undefined,
        evolutionHelp: undefined,
    };

    it('should render the component with module help details', () => {
        render(<VitalityHelpView module={mockModule} />);

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Code-Complexity-maintainability-index-project-average'),
        ).toBeInTheDocument();

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_TITLE_LABEL),
        ).toBeInTheDocument();
        expect(screen.getByText('Default Title')).toBeInTheDocument();

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_DESCRIPTION_LABEL),
        ).toBeInTheDocument();
        expect(screen.getByText('Default Description')).toBeInTheDocument();

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_EXPLANATION_LABEL),
        ).toBeInTheDocument();
        expect(screen.getByText('Default Explanation')).toBeInTheDocument();

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_BRANCH_LABEL),
        ).toBeInTheDocument();
        expect(screen.getByText('1-poc-auth-obtenir-un-jwt')).toBeInTheDocument();

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_PATH_LABEL),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '/Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/1-poc-auth-obtenir-un-jwt/apps/front/package.json',
            ),
        ).toBeInTheDocument();
    });

    it('should not render missing help details', () => {
        const mockModuleWithoutHelp = {
            ...mockModule,
            auditHelp: {
                category: '',
                title: '',
                description: '',
                explanation: '',
            },
            branch: '',
            path: '',
        };

        render(<VitalityHelpView module={mockModuleWithoutHelp} />);

        expect(
            screen.queryByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_TITLE_LABEL),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_DESCRIPTION_LABEL),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_EXPLANATION_LABEL),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_BRANCH_LABEL),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_DETECT_ON_PATH_LABEL),
        ).not.toBeInTheDocument();
    });

    it('should render statusHelp if auditHelp is not available', () => {
        const mockModuleWithStatusHelp = {
            ...mockModule,
            auditHelp: undefined,
            statusHelp: {
                category: 'Status Category',
                title: 'Status Title',
                description: 'Status Description',
                explanation: 'Status Explanation',
            },
        };

        render(<VitalityHelpView module={mockModuleWithStatusHelp} />);

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL),
        ).toBeInTheDocument();
        expect(screen.getByText('Status Category')).toBeInTheDocument();
    });

    it('should render evolutionHelp if auditHelp and statusHelp are not available', () => {
        const mockModuleWithEvolutionHelp = {
            ...mockModule,
            auditHelp: undefined,
            statusHelp: undefined,
            evolutionHelp: {
                category: 'Evolution Category',
                title: 'Evolution Title',
                description: 'Evolution Description',
                explanation: 'Evolution Explanation',
            },
        };

        render(<VitalityHelpView module={mockModuleWithEvolutionHelp} />);

        expect(
            screen.getByText(VitalityTerms.VITALITY_APP_DETAILS_AUDIT_HELP_CATEGORY_LABEL),
        ).toBeInTheDocument();
        expect(screen.getByText('Evolution Category')).toBeInTheDocument();
    });
});
