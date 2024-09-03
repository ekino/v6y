import AppLogger from '../core/AppLogger.js';
import AuditProvider from './AuditProvider.js';
import DataBaseManager from './DataBaseManager.js';
import DependencyProvider from './DependencyProvider.js';
import EvolutionProvider from './EvolutionProvider.js';
import KeywordProvider from './KeywordProvider.js';
import ApplicationModel from './models/ApplicationModel.js';

/**
 * Formats application data from input into a standardized structure.
 *
 * @param {Object} application - The application data object.
 * @returns {Object} The formatted application data.
 */
const formatApplicationInput = (application) => {
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
    } = application || {};

    return {
        appId,
        name,
        acronym,
        description,
        contactMail,
        repo: { webUrl: gitWebUrl, gitUrl },
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
};

/**
 * Creates a new application in the database
 *
 * @param {Object} application - The application data to be created
 * @returns {Object|null} The created application object or null on error or if the application model is not found
 */
const createApplication = async (application) => {
    try {
        const applicationModel = DataBaseManager.getDataBaseSchema(ApplicationModel.name);

        if (!applicationModel) {
            return null;
        }

        const createdApplication = await applicationModel.create(
            formatApplicationInput(application),
        );

        AppLogger.info(
            `[ApplicationProvider - createApplication] createdApplication: ${createdApplication?._id}`,
        );

        return createdApplication;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - createApplication] error: ${error.message}`);
        return null;
    }
};

/**
 * Edits an existing application in the database.
 *
 * @param {Object} application - The application data with updated information.
 * @returns {Object|null} An object containing the ID of the edited application or null on error or if the application model is not found
 */
const editApplication = async (application) => {
    try {
        if (!application?.appId) {
            return null;
        }

        const applicationModel = DataBaseManager.getDataBaseSchema(ApplicationModel.name);
        if (!applicationModel) {
            return null;
        }

        const editedApplication = await applicationModel.update(
            formatApplicationInput(application),
            {
                where: {
                    _id: application?.appId,
                },
            },
        );

        AppLogger.info(
            `[ApplicationProvider - editApplication] editedApplication: ${editedApplication?._id}`,
        );

        return {
            _id: application?.appId,
        };
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - editApplication] error: ${error.message}`);
        return null;
    }
};

/**
 * Deletes an application from the database
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.appId - The ID of the application to delete
 * @returns {Object|null} An object containing the ID of the deleted application, or null on error or if appId is not provided or if application model is not found.
 */
const deleteApplication = async ({ appId }) => {
    try {
        AppLogger.info(`[ApplicationProvider - deleteApplication] appId:  ${appId}`);
        if (!appId) {
            return null;
        }

        const applicationModel = DataBaseManager.getDataBaseSchema(ApplicationModel.name);
        if (!applicationModel) {
            return null;
        }

        await applicationModel.destroy({
            where: {
                _id: appId,
            },
        });

        return {
            _id: appId,
        };
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - deleteApplication] error:  ${error.message}`);
    }
};

/**
 * Deletes all applications from the database
 *
 * @returns {Promise<boolean|null>} True if the deletion was successful, false otherwise
 */
const deleteApplicationList = async () => {
    try {
        const applicationModel = DataBaseManager.getDataBaseSchema(ApplicationModel.name);
        if (!applicationModel) {
            return null;
        }

        await applicationModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - deleteApplicationList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves the details of an application by its ID, including its keywords
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.appId - The ID of the application to retrieve
 * @returns {Object|null} An object containing the application details and its keywords or null if the application is not found or on error or if the application model is not found
 */
const getApplicationDetailsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsByParams] appId: ${appId}`);

        if (!appId) {
            return null;
        }

        const applicationModel = DataBaseManager.getDataBaseSchema(ApplicationModel.name);
        if (!applicationModel) {
            return null;
        }

        const application = (
            await applicationModel.findOne({
                where: { _id: appId },
            })
        )?.dataValues;

        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] application _id: ${application?._id}`,
        );

        if (!application?._id) {
            return null;
        }

        const applicationKeywords = await KeywordProvider.getKeywordListByParams({
            appId: application._id,
        });

        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] applicationKeywords: ${applicationKeywords?.length}`,
        );

        if (!applicationKeywords?.length) {
            return application;
        }

        return {
            ...application,
            keywords: applicationKeywords,
        };
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * Retrieves the evolutions (changes/updates) associated with an application.
 *
 * @param {Object} params - An object containing parameters for the query
 * @param {string} params.appId - The ID of the application
 * @returns {Promise<undefined|[]|null>} An array of evolution objects or null if no evolutions are found or on error.
 */
