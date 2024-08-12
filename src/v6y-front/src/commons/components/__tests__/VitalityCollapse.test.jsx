import VitalityCollapse from '../VitalityCollapse.jsx';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import React from 'react';

const dataSource = [
    {
        title: 'Vitality Update Available!',
        color: '14',
        description:
            'Vitality v2.5 is now ready for download.  New features include enhanced performance monitoring and improved code analysis.',
        links: [
            {
                type: 'download',
                label: 'Update Now',
                value: 'https://downloads.vitality.app/v2.5',
            },
            {
                type: 'release-notes',
                label: 'Release Notes',
                value: 'https://docs.vitality.app/release-notes/v2.5',
            },
        ],
    },
];

describe('VitalityCollapse', () => {
    it('It should render VitalityCollapse (datasource not empty)', () => {
        render(<VitalityCollapse accordion bordered dataSource={dataSource} />);
        expect(screen.findByText('Vitality Update Available!')).toBeTruthy();
    });
});
