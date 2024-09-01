import { dependencyStatusHelp } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertDependencyStatusHelp = async (dependencyStatusHelp) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - insertDependencyStatusHelp] error:  ${error.message}`,
        );
        return {};
    }
};

const insertDependencyStatusHelpList = async (dependencyStatusHelpList) => {
    try {
        if (!dependencyStatusHelpList?.length) {
            return;
        }

        for (const dependencyStatusHelp of dependencyStatusHelpList) {
            await insertDependencyStatusHelp(dependencyStatusHelp);
        }
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - insertDependencyStatusHelpList] error:  ${error.message}`,
        );
    }
};

const deleteDependencyStatusHelpList = async () => {
    try {
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - deleteDependencyStatusHelpList] error:  ${error.message}`,
        );
    }
};

const getDependencyStatusHelpDetailsByParams = async ({ dependencyStatusHelpId, category }) => {
    try {
        AppLogger.info(
            `[DependencyProvider - getDependencyStatusHelpDetailsByParams] category: ${category}`,
        );

        if (dependencyStatusHelpId?.length) {
            return dependencyStatusHelp.find(
                (dependencyStatusHelp) => dependencyStatusHelp._id === dependencyStatusHelpId,
            );
        }

        if (category?.length) {
            return dependencyStatusHelp.find(
                (dependencyStatusHelp) => dependencyStatusHelp.category === category,
            );
        }

        return {};
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] error:  ${error.message}`,
        );
        return {};
    }
};

const getDependencyStatusHelpListByPageAndParams = async ({ start, limit, where, sort }) => {
    try {
        AppLogger.info(
            `[AuditsProvider - getDependencyStatusHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[AuditsProvider - getDependencyStatusHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[AuditsProvider - getDependencyStatusHelpListByPageAndParams] where: ${where}`,
        );
        AppLogger.info(
            `[AuditsProvider - getDependencyStatusHelpListByPageAndParams] sort: ${sort}`,
        );

        return dependencyStatusHelp;
    } catch (error) {
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

const DependencyStatusHelpProvider = {
    insertDependencyStatusHelpList,
    deleteDependencyStatusHelpList,
    getDependencyStatusHelpDetailsByParams,
    getDependencyStatusHelpListByPageAndParams,
};

export default DependencyStatusHelpProvider;
