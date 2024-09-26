import { LinkType } from './LinkType';
import { RepositoryType } from './RepositoryType';

export interface ApplicationType {
    _id: number;
    name: string;
    acronym: string;
    contactMail: string;
    description: string;
    repo?: RepositoryType;
    links?: LinkType[];
}

export interface ApplicationInput {
    appId: number;
    acronym: string;
    name: string;
    description: string;
    contactMail: string;
    gitOrganization?: string;
    gitUrl?: string;
    gitWebUrl?: string;
    productionLink?: string;
    codeQualityPlatformLink?: string;
    ciPlatformLink?: string;
    deploymentPlatformLink?: string;
    additionalProductionLinks?: string[];
}
