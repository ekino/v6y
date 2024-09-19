import VitalityLinks from '../components/VitalityLinks.jsx';

export const formatApplicationDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-applications.fields.app-name.label')]: details.name,
        [translate('v6y-applications.fields.app-acronym.label')]: details.acronym,
        [translate('v6y-applications.fields.app-description.label')]: details.description,
        [translate('v6y-applications.fields.app-contact-email.label')]: details.contactMail,
        [translate('v6y-applications.fields.app-git-url.label')]: details.repo?.gitUrl,
        [translate('v6y-applications.fields.app-links.label')]: (
            <VitalityLinks links={details.links} align="start" />
        ),
    };
};

export const formatFaqDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-faqs.fields.faq-title.label')]: details.title,
        [translate('v6y-faqs.fields.faq-description.label')]: details.description,
        [translate('v6y-faqs.fields.faq-links.label')]: (
            <VitalityLinks links={details.links} align="start" />
        ),
    };
};

export const formatNotificationDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-notifications.fields.notification-title.label')]: details.title,
        [translate('v6y-notifications.fields.notification-description.label')]: details.description,
        [translate('v6y-notifications.fields.notification-links.label')]: (
            <VitalityLinks links={details.links} align="start" />
        ),
    };
};

export const formatEvolutionHelpDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-evolution-helps.fields.evolution-help-category.label')]: details.category,
        [translate('v6y-evolution-helps.fields.evolution-help-status.label')]: details.status,
        [translate('v6y-evolution-helps.fields.evolution-help-title.label')]: details.title,
        [translate('v6y-evolution-helps.fields.evolution-help-description.label')]:
            details.description,
        [translate('v6y-evolution-helps.fields.evolution-help-link.label')]: (
            <VitalityLinks links={details.links} align="start" />
        ),
    };
};

export const formatAuditHelpDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-audit-helps.fields.audit-help-category.label')]: details.category,
        [translate('v6y-audit-helps.fields.audit-help-title.label')]: details.title,
        [translate('v6y-audit-helps.fields.audit-help-description.label')]: details.description,
        [translate('v6y-audit-helps.fields.audit-help-explanation.label')]: details.explanation,
    };
};

export const formatDependencyStatusHelpDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-dependency-status-helps.fields.dependency-status-help-category.label')]:
            details.category,
        [translate('v6y-dependency-status-helps.fields.dependency-status-help-title.label')]:
            details.title,
        [translate('v6y-dependency-status-helps.fields.dependency-status-help-description.label')]:
            details.description,
        [translate('v6y-dependency-status-helps.fields.dependency-status-help-links.label')]: (
            <VitalityLinks links={details.links} align="start" />
        ),
    };
};

export const formatDeprecatedDependencyDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-deprecated-dependencies.fields.deprecated-dependency-name.label')]:
            details.name,
    };
};
