// VitalityNotificationList.test.tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { NotificationType } from '@v6y/core-logic/src';
import { VitalityCollapse, VitalityLinks } from '@v6y/shared-ui';
import { describe, expect, it, vi } from 'vitest';

import VitalityNotificationList from '../VitalityNotificationList';

// Mock VitalityCollapse and VitalityLinks
vi.mock('@v6y/shared-ui');
vi.mock('@v6y/shared-ui');

describe('VitalityNotificationList', () => {
    const mockDataSource: NotificationType[] = [
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
            // This Notification item should be filtered out because it has no title
            description: 'Answer 3',
            links: [
                {
                    label: 'Link 2',
                    value: 'https://link2.com',
                },
            ],
        },
    ];

    it('should render the component with Notification items', () => {
        render(<VitalityNotificationList dataSource={mockDataSource} />);

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

    it('should filter out Notification items without a title', () => {
        render(<VitalityNotificationList dataSource={mockDataSource} />);

        // Check that the Notification item without a title is not rendered
        expect(screen.queryByText('Answer 3')).not.toBeInTheDocument();
        expect(VitalityLinks).not.toHaveBeenCalledWith(
            expect.objectContaining({ links: mockDataSource[2].links }),
            expect.anything(),
        );
    });
});