const getApplicationDetailsEvolutionsByParams = async ({ appId }) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsEvolutionsByParams] appId: ${appId}`,
        );

        if (!appId?.length) {
            return null;
        }

        return EvolutionProvider.getEvolutionListByPageAndParams({ appId });
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsEvolutionsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * Retrieves the dependencies associated with an application
 *
 * @param {Object} params - An object containing the parameters for the query.
 * @param {string} params.appId - The ID of the application
 * @returns {Promise<Array|null>} An array of dependency objects or null if no dependencies are found or on error.
 */
const getApplicationDetailsDependenciesByParams = async ({ appId }) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsDependenciesByParams] appId: ${appId}`,
        );

        if (!appId?.length) {
            return null;
        }

        return DependencyProvider.getDependencyListByPageAndParams({ appId });
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsDependenciesByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * Retrieves audit reports associated with an application
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.appId - The ID of the application
 * @returns {Promise<Array|null>} An object containing audit reports for the application or null if no audit reports are found or on error
 */
const getApplicationDetailsAuditReportsByParams = async ({ appId }) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsAuditReportsByParams] appId: ${appId}`,
        );

        if (!appId?.length) {
            return null;
        }

        return AuditProvider.getAuditListByPageAndParams({ appId });
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsAuditReportsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * Retrieves a list of applications based on specified parameters.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} [params.searchText] - The text to search for in application names or descriptions
 * @param {Array} [params.keywords] - An array of keywords to filter applications by
 * @param {number} [params.offset] - The offset for pagination
 * @param {number} [params.limit] - The maximum number of applications to return
 * @param {Object} [params.where] - Additional filtering conditions
 * @returns {Promise<*|*[]|null>} An array of application objects or null on error or if the application model is not found
 */
const getApplicationListByPageAndParams = async ({
    searchText,
    keywords,
    offset,
    limit,
    where,
}) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] keywords: ${keywords?.join('\r\n')}`,
        );
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] searchText: ${searchText}`,
        );
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] where: ${where}`);
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] offset: ${offset}`,
        );
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] limit: ${limit}`);

        // read from DB
        const applicationModel = DataBaseManager.getDataBaseSchema(ApplicationModel.name);
        if (!applicationModel) {
            return null;
        }

        const applications = await applicationModel.findAll();
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] applications: ${applications?.length}`,
        );

        return applications?.map((application) => ({
            ...(application?.dataValues || {}),
            keywords: KeywordProvider.getKeywordListByPageAndParams({
                appId: application._id,
            }),
        }));
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] error: ${error.message}`,
        );
        return [];
    }
};

/**
 * Gets the total number of applications based on the given parameters
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} [params.searchText]
 - The text to search for in application names or descriptions
 * @param {Array} [params.keywords] - An array of keywords to filter applications by
 * @returns {Promise<number>} The total number of applications matching the criteria
 */
const getApplicationTotalByParams = async ({ searchText, keywords }) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] searchText: ${searchText}`,
        );
        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] keywords: ${keywords?.join('\r\n')}`,
        );

        const apps = await getApplicationListByPageAndParams({ keywords, searchText });

        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] apps total: ${apps?.length}`,
        );

        return apps?.length;
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] error: ${error.message}`,
        );
        return 0;
    }
};

/**
 * Retrieves statistics about applications based on specified keywords
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {Array} [params.keywords] - An array of keywords to filter the statistics by
 * @returns {Object} An object containing application statistics
 */
const getApplicationStatsByParams = async ({ keywords }) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationStatsByParams] keywords: ${keywords?.join('\r\n')}`,
        );

        // number of apps with each keyword
        // case of empty keyword

        return KeywordProvider.getKeywordsStatsByParams({ keywords });
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationStatsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * A helper that provides various operations related to applications
 */
const ApplicationProvider = {
    createApplication,
    editApplication,
    deleteApplication,
    deleteApplicationList,
    getApplicationDetailsByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationListByPageAndParams,
    getApplicationTotalByParams,
    getApplicationStatsByParams,
};

export default ApplicationProvider;
