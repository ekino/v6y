import gql from 'graphql-tag';

import ApplicationCreateOrEditInput from './application/ApplicationCreateOrEditInput.js';
import ApplicationDeleteInput from './application/ApplicationDeleteInput.js';
import ApplicationDeleteOutput from './application/ApplicationDeleteOutput.js';
import ApplicationMutationsType from './application/ApplicationMutationsType.js';
import ApplicationQueriesType from './application/ApplicationQueriesType.js';
import ApplicationType from './application/ApplicationType.js';
import AuditReportType from './audit/AuditReportType.js';
import AuditHelpCreateOrEditInput from './audit/help/AuditHelpCreateOrEditInput.js';
import AuditHelpDeleteInput from './audit/help/AuditHelpDeleteInput.js';
import AuditHelpDeleteOutput from './audit/help/AuditHelpDeleteOutput.js';
import AuditHelpMutationsType from './audit/help/AuditHelpMutationsType.js';
import AuditHelpQueriesType from './audit/help/AuditHelpQueriesType.js';
import AuditHelpType from './audit/help/AuditHelpType.js';
import LinkType from './commons/LinkType.js';
import ModuleType from './commons/ModuleType.js';
import RepositoryType from './commons/RepositoryType.js';
import UserType from './commons/UserType.js';
import DependencyType from './dependency/DependencyType.js';
import DeprecatedDependencyCreateOrEditInput from './dependency/deprecated-status/DeprecatedDependencyCreateOrEditInput.js';
import DeprecatedDependencyDeleteInput from './dependency/deprecated-status/DeprecatedDependencyDeleteInput.js';
import DeprecatedDependencyDeleteOutput from './dependency/deprecated-status/DeprecatedDependencyDeleteOutput.js';
import DeprecatedDependencyMutationsType from './dependency/deprecated-status/DeprecatedDependencyMutationsType.js';
import DeprecatedDependencyQueriesType from './dependency/deprecated-status/DeprecatedDependencyQueriesType.js';
import DeprecatedDependencyType from './dependency/deprecated-status/DeprecatedDependencyType.js';
import DependencyStatusHelpCreateOrEditInput from './dependency/status-help/DependencyStatusHelpCreateOrEditInput.js';
import DependencyStatusHelpDeleteInput from './dependency/status-help/DependencyStatusHelpDeleteInput.js';
import DependencyStatusHelpDeleteOutput from './dependency/status-help/DependencyStatusHelpDeleteOutput.js';
import DependencyStatusHelpMutationsType from './dependency/status-help/DependencyStatusHelpMutationsType.js';
import DependencyStatusHelpQueriesType from './dependency/status-help/DependencyStatusHelpQueriesType.js';
import DependencyStatusHelpType from './dependency/status-help/DependencyStatusHelpType.js';
import EvolutionType from './evolution/EvolutionType.js';
import EvolutionHelpCreateOrEditInput from './evolution/help/EvolutionHelpCreateOrEditInput.js';
import EvolutionHelpDeleteInput from './evolution/help/EvolutionHelpDeleteInput.js';
import EvolutionHelpDeleteOutput from './evolution/help/EvolutionHelpDeleteOutput.js';
import EvolutionHelpMutationsType from './evolution/help/EvolutionHelpMutationsType.js';
import EvolutionHelpQueriesType from './evolution/help/EvolutionHelpQueriesType.js';
import EvolutionHelpStatusType from './evolution/help/EvolutionHelpStatusType.js';
import EvolutionHelpType from './evolution/help/EvolutionHelpType.js';
import FaqCreateOrEditInput from './faq/FaqCreateOrEditInput.js';
import FaqDeleteInput from './faq/FaqDeleteInput.js';
import FaqDeleteOutput from './faq/FaqDeleteOutput.js';
import FaqMutationsType from './faq/FaqMutationsType.js';
import FaqQueriesType from './faq/FaqQueriesType.js';
import FaqType from './faq/FaqType.js';
import KeywordQueriesType from './keyword/KeywordQueriesType.js';
import KeywordStatsType from './keyword/KeywordStatsType.js';
import KeywordType from './keyword/KeywordType.js';
import NotificationCreateOrEditInput from './notifications/NotificationCreateOrEditInput.js';
import NotificationDeleteInput from './notifications/NotificationDeleteInput.js';
import NotificationDeleteOutput from './notifications/NotificationDeleteOutput.js';
import NotificationMutationsType from './notifications/NotificationMutationsType.js';
import NotificationQueriesType from './notifications/NotificationQueriesType.js';
import NotificationType from './notifications/NotificationType.js';

const VitalityTypes = gql`
    #scalar
    scalar JSON

    # common schemas
    ${LinkType}
    ${RepositoryType}
    ${KeywordType}
    ${DeprecatedDependencyType}
    ${DependencyStatusHelpType}
    ${DependencyType}
    ${UserType}
    ${KeywordStatsType}

    # outputted schemas
    ${ModuleType}
    ${EvolutionHelpStatusType}
    ${EvolutionHelpType}
    ${EvolutionType}
    ${ApplicationType}
    ${AuditHelpType}
    ${AuditReportType}
    ${FaqType}
    ${NotificationType}

    # the schemas allows the following queries
    ${KeywordQueriesType}
    ${ApplicationQueriesType}
    ${FaqQueriesType}
    ${NotificationQueriesType}
    ${EvolutionHelpQueriesType}
    ${AuditHelpQueriesType}
    ${DependencyStatusHelpQueriesType}
    ${DeprecatedDependencyQueriesType}

    # this schemas allows the following mutations
    ${ApplicationCreateOrEditInput}
    ${ApplicationDeleteOutput}
    ${ApplicationDeleteInput}
    ${ApplicationMutationsType}

    ${FaqCreateOrEditInput}
    ${FaqDeleteOutput}
    ${FaqDeleteInput}
    ${FaqMutationsType}

    ${NotificationCreateOrEditInput}
    ${NotificationDeleteOutput}
    ${NotificationDeleteInput}
    ${NotificationMutationsType}

    ${EvolutionHelpCreateOrEditInput}
    ${EvolutionHelpDeleteOutput}
    ${EvolutionHelpDeleteInput}
    ${EvolutionHelpMutationsType}

    ${AuditHelpCreateOrEditInput}
    ${AuditHelpDeleteOutput}
    ${AuditHelpDeleteInput}
    ${AuditHelpMutationsType}

    ${DependencyStatusHelpCreateOrEditInput}
    ${DependencyStatusHelpDeleteOutput}
    ${DependencyStatusHelpDeleteInput}
    ${DependencyStatusHelpMutationsType}

    ${DeprecatedDependencyCreateOrEditInput}
    ${DeprecatedDependencyDeleteOutput}
    ${DeprecatedDependencyDeleteInput}
    ${DeprecatedDependencyMutationsType}
`;

export default VitalityTypes;
