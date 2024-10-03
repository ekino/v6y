import * as React from 'react';

export interface VitalitySectionViewProps {
    isLoading: boolean;
    isEmpty: boolean;
    title: string;
    description?: string;
    avatar: React.ReactNode;
    children: React.ReactNode;
    exportButtonLabel?: string;
    onExportClicked?: () => void;
}
