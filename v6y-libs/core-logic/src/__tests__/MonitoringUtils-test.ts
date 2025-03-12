import { describe, expect, it } from 'vitest';

import MonitoringUtils from '../utils/MonitoringUtils.ts';
import mockDatadogEvents from './mockDataDogEventsData.json' with { type: 'json' };

const { convertDataDogEventsToMonitoringEvents } = MonitoringUtils;

describe('MonitoringUtils', () => {
    it('should convert DataDog events to monitoring events', () => {
        const dateStartTimeStamp = 1740489689000;
        const dateEndTimeStamp = 1740561729000;

        const result = convertDataDogEventsToMonitoringEvents({
            dataDogEvents: mockDatadogEvents.data,
            dateStartTimeStamp,
            dateEndTimeStamp,
        });

        expect(result).not.toBeNull();
        expect(result).toHaveLength(3);
        expect(result).toEqual([
            {
                id: 'AwAAAZU9SDv4Jr7GUwAAABhBWlU5U0QzU0FBRGozNVdZcDdkcGdBUXYAAAAkMDE5NTNkNjYtZTNhMC00NGQ2LWE5ZWMtNTg1MDVjMmQ3MGYzAAAAAQ',
                status: 'error',
                timestamp: 1740489899000,
                type: 'event',
            },
            {
                id: 'AwAAAZU9ZuOgKgrGUwAAABhBWlU5WnVZMEFBQ1o2N2RFMnN1WldyUzIAAAAkMDE5NTNkNjYtZTNhMC00NGQ2LWE5ZWMtNTg1MDVjMmQ3MGYzAAAAAg',
                status: 'success',
                timestamp: 1740491908000,
                type: 'event',
            },
            {
                id: 'AwAAAZVBkB7YdVxDLAAAABhBWlZCa0NGUUFBQXIyb3I1SlpMc2IyLXoAAAAkMDE5NTQxOTAtMWVkOC00YWVhLTgyMzctODhmYzEyNWNmYTA2AAAAAA',
                status: 'error',
                timestamp: 1740561719000,
                type: 'event',
            },
        ]);
    });
});
