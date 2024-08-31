import { AppLogger } from '@v6y/commons';

const createOrEditApplication = async (_, params) => {
    try {
        const {
            appId,
            acronym,
            name,
            description,
            gitUrl,
            gitWebUrl,
            productionLink,
            contactMail,
            codeQualityPlatformLink,
            ciPlatformLink,
            deploymentPlatformLink,
        } = params?.applicationInput || {};

        AppLogger.info(`[AppMutations - createOrEditApplication] appId : ${appId}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] acronym : ${acronym}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] name : ${name}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] description : ${description}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] gitUrl : ${gitUrl}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] gitWebUrl : ${gitWebUrl}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] productionLink : ${productionLink}`,
        );
        AppLogger.info(`[AppMutations - createOrEditApplication] contactMail : ${contactMail}`);

        return {
            _id: appId,
            acronym,
            name,
            description,
            repo: { webUrl: gitWebUrl, gitUrl },
            contactMail,
            links: [
                {
                    label: 'Application production url',
                    value: productionLink,
                    description: '',
                },
                {
                    label: 'Application code quality platform url',
                    value: codeQualityPlatformLink,
                    description: '',
                },
                {
                    label: 'Application CI/CD platform url',
                    value: ciPlatformLink,
                    description: '',
                },
                {
                    label: 'Application deployment platform url',
                    value: deploymentPlatformLink,
                    description: '',
                },
            ]?.filter((item) => item?.value),
        };
    } catch (error) {
        AppLogger.info(`[AppMutations - createOrEditApplication] error : ${error.message}`);
        return {};
    }
};

const deleteApplication = async (_, params) => {
    try {
        const appId = params?.input?.where?.id || {};
        AppLogger.info(`[AppMutations - deleteApplication] appId : ${appId}`);

        return {
            _id: appId,
        };
    } catch (error) {
        AppLogger.info(`[AppMutations - deleteApplication] error : ${error.message}`);
        return {};
    }
};

const AppMutations = {
    createOrEditApplication,
    deleteApplication,
};

export default AppMutations;
