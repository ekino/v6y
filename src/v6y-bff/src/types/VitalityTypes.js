import gql from 'graphql-tag';

import AppQueriesType from './app/AppQueriesType.js';
import AppType from './app/AppType.js';
import AuditReportType from './audit/AuditReportType.js';
import LinkType from './commons/LinkType.js';
import RepositoryType from './commons/RepositoryType.js';
import UserType from './commons/UserType.js';
import DependencyHelpType from './dependency/DependencyHelpType.js';
import DependencyType from './dependency/DependencyType.js';
import EvolutionModuleType from './evolution/EvolutionModuleType.js';
import EvolutionType from './evolution/EvolutionType.js';
import FaqQueriesType from './faq/FaqQueriesType.js';
import FaqType from './faq/FaqType.js';
import KeywordQueriesType from './keyword/KeywordQueriesType.js';
import KeywordStatsType from './keyword/KeywordStatsType.js';
import KeywordType from './keyword/KeywordType.js';
import NotificationQueriesType from './notifications/NotificationQueriesType.js';
import NotificationType from './notifications/NotificationType.js';

const VitalityTypes = gql`
    #scalar
    scalar JSON

    # common schemas
    ${LinkType}
    ${RepositoryType}
    ${KeywordType}
    ${DependencyHelpType}
    ${DependencyType}
    ${UserType}
    ${KeywordStatsType}

    # outputted schemas
    ${EvolutionModuleType}
    ${EvolutionType}
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
