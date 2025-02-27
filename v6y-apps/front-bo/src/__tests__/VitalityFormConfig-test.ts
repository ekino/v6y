import '@testing-library/jest-dom/vitest';
import { ApplicationType, LinkType } from '@v6y/core-logic/src/types';
import { describe, expect, it, vi } from 'vitest';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormInAdapter,
    applicationCreateOrEditFormOutputAdapter,
    applicationGitRepositoryFormItems,
    applicationInfosFormItems,
    applicationOptionalLinksFormItems,
    applicationRequiredLinksFormItems,
} from '../commons/config/VitalityFormConfig';

const mockTranslate = vi.fn((key) => key);

describe('VitalityFormConfig - Form Items', () => {
    it('should generate application info form items with correct translations', () => {
        const result = applicationInfosFormItems(mockTranslate);

        expect(result).toHaveLength(4);
        expect(result[0].id).toBe('app-name');
        expect(result[0].label).toBe('v6y-applications.fields.app-name.label');
        expect(result[0].rules[0].message).toBe('v6y-applications.fields.app-name.error');
    });

    it('should generate application git repository form items correctly', () => {
        const result = applicationGitRepositoryFormItems(mockTranslate);

        expect(result).toHaveLength(3);
        expect(result[0].id).toBe('app-git-organization');
        expect(result[1].id).toBe('app-git-web-url');
        expect(result[2].id).toBe('app-git-url');
    });

    it('should generate required application links form items correctly', () => {
        const result = applicationRequiredLinksFormItems(mockTranslate);

        expect(result).toHaveLength(3);
        expect(result[0].id).toBe('app-production-link-1');
        expect(result[1].id).toBe('app-production-link-2');
        expect(result[2].id).toBe('app-production-link-3');
    });

    it('should generate optional application links form items correctly', () => {
        const result = applicationOptionalLinksFormItems(mockTranslate);

        expect(result).toHaveLength(3);
        expect(result[0].id).toBe('app-code-quality-platform-link');
        expect(result[1].id).toBe('app-ci-cd-platform-link');
        expect(result[2].id).toBe('app-deployment-platform-link');
    });

    it('should correctly adapt application data for form input', () => {
        const application: ApplicationType = {
            _id: 1,
            name: 'TestApp',
            acronym: 'TA',
            description: 'Test Application',
            contactMail: 'test@example.com',
            repo: {
                organization: 'TestOrg',
                webUrl: 'https://testrepo.com',
                gitUrl: 'https://git.testrepo.com',
            },
            links: [
                { label: 'Application production url', value: 'https://testapp.com' },
                { label: 'Additional production url (1)', value: 'https://testapp2.com' },
                { label: 'Additional production url (2)', value: 'https://testapp3.com' },
            ] as LinkType[],
        };

        const result = applicationCreateOrEditFormInAdapter(application);
        expect(result).toEqual({
            _id: 1,
            'app-name': 'TestApp',
            'app-acronym': 'TA',
            'app-description': 'Test Application',
            'app-contact-email': 'test@example.com',
            'app-git-organization': 'TestOrg',
            'app-git-web-url': 'https://testrepo.com',
            'app-git-url': 'https://git.testrepo.com',
            'app-production-link-1': 'https://testapp.com',
            'app-production-link-2': 'https://testapp2.com',
            'app-production-link-3': 'https://testapp3.com',
        });
    });

    it('should correctly adapt application form output for API submission', () => {
        const formData = {
            _id: 1,
            'app-name': 'TestApp',
            'app-acronym': 'TA',
            'app-description': 'Test Application',
            'app-contact-email': 'test@example.com',
            'app-git-organization': 'TestOrg',
            'app-git-web-url': 'https://testrepo.com',
            'app-git-url': 'https://git.testrepo.com',
            'app-production-link-1': 'https://testapp.com',
            'app-production-link-2': 'https://testapp2.com',
            'app-production-link-3': 'https://testapp3.com',
        };

        const result = applicationCreateOrEditFormOutputAdapter(formData);
        expect(result).toEqual({
            applicationInput: {
                _id: 1,
                name: 'TestApp',
                acronym: 'TA',
                description: 'Test Application',
                contactMail: 'test@example.com',
                gitOrganization: 'TestOrg',
                gitWebUrl: 'https://testrepo.com',
                gitUrl: 'https://git.testrepo.com',
                productionLink: 'https://testapp.com',
                additionalProductionLinks: ['https://testapp2.com', 'https://testapp3.com'],
            },
        });
    });

    it('should handle empty links correctly in form output adapter', () => {
        const formData = {
            _id: 1,
            'app-name': 'TestApp',
            'app-description': 'Test Application',
            'app-git-url': 'https://git.testrepo.com',
            'app-contact-email': 'test@example.com',
            'app-production-link-1': '',
            'app-production-link-2': '',
            'app-production-link-3': '',
        };

        const result = applicationCreateOrEditFormOutputAdapter(formData);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(result.applicationInput.additionalProductionLinks).toEqual([]);
    });

    it('should handle missing application fields gracefully', () => {
        const application: Partial<ApplicationType> = {
            _id: 2,
            name: 'PartialApp',
            repo: {
                gitUrl: 'https://git.partial.com',
            },
        };

        const result = applicationCreateOrEditFormInAdapter(application as ApplicationType);
        expect(result).toEqual({
            _id: 2,
            'app-name': 'PartialApp',
            'app-acronym': undefined,
            'app-description': undefined,
            'app-contact-email': undefined,
            'app-git-organization': undefined,
            'app-git-web-url': undefined,
            'app-git-url': 'https://git.partial.com',
            'app-production-link-1': undefined,
            'app-production-link-2': undefined,
            'app-production-link-3': undefined,
        });
    });

    it('should return all form fields for application form', () => {
        const result = applicationCreateEditItems(mockTranslate);

        expect(result.length).toBeGreaterThan(0);
        result.forEach((fieldset) => {
            expect(fieldset).toBeDefined();
        });
    });
});
