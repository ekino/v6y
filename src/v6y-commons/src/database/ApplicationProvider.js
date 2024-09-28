import { Op } from 'sequelize';
import AppLogger from '../core/AppLogger.ts';
import AuditProvider from './AuditProvider.ts';
import DependencyProvider from './DependencyProvider.ts';
import EvolutionProvider from './EvolutionProvider.ts';
import KeywordProvider from './KeywordProvider.ts';
import { ApplicationModelType } from './models/ApplicationModel.ts';
/**
 *  Build search query
 * @param searchText
 * @param keywords
 * @param offset
 * @param limit
 * @param where
 */
const buildSearchQuery = ({ searchText, offset, limit /*keywords, where*/ }) => {
    const queryOptions = {};
    if (offset) {
        queryOptions.offset = offset;
    }
    if (limit) {
        queryOptions.limit = limit;
    }
    if (searchText) {
        queryOptions.where = {
            [Op.or]: [
                {
                    name: {
                        [Op.substring]: searchText,
                    },
                },
                {
                    acronym: {
                        [Op.substring]: searchText,
                    },
                },
                {
                    description: {
                        [Op.substring]: searchText,
                    },
                },
            ],
        };
    }
    return queryOptions;
};
/**
 * Format application input
 * @param application
 */
const formatApplicationInput = (application) => {
    const { appId, acronym, name, description, gitOrganization, gitUrl, gitWebUrl, productionLink, contactMail, codeQualityPlatformLink, ciPlatformLink, deploymentPlatformLink, additionalProductionLinks, } = application || {};
    return {
        _id: appId,
        name,
        acronym,
        description,
        contactMail,
        repo: { webUrl: gitWebUrl, gitUrl, organization: gitOrganization },
        links: [
            {
                label: 'Application production url',
                value: productionLink,
                description: '',
            },
            ...(additionalProductionLinks?.map((link, index) => ({
                label: `Additional production url (${index + 1})`,
                value: link,
                description: '',
            })) || []),
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
 * Create form application
 * @param application
 */
const createFormApplication = async (application) => {
    try {
        const createdApplication = await ApplicationModelType.create(formatApplicationInput(application));
        AppLogger.info(`[ApplicationProvider - createFormApplication] createdApplication: ${createdApplication?._id}`);
        return createdApplication;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - createFormApplication] error: ${error}`);
        return null;
    }
};
/**
 * Edit form application
 * @param application
 */
const editFormApplication = async (application) => {
    try {
        if (!application?.appId) {
            return null;
        }
        const editedApplication = await ApplicationModelType.update(formatApplicationInput(application), {
            where: {
                _id: application?.appId,
            },
        });
        AppLogger.info(`[ApplicationProvider - editFormApplication] editedApplication: ${editedApplication?.[0]}`);
        return {
            _id: application?.appId,
        };
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - editFormApplication] error: ${error}`);
        return null;
    }
};
/**
 * Edit application
 * @param application
 */
const editApplication = async (application) => {
    try {
        if (!application?._id) {
            return null;
        }
        const editedApplication = await ApplicationModelType.update(application, {
            where: {
                _id: application?._id,
            },
        });
        AppLogger.info(`[ApplicationProvider - editApplication] editedApplication: ${editedApplication?.[0]}`);
        return {
            _id: application?._id,
        };
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - editApplication] error: ${error}`);
        return null;
    }
};
/**
 * Delete application
 * @param _id
 */
const deleteApplication = async ({ _id }) => {
    try {
        AppLogger.info(`[ApplicationProvider - deleteApplication] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await ApplicationModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - deleteApplication] error:  ${error}`);
    }
};
/**
 * Delete application list
 */
const deleteApplicationList = async () => {
    try {
        await ApplicationModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - deleteApplicationList] error:  ${error}`);
        return false;
    }
};
/**
 * Get application details info by params
 * @param _id
 */
