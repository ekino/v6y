import ApplicationResolvers from './application/ApplicationResolvers.ts';
import AuditHelpResolvers from './audit/AuditHelpResolvers.ts';
import DeprecatedDependencyResolvers from './dependency/deprecated-status/DeprecatedDependencyResolvers.ts';
import DependencyStatusHelpResolvers from './dependency/status-help/DependencyStatusHelpResolvers.ts';
import EvolutionHelpResolvers from './evolutions/EvolutionHelpResolvers.ts';
import FaqResolvers from './faq/FaqResolvers.ts';
import NotificationsResolvers from './notifications/NotificationsResolvers.ts';

const VitalityResolvers = {
    Query: {
        ...ApplicationResolvers.Query,
        ...FaqResolvers.Query,
        ...NotificationsResolvers.Query,
        ...EvolutionHelpResolvers.Query,
        ...AuditHelpResolvers.Query,
        ...DependencyStatusHelpResolvers.Query,
        ...DeprecatedDependencyResolvers.Query,
    },
    Mutation: {
        ...ApplicationResolvers.Mutation,
        ...FaqResolvers.Mutation,
        ...NotificationsResolvers.Mutation,
        ...EvolutionHelpResolvers.Mutation,
        ...AuditHelpResolvers.Mutation,
        ...DependencyStatusHelpResolvers.Mutation,
        ...DeprecatedDependencyResolvers.Mutation,
    },
};

export default VitalityResolvers;
