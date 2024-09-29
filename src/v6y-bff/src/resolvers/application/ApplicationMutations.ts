import { AppLogger, ApplicationInputType, ApplicationProvider, SearchQueryType } from '@v6y/commons';


/**
 * Create or edit application
 * @param _
 * @param params
 */
const createOrEditApplication = async (
    _: unknown,
    params: { applicationInput: ApplicationInputType },
) => {
    try {
        const {
            _id,
            acronym,
            name,
            description,
            gitOrganization,
            gitUrl,
            gitWebUrl,
            productionLink,
            additionalProductionLinks,
            contactMail,
            codeQualityPlatformLink,
            ciPlatformLink,
            deploymentPlatformLink,
        } = params?.applicationInput || {};

        AppLogger.info(`[AppMutations - createOrEditApplication] _id : ${_id}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] acronym : ${acronym}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] name : ${name}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] description : ${description}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] gitUrl : ${gitUrl}`);
        AppLogger.info(`[AppMutations - createOrEditApplication] gitWebUrl : ${gitWebUrl}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] gitOrganization : ${gitOrganization}`,
        );
        AppLogger.info(
            `[AppMutations - createOrEditApplication] productionLink : ${productionLink}`,
        );
        AppLogger.info(`[AppMutations - createOrEditApplication] contactMail : ${contactMail}`);
        AppLogger.info(
            `[AppMutations - createOrEditApplication] additionalProductionLinks : ${additionalProductionLinks?.join(
                ',',
            )}`,
        );

        if (_id) {
            const editedApplication = await ApplicationProvider.editFormApplication({
                _id,
                acronym,
                name,
                description,
                gitOrganization,
                gitUrl,
                gitWebUrl,
                productionLink,
                contactMail,
                codeQualityPlatformLink,
                ciPlatformLink,
                deploymentPlatformLink,
                additionalProductionLinks,
            });

            AppLogger.info(
                `[AppMutations - createOrEditApplication] editedApplication : ${editedApplication?._id}`,
            );

            return editedApplication;
        }

        const createdApplication = await ApplicationProvider.createFormApplication({
            acronym,
            name,
            description,
            gitOrganization,
            gitUrl,
            gitWebUrl,
            productionLink,
            contactMail,
            codeQualityPlatformLink,
            ciPlatformLink,
            deploymentPlatformLink,
            additionalProductionLinks,
        } as ApplicationInputType);

        AppLogger.info(
            `[AppMutations - createOrEditApplication] createdApplication : ${createdApplication?._id}`,
        );

        return createdApplication;
    } catch (error) {
        AppLogger.info(`[AppMutations - createOrEditApplication] error : ${error}`);
        return null;
    }
};

/**
 * Delete application
 * @param _
 * @param params
 */
const deleteApplication = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input?.where;
        if (!whereClause) {
            return null;
        }

        const appId = whereClause._id;
        AppLogger.info(`[AppMutations - deleteApplication] appId : ${appId}`);

        await ApplicationProvider.deleteApplication({ _id: appId });

        return {
            _id: appId,
        };
    } catch (error) {
        AppLogger.info(`[AppMutations - deleteApplication] error : ${error}`);
        return null;
    }
};

const ApplicationMutations = {
    createOrEditApplication,
    deleteApplication,
};

export default ApplicationMutations;
