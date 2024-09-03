import { AppLogger, ApplicationProvider } from '@v6y/commons';

/**
 * Creates or edits an application.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the application input data.
 * @returns An object representing the created or edited application, or an empty object on error.
 */
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

        if (appId) {
            const editedApplication = await ApplicationProvider.editApplication({
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
            });

            AppLogger.info(
                `[AppMutations - createOrEditApplication] editedApplication : ${editedApplication?._id}`,
            );

            return editedApplication;
        }

        const createdApplication = await ApplicationProvider.createApplication({
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
        });

        AppLogger.info(
            `[AppMutations - createOrEditApplication] createdApplication : ${createdApplication?._id}`,
        );

        return createdApplication;
    } catch (error) {
        AppLogger.info(`[AppMutations - createOrEditApplication] error : ${error.message}`);
        return null;
    }
};

/**
 * Deletes an application.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the application ID to delete.
 * @returns An object containing the deleted application ID, or an empty object on error.
 */
const deleteApplication = async (_, params) => {
    try {
        const appId = params?.input?.where?.id || {};
        AppLogger.info(`[AppMutations - deleteApplication] appId : ${appId}`);

        await ApplicationProvider.deleteApplication({ appId });

        return {
            _id: appId,
        };
    } catch (error) {
        AppLogger.info(`[AppMutations - deleteApplication] error : ${error.message}`);
        return null;
    }
};

/**
 * An object containing application mutation functions.
 */
const ApplicationMutations = {
    createOrEditApplication,
    deleteApplication,
};

export default ApplicationMutations;
