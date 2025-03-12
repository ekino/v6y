import { DataDogConfigType } from './ApplicationConfigType.ts';
import { LinkType } from './LinkType.ts';
import { RepositoryType } from './RepositoryType.ts';

export interface ApplicationType {
    _id: number;
    name?: string;
    acronym?: string;
    contactMail?: string;
    description?: string;
    repo?: RepositoryType;
    configuration?: {
        dataDog?: DataDogConfigType;
    };
    links?: LinkType[];
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
    codeQualityPlatformLink?: string;
    ciPlatformLink?: string;
    deploymentPlatformLink?: string;
    additionalProductionLinks?: string[];
}
