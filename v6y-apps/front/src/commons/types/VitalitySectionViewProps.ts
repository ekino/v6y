import * as React from 'react';

import { Avatar } from '@v6y/ui-kit';

export interface VitalitySectionViewProps {
    isLoading: boolean;
    isEmpty: boolean;
    title: string;
    description?: string;
    avatar: React.ComponentProps<typeof Avatar>['icon'];
    children: React.ReactNode;
    exportButtonLabel?: string;
    onExportClicked?: () => void;
}
