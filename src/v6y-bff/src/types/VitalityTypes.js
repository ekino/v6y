import gql from 'graphql-tag';

import AppQueriesType from './app/AppQueriesType.js';
import AppType from './app/AppType.js';
import AuditReportType from './commons/AuditReportType.js';
import DependencyType from './commons/DependencyType.js';
import EvolutionTypes from './commons/EvolutionType.js';
import HelpType from './commons/HelpType.js';
import KeywordStatsType from './commons/KeywordStatsType.js';
import LinkType from './commons/LinkType.js';
import QualityGateType from './commons/QualityGateType.js';
import RepositoryType from './commons/RepositoryType.js';
import UserType from './commons/UserType.js';
import VersionType from './commons/VersionType.js';
import FaqQueriesType from './faq/FaqQueriesType.js';
import FaqType from './faq/FaqType.js';
import KeywordQueriesType from './keyword/KeywordQueriesType.js';
import KeywordType from './keyword/KeywordType.js';
import NotificationQueriesType from './notifications/NotificationQueriesType.js';
import NotificationType from './notifications/NotificationType.js';

const VitalityTypes = gql`
    # common schemas
    ${EvolutionTypes}
    ${HelpType}
    ${QualityGateType}
    ${VersionType}
    ${LinkType}
    ${RepositoryType}
    ${KeywordType}
    ${DependencyType}
    ${UserType}
    ${KeywordStatsType}

    # outputted schemas
    ${AppType}
    ${AuditReportType}
    ${FaqType}
    ${NotificationType}

    # the schemas allows the following queries
    ${KeywordQueriesType}
    ${AppQueriesType}
    ${FaqQueriesType}
    ${NotificationQueriesType}

    # this schemas allows the following mutations
`;

export default VitalityTypes;