const getApplicationDetailsInfoByParams = async ({ _id }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsByParams] _id: ${_id}`);
        if (!_id) {
            return null;
        }
        const application = (await ApplicationModelType.findOne({
            where: { _id },
        }))?.dataValues;
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] application _id: ${application?._id}`);
        if (!application?._id) {
            return null;
        }
        return application;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsByParams] error: ${error}`);
        return null;
    }
};
/**
 * Get application details evolutions by params
 * @param _id
 */
const getApplicationDetailsEvolutionsByParams = async ({ _id }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsEvolutionsByParams] _id: ${_id}`);
        if (!_id) {
            return null;
        }
        const evolutions = await EvolutionProvider.getEvolutionListByPageAndParams({
            appId: _id,
        });
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsEvolutionsByParams] evolutions: ${evolutions?.length}`);
        return evolutions;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsEvolutionsByParams] error: ${error}`);
        return null;
    }
};
/**
 * Get application details dependencies by params
 * @param _id
 */
const getApplicationDetailsDependenciesByParams = async ({ _id }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsDependenciesByParams] _id: ${_id}`);
        if (!_id) {
            return null;
        }
        const dependencies = await DependencyProvider.getDependencyListByPageAndParams({
            appId: _id,
        });
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsDependenciesByParams] dependencies: ${dependencies?.length}`);
        return dependencies;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsDependenciesByParams] error: ${error}`);
        return null;
    }
};
/**
 * Get application details audit reports by params
 * @param _id
 */
const getApplicationDetailsAuditReportsByParams = async ({ _id }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsAuditReportsByParams] _id: ${_id}`);
        if (!_id) {
            return null;
        }
        const auditReports = await AuditProvider.getAuditListByPageAndParams({
            appId: _id,
        });
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsAuditReportsByParams] auditReports: ${auditReports?.length}`);
        return auditReports;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsAuditReportsByParams] error: ${error}`);
        return null;
    }
};
/**
 * Get application details keywords by params
 * @param _id
 */
const getApplicationDetailsKeywordsByParams = async ({ _id }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsKeywordsByParams] _id: ${_id}`);
        const keywords = await KeywordProvider.getKeywordListByPageAndParams({
            appId: _id,
        });
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsKeywordsByParams] keywords: ${keywords?.length}`);
        return keywords;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsKeywordsByParams] error: ${error}`);
        return null;
    }
};
/**
 * Get application list by page and params
 * @param searchText
 * @param keywords
 * @param offset
 * @param limit
 * @param where
 */
const getApplicationListByPageAndParams = async ({ searchText, keywords, offset, limit, where, }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] keywords: ${keywords?.join('\r\n')}`);
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] searchText: ${searchText}`);
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] where: ${where}`);
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] offset: ${offset}`);
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] limit: ${limit}`);
        const searchQuery = buildSearchQuery({
            searchText,
            keywords,
            offset,
            limit,
            where,
        });
        const applications = await ApplicationModelType.findAll(searchQuery);
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] applications: ${applications?.length}`);
        return applications;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] error: ${error}`);
        return [];
    }
};
/**
 * Get application total by params
 * @param searchText
 * @param keywords
 */
const getApplicationTotalByParams = async ({ searchText, keywords }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationTotalByParams] searchText: ${searchText}`);
        AppLogger.info(`[ApplicationProvider - getApplicationTotalByParams] keywords: ${keywords?.join('\r\n')}`);
        const searchQuery = buildSearchQuery({ searchText, keywords });
        const applicationsCount = await ApplicationModelType.count(searchQuery);
        AppLogger.info(`[ApplicationProvider - getApplicationTotalByParams] applicationsCount: ${applicationsCount}`);
        return applicationsCount;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationTotalByParams] error: ${error}`);
        return 0;
    }
};
/**
 * Get application stats by params
 * @param keywords
 */
const getApplicationStatsByParams = async ({ keywords }) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationStatsByParams] keywords: ${keywords?.join('\r\n')}`);
        const keywordStats = await KeywordProvider.getKeywordsStatsByParams({
            keywords,
        });
        AppLogger.info(`[ApplicationProvider - getApplicationStatsByParams] keywordStats: ${keywordStats?.length}`);
        return keywordStats;
    }
    catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationStatsByParams] error: ${error}`);
        return null;
    }
};
const ApplicationProvider = {
    createFormApplication,
    editFormApplication,
    editApplication,
    deleteApplication,
    deleteApplicationList,
    getApplicationDetailsInfoByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationDetailsKeywordsByParams,
    getApplicationListByPageAndParams,
    getApplicationTotalByParams,
    getApplicationStatsByParams,
};
export default ApplicationProvider;
