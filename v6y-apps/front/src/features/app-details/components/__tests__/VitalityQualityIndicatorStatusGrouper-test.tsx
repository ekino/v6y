// VitalityQualityIndicatorStatusGrouper.test.tsx
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { KeywordType } from '@v6y/core-logic/src/types';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import VitalityQualityIndicatorStatusGrouper from '../quality-indicators/VitalityQualityIndicatorStatusGrouper';

// Mock dynamic import to return the actual VitalityModulesView component
vi.mock('next/dynamic', () => ({
    default: vi.fn((callback) => callback().default),
}));

// Mock VitalityTabGrouperView
vi.mock('../../../../commons/components/VitalityTabGrouperView');

describe('VitalityQualityIndicatorStatusGrouper', () => {
    const mockIndicators: KeywordType[] = [
        {
            label: 'Indicator 1',
            status: 'success',
            // ... other properties
        },
        {
            label: 'Indicator 2',
            status: 'warning',
            // ... other properties
        },
        {
            label: 'Indicator 3',
            status: 'deprecated',
            // ... other properties
        },
    ];

    it('should render the component with indicators', () => {
        render(<VitalityQualityIndicatorStatusGrouper indicators={mockIndicators} />);

        expect(VitalityTabGrouperView).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'quality_indicator_grouper_tab',
                ariaLabelledby: 'quality_indicator_grouper_tab_content',
                align: 'center',
                criteria: 'status',
                hasAllGroup: false,
                dataSource: [
                    mockIndicators[2], // deprecated first
                    mockIndicators[1], // then warning
                    mockIndicators[0], // then success
                ],
            }),
            undefined,
        );
    });
});
