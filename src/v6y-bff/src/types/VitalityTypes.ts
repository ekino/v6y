import { gql } from 'graphql-tag';

import ApplicationCreateOrEditInput from './application/ApplicationCreateOrEditInput.ts';
import ApplicationDeleteInput from './application/ApplicationDeleteInput.ts';
import ApplicationDeleteOutput from './application/ApplicationDeleteOutput.ts';
import ApplicationMutationsType from './application/ApplicationMutationsType.ts';
import ApplicationQueriesType from './application/ApplicationQueriesType.ts';
import ApplicationType from './application/ApplicationType.ts';
import AuditReportType from './audit/AuditReportType.ts';
import AuditHelpCreateOrEditInput from './audit/help/AuditHelpCreateOrEditInput.ts';
import AuditHelpDeleteInput from './audit/help/AuditHelpDeleteInput.ts';
import AuditHelpDeleteOutput from './audit/help/AuditHelpDeleteOutput.ts';
import AuditHelpMutationsType from './audit/help/AuditHelpMutationsType.ts';
import AuditHelpQueriesType from './audit/help/AuditHelpQueriesType.ts';
import AuditHelpType from './audit/help/AuditHelpType.ts';
import LinkType from './commons/LinkType.ts';
import ModuleType from './commons/ModuleType.ts';
import RepositoryType from './commons/RepositoryType.ts';
import DependencyType from './dependency/DependencyType.ts';
import DeprecatedDependencyCreateOrEditInput from './dependency/deprecated-status/DeprecatedDependencyCreateOrEditInput.ts';
import DeprecatedDependencyDeleteInput from './dependency/deprecated-status/DeprecatedDependencyDeleteInput.ts';
import DeprecatedDependencyDeleteOutput from './dependency/deprecated-status/DeprecatedDependencyDeleteOutput.ts';
import DeprecatedDependencyMutationsType from './dependency/deprecated-status/DeprecatedDependencyMutationsType.ts';
import DeprecatedDependencyQueriesType from './dependency/deprecated-status/DeprecatedDependencyQueriesType.ts';
import DeprecatedDependencyType from './dependency/deprecated-status/DeprecatedDependencyType.ts';
import DependencyStatusHelpCreateOrEditInput from './dependency/status-help/DependencyStatusHelpCreateOrEditInput.ts';
import DependencyStatusHelpDeleteInput from './dependency/status-help/DependencyStatusHelpDeleteInput.ts';
import DependencyStatusHelpDeleteOutput from './dependency/status-help/DependencyStatusHelpDeleteOutput.ts';
import DependencyStatusHelpMutationsType from './dependency/status-help/DependencyStatusHelpMutationsType.ts';
import DependencyStatusHelpQueriesType from './dependency/status-help/DependencyStatusHelpQueriesType.ts';
import DependencyStatusHelpType from './dependency/status-help/DependencyStatusHelpType.ts';
import EvolutionType from './evolution/EvolutionType.ts';
import EvolutionHelpCreateOrEditInput from './evolution/help/EvolutionHelpCreateOrEditInput.ts';
import EvolutionHelpDeleteInput from './evolution/help/EvolutionHelpDeleteInput.ts';
import EvolutionHelpDeleteOutput from './evolution/help/EvolutionHelpDeleteOutput.ts';
import EvolutionHelpMutationsType from './evolution/help/EvolutionHelpMutationsType.ts';
import EvolutionHelpQueriesType from './evolution/help/EvolutionHelpQueriesType.ts';
import EvolutionHelpStatusType from './evolution/help/EvolutionHelpStatusType.ts';
import EvolutionHelpType from './evolution/help/EvolutionHelpType.ts';
import FaqCreateOrEditInput from './faq/FaqCreateOrEditInput.ts';
import FaqDeleteInput from './faq/FaqDeleteInput.ts';
import FaqDeleteOutput from './faq/FaqDeleteOutput.ts';
import FaqMutationsType from './faq/FaqMutationsType.ts';
import FaqQueriesType from './faq/FaqQueriesType.ts';
import FaqType from './faq/FaqType.ts';
import KeywordStatsType from './keyword/KeywordStatsType.ts';
import KeywordType from './keyword/KeywordType.ts';
import NotificationCreateOrEditInput from './notifications/NotificationCreateOrEditInput.ts';
import NotificationDeleteInput from './notifications/NotificationDeleteInput.ts';
import NotificationDeleteOutput from './notifications/NotificationDeleteOutput.ts';
import NotificationMutationsType from './notifications/NotificationMutationsType.ts';
import NotificationQueriesType from './notifications/NotificationQueriesType.ts';
import NotificationType from './notifications/NotificationType.ts';

const VitalityTypes = gql(`
    #scalar
    scalar JSON

    # common schemas
    ${LinkType}
    ${RepositoryType}
    ${KeywordType}
    ${DeprecatedDependencyType}
    ${DependencyStatusHelpType}
    ${DependencyType}
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
`);

export default VitalityTypes;
