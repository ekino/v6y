import AppResolvers from './app/AppResolvers.js';
import AuditHelpResolvers from './audit/AuditHelpResolvers.js';
import DeprecatedDependencyResolvers from './dependency/deprecated-status/DeprecatedDependencyResolvers.js';
import DependencyStatusHelpResolvers from './dependency/status-help/DependencyStatusHelpResolvers.js';
import EvolutionHelpResolvers from './evolutions/EvolutionHelpResolvers.js';
import FaqResolvers from './faq/FaqResolvers.js';
import KeywordResolvers from './keyword/KeywordResolvers.js';
import NotificationsResolvers from './notifications/NotificationsResolvers.js';

const VitalityResolvers = {
    Query: {
        ...AppResolvers.Query,
        ...FaqResolvers.Query,
        ...NotificationsResolvers.Query,
        ...KeywordResolvers.Query,
        ...EvolutionHelpResolvers.Query,
        ...AuditHelpResolvers.Query,
        ...DependencyStatusHelpResolvers.Query,
        ...DeprecatedDependencyResolvers.Query,
    },
    Mutation: {
        ...AppResolvers.Mutation,
        ...FaqResolvers.Mutation,
        ...NotificationsResolvers.Mutation,
        ...EvolutionHelpResolvers.Mutation,
        ...AuditHelpResolvers.Mutation,
        ...DependencyStatusHelpResolvers.Mutation,
        ...DeprecatedDependencyResolvers.Mutation,
    },
};

export default VitalityResolvers;
