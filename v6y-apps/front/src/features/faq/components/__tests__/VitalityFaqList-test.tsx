// VitalityFaqList.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { FaqType } from '@v6y/core-logic/src';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import VitalityCollapse from '../../../../commons/components/VitalityCollapse';
import VitalityLinks from '../../../../commons/components/VitalityLinks';
import VitalityFaqList from '../VitalityFaqList';

// Mock VitalityCollapse
vi.mock('../../../../commons/components/VitalityCollapse');

// Mock VitalityLinks
vi.mock('../../../../commons/components/VitalityLinks');

describe('VitalityFaqList', () => {
    const mockDataSource: FaqType[] = [
        {
            title: 'Question 1',
            description: 'Answer 1',
            links: [
                {
                    label: 'Link 1',
                    value: 'https://link1.com',
                },
            ],
        },
        {
            title: 'Question 2',
            description: 'Answer 2',
        },
        {
            // This FAQ item should be filtered out because it has no title
            description: 'Answer 3',
            links: [
                {
                    label: 'Link 2',
                    value: 'https://link2.com',
                },
            ],
        },
    ];

    it('should render the component with FAQ items', () => {
        render(<VitalityFaqList dataSource={mockDataSource} />);

        expect(VitalityCollapse).toHaveBeenCalledWith(
            expect.objectContaining({
                accordion: true,
                bordered: true,
                dataSource: [
                    {
                        key: 'Question 1',
                        label: 'Question 1',
                        children: expect.anything(),
                        showArrow: true,
                    },
                    {
                        key: 'Question 2',
                        label: 'Question 2',
                        children: expect.anything(),
                        showArrow: true,
                    },
                ],
            }),
            undefined,
        );
    });

    it('should filter out FAQ items without a title', () => {
        render(<VitalityFaqList dataSource={mockDataSource} />);

        // Check that the FAQ item without a title is not rendered
        expect(screen.queryByText('Answer 3')).not.toBeInTheDocument();
        expect(VitalityLinks).not.toHaveBeenCalledWith(
            expect.objectContaining({ links: mockDataSource[2].links }),
            expect.anything(),
        );
    });
});
