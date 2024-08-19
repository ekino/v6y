import gql from 'graphql-tag';

import AppEvolutionType from './app/AppEvolutionType.js';
import AppModuleType from './app/AppModuleType.js';
import AppQueriesType from './app/AppQueriesType.js';
import AppType from './app/AppType.js';
import AuditReportType from './audit/AuditReportType.js';
import LinkType from './commons/LinkType.js';
import RepositoryType from './commons/RepositoryType.js';
import UserType from './commons/UserType.js';
import DependencyHelpType from './dependency/DependencyHelpType.js';
import DependencyType from './dependency/DependencyType.js';
import FaqQueriesType from './faq/FaqQueriesType.js';
import FaqType from './faq/FaqType.js';
import KeywordQueriesType from './keyword/KeywordQueriesType.js';
import KeywordStatsType from './keyword/KeywordStatsType.js';
import KeywordType from './keyword/KeywordType.js';
import NotificationQueriesType from './notifications/NotificationQueriesType.js';
import NotificationType from './notifications/NotificationType.js';

const VitalityTypes = gql`
    # common schemas
    ${LinkType}
    ${RepositoryType}
    ${KeywordType}
    ${DependencyHelpType}
    ${DependencyType}
    ${UserType}
    ${KeywordStatsType}

    # outputted schemas
    ${AppModuleType}
    ${AppEvolutionType}
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
