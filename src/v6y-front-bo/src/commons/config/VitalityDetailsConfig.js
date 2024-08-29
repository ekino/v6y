import VitalityLinks from '../components/VitalityLinks.jsx';

export const formatApplicationDetails = (translate, details) => {
    if (!Object.keys(details || {})?.length) {
        return {};
    }

    return {
        [translate('v6y-applications.fields.app-name.label')]: details.name,
        [translate('v6y-applications.fields.app-name.acronym')]: details.acronym,
        [translate('v6y-applications.fields.app-name.description')]: details.description,
        [translate('v6y-applications.fields.app-contact-email.label')]: details.contactMail,
        [translate('v6y-applications.fields.app-git-url.label')]: details.repo?.gitUrl,
        [translate('v6y-applications.fields.app-links.label')]: (
            <VitalityLinks links={details.links} align="start" />
        ),
    };
};
