import gql from 'graphql-tag';
import EvolutionTypes from './commons/EvolutionType.js';
import HelpType from './commons/HelpType.js';
import QualityGateType from './commons/QualityGateType.js';
import VersionType from './commons/VersionType.js';
import LinkType from './commons/LinkType.js';
import RepositoryType from './commons/RepositoryType.js';
import DependencyType from './commons/DependencyType.js';
import AuditReportType from './commons/AuditReportType.js';
import UserType from './commons/UserType.js';
import KeywordType from './keyword/KeywordType.js';
import AppType from './app/AppType.js';
import AppQueriesType from './app/AppQueriesType.js';
import FaqType from './faq/FaqType.js';
import FaqQueriesType from './faq/FaqQueriesType.js';
import NotificationType from './notifications/NotificationType.js';
import NotificationQueriesType from './notifications/NotificationQueriesType.js';

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

  # outputted schemas
  ${AppType}
  ${AuditReportType}
  ${FaqType}
  ${NotificationType}

  # the schemas allows the following queries
  ${AppQueriesType}
  ${FaqQueriesType}
  ${NotificationQueriesType}

  # this schemas allows the following mutations
`;

export default VitalityTypes;
