import AccountResolvers from './account/AccountResolvers.ts';
import ApplicationResolvers from './application/ApplicationResolvers.ts';
import AuditHelpResolvers from './audit/AuditHelpResolvers.ts';
import DeprecatedDependencyResolvers from './dependency/deprecated-status/DeprecatedDependencyResolvers.ts';
import DependencyVersionStatusHelpResolvers from './dependency/version-status-help/DependencyVersionStatusHelpResolvers.ts';
import EvolutionHelpResolvers from './evolutions/EvolutionHelpResolvers.ts';
import FaqResolvers from './faq/FaqResolvers.ts';
import NotificationsResolvers from './notifications/NotificationsResolvers.ts';

const VitalityResolvers = {
    Query: {
        ...AccountResolvers.Query,
        ...ApplicationResolvers.Query,
        ...FaqResolvers.Query,
        ...NotificationsResolvers.Query,
        ...EvolutionHelpResolvers.Query,
        ...AuditHelpResolvers.Query,
        ...DependencyVersionStatusHelpResolvers.Query,
        ...DeprecatedDependencyResolvers.Query,
    },
    Mutation: {
        ...AccountResolvers.Mutation,
        ...ApplicationResolvers.Mutation,
        ...FaqResolvers.Mutation,
        ...NotificationsResolvers.Mutation,
        ...EvolutionHelpResolvers.Mutation,
        ...AuditHelpResolvers.Mutation,
        ...DependencyVersionStatusHelpResolvers.Mutation,
        ...DeprecatedDependencyResolvers.Mutation,
    },
};

export default VitalityResolvers;
