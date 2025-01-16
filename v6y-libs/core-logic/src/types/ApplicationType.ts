import { LinkType } from './LinkType.ts';
import { RegistryType } from './RegistryType.ts';

export interface ApplicationType {
    _id: number;
    name?: string;
    acronym?: string;
    contactMail?: string;
    description?: string;
    repo?: RegistryType;
    links?: LinkType[];
}

export interface ApplicationInputType {
    _id: number;
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
