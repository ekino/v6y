import { ApplicationConfigType } from './ApplicationConfigType.ts';
import { LinkType } from './LinkType.ts';
import { RepositoryType } from './RepositoryType.ts';

export interface ApplicationType {
    _id: number;
    name?: string;
    acronym?: string;
    contactMail?: string;
    description?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    repo?: RepositoryType;
    configuration?: ApplicationConfigType;
    links?: LinkType[];
    /** Whether recurring audit scheduling is enabled for this application */
    auditFrequencyEnabled?: boolean;
    /** Audit reporting frequency, expressed as a 5-field cron expression */
    auditFrequencyCron?: string | null;
    /** Account the application belongs to, and whom its audit emails are sent to */
    ownerId?: number;
}

export interface ApplicationInputType {
    _id: number;
    acronym: string;
    name: string;
    description: string;
    contactMail: string;
    dataDogApiKey?: string;
    dataDogAppKey?: string;
    dataDogUrl?: string;
    dataDogMonitorId?: string;
    gitOrganization?: string;
    gitUrl?: string;
    gitWebUrl?: string;
    productionLink?: string;
    sonarqubeLink?: string;
    sonarqubeToken?: string;
    codeQualityPlatformLink?: string;
    ciPlatformLink?: string;
    deploymentPlatformLink?: string;
    auditFrequencyEnabled?: boolean;
    auditFrequencyCron?: string | null;
    ownerId?: number;
}
