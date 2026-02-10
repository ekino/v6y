import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccountType } from '@v6y/core-logic/src/types/AccountType';
import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import { AuditHelpType } from '@v6y/core-logic/src/types/AuditHelpType';
import { DependencyStatusHelpType } from '@v6y/core-logic/src/types/DependencyStatusHelpType';
import { DeprecatedDependencyType } from '@v6y/core-logic/src/types/DeprecatedDependencyType';
import { EvolutionHelpType } from '@v6y/core-logic/src/types/EvolutionHelpType';
import { FaqType } from '@v6y/core-logic/src/types/FaqType';
import { LinkType } from '@v6y/core-logic/src/types/LinkType';
import { NotificationType } from '@v6y/core-logic/src/types/NotificationType';

import {
    formatAccountDetails,
    formatApplicationDetails,
    formatAuditHelpDetails,
    formatDependencyStatusHelpDetails,
    formatDeprecatedDependencyDetails,
    formatEvolutionHelpDetails,
    formatFaqDetails,
    formatNotificationDetails,
} from '../commons/config/VitalityDetailsConfig';

const mockTranslate = vi.fn((key) => key);

describe('VitalityDetailsConfig - Formatting Functions', () => {
    it('formats account details correctly', () => {
        const account: AccountType = {
            username: 'TestUser',
            email: 'test@example.com',
            role: 'Admin',
            applications: [1, 2],
        };

        const result = formatAccountDetails(mockTranslate, account);

        expect(result).toEqual({
            'v6y-accounts.fields.account-username.label': 'TestUser',
            'v6y-accounts.fields.account-email.label': 'test@example.com',
            'v6y-accounts.fields.account-role.label': 'Admin',
            'v6y-accounts.fields.account-applications.label': '1, 2',
        });

        expect(mockTranslate).toHaveBeenCalledWith('v6y-accounts.fields.account-username.label');
        expect(mockTranslate).toHaveBeenCalledWith('v6y-accounts.fields.account-email.label');
    });

    it('formats application details correctly', () => {
        const application: ApplicationType = {
            _id: 1,
            name: 'TestApp',
            acronym: 'TA',
            description: 'This is a test application',
            contactMail: 'contact@test.com',
            repo: { gitUrl: 'https://github.com/testapp' },
            links: [{ label: 'Homepage', value: 'https://testapp.com' }] as LinkType[],
        };

        const result = formatApplicationDetails(mockTranslate, application);

        expect(result['v6y-applications.fields.app-name.label']).toBe('TestApp');
        expect(result['v6y-applications.fields.app-links.label']).toBeDefined();

        render(result['v6y-applications.fields.app-links.label']);
        expect(screen.getByRole('link')).toHaveTextContent('Homepage');
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://testapp.com');
    });

    it('formats FAQ details correctly', () => {
        const faq: FaqType = {
            title: 'What is this?',
            description: 'This is a test FAQ entry.',
            links: [{ label: 'Learn More', value: 'https://faq.com' }] as LinkType[],
        };

        const result = formatFaqDetails(mockTranslate, faq);

        expect(result['v6y-faqs.fields.faq-title.label']).toBe('What is this?');
        expect(result['v6y-faqs.fields.faq-links.label']).toBeDefined();

        render(result['v6y-faqs.fields.faq-links.label']);
        expect(screen.getByRole('link')).toHaveTextContent('Learn More');
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://faq.com');
    });

    it('formats notification details correctly', () => {
        const notification: NotificationType = {
            title: 'New Update!',
            description: 'An important update is available.',
            links: [{ label: 'Update Details', value: 'https://updates.com' }] as LinkType[],
        };

        const result = formatNotificationDetails(mockTranslate, notification);
        expect(result['v6y-notifications.fields.notification-title.label']).toBe('New Update!');

        render(result['v6y-notifications.fields.notification-links.label']);
        expect(screen.getByRole('link')).toHaveTextContent('Update Details');
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://updates.com');
    });

    it('formats evolution help details correctly', () => {
        const evolutionHelp: EvolutionHelpType = {
            category: 'Performance',
            status: 'In Progress',
            title: 'Optimizing Load Times',
            description: 'Improvements to application performance.',
            links: [{ label: 'Docs', value: 'https://docs.com' }] as LinkType[],
        };

        const result = formatEvolutionHelpDetails(mockTranslate, evolutionHelp);
        expect(result['v6y-evolution-helps.fields.evolution-help-title.label']).toBe(
            'Optimizing Load Times',
        );

        render(result['v6y-evolution-helps.fields.evolution-help-link.label']);
        expect(screen.getByRole('link')).toHaveTextContent('Docs');
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://docs.com');
    });

    it('formats audit help details correctly', () => {
        const auditHelp: AuditHelpType = {
            category: 'Security',
            title: 'Encryption Best Practices',
            description: 'Guidelines for securing data.',
            explanation: 'Use strong encryption methods.',
        };

        const result = formatAuditHelpDetails(mockTranslate, auditHelp);
        expect(result['v6y-audit-helps.fields.audit-help-title.label']).toBe(
            'Encryption Best Practices',
        );
    });

    it('formats dependency status help details correctly', () => {
        const dependencyStatusHelp: DependencyStatusHelpType = {
            category: 'Outdated',
            title: 'Update Required',
            description: 'This package is outdated.',
            links: [{ label: 'Migration Guide', value: 'https://migrate.com' }] as LinkType[],
        };

        const result = formatDependencyStatusHelpDetails(mockTranslate, dependencyStatusHelp);
        expect(
            result['v6y-dependency-status-helps.fields.dependency-status-help-title.label'],
        ).toBe('Update Required');

        render(result['v6y-dependency-status-helps.fields.dependency-status-help-links.label']);
        expect(screen.getByRole('link')).toHaveTextContent('Migration Guide');
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://migrate.com');
    });

    it('formats deprecated dependency details correctly', () => {
        const deprecatedDependency: DeprecatedDependencyType = {
            name: 'OldLib',
        };

        const result = formatDeprecatedDependencyDetails(mockTranslate, deprecatedDependency);
        expect(result['v6y-deprecated-dependencies.fields.deprecated-dependency-name.label']).toBe(
            'OldLib',
        );
    });

    it('returns an empty object if details are empty', () => {
        expect(formatAccountDetails(mockTranslate, {} as AccountType)).toEqual({});
        expect(formatApplicationDetails(mockTranslate, {} as ApplicationType)).toEqual({});
        expect(formatFaqDetails(mockTranslate, {} as FaqType)).toEqual({});
        expect(formatNotificationDetails(mockTranslate, {} as NotificationType)).toEqual({});
        expect(formatEvolutionHelpDetails(mockTranslate, {} as EvolutionHelpType)).toEqual({});
        expect(formatAuditHelpDetails(mockTranslate, {} as AuditHelpType)).toEqual({});
        expect(
            formatDependencyStatusHelpDetails(mockTranslate, {} as DependencyStatusHelpType),
        ).toEqual({});
        expect(
            formatDeprecatedDependencyDetails(mockTranslate, {} as DeprecatedDependencyType),
        ).toEqual({});
    });

    it('should return an empty object when account details are missing', () => {
        const result = formatAccountDetails(mockTranslate, {} as AccountType);
        expect(result).toEqual({});
    });
});
