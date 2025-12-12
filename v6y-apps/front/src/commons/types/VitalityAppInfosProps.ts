import { type CSSProperties } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';

export interface VitalityAppInfosProps {
    app: ApplicationType;
    source?: string;
    canOpenDetails?: boolean;
    style?: CSSProperties;
}
