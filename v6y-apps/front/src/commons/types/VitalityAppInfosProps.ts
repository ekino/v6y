import { ApplicationType } from '@v6y/core-logic/src/types';
import { type CSSProperties } from 'react';

export interface VitalityAppInfosProps {
    app: ApplicationType;
    source?: string;
    canOpenDetails?: boolean;
    style?: CSSProperties;
}
