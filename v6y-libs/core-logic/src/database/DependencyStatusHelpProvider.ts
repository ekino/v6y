import { FindOptions } from 'sequelize';

import { defaultDependencyStatusHelp } from '../config/DependencyStatusHelpConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import {
    DependencyStatusHelpInputType,
    DependencyStatusHelpType,
} from '../types/DependencyStatusHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { DependencyStatusHelpModelType } from './models/DependencyStatusHelpModel.ts';

/**
 * Format the dependency status help input
 * @param dependencyStatusHelp
 */
const formatDependencyStatusHelpInput = (
    dependencyStatusHelp: DependencyStatusHelpInputType,
): DependencyStatusHelpType => ({
    _id: dependencyStatusHelp?._id,
    title: dependencyStatusHelp.title,
    description: dependencyStatusHelp.description,
    category: dependencyStatusHelp.category,
    links: dependencyStatusHelp.links
        ?.map((link: string) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Create a new dependency status help
 * @param dependencyStatusHelp
 */
const createDependencyStatusHelp = async (dependencyStatusHelp: DependencyStatusHelpInputType) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - createDependencyStatusHelp] dependencyStatusHelp title:  ${dependencyStatusHelp?.title}`,
        );
        if (!dependencyStatusHelp?.title?.length) {
            return null;
        }

        const createdDependencyStatusHelp = await DependencyStatusHelpModelType.create(
            formatDependencyStatusHelpInput(dependencyStatusHelp),
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - createDependencyStatusHelp] createdDependencyStatusHelp: ${createdDependencyStatusHelp?._id}`,
        );

        return createdDependencyStatusHelp;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - createDependencyStatusHelp] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Edit an existing dependency status help
 * @param dependencyStatusHelp
 */
const editDependencyStatusHelp = async (dependencyStatusHelp: DependencyStatusHelpInputType) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] dependencyStatusHelp id:  ${dependencyStatusHelp?._id}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] dependencyStatusHelp title:  ${dependencyStatusHelp?.title}`,
        );

        if (!dependencyStatusHelp?._id || !dependencyStatusHelp?.title?.length) {
            return null;
        }

        const editedDependencyStatusHelp = await DependencyStatusHelpModelType.update(
            formatDependencyStatusHelpInput(dependencyStatusHelp),
            {
                where: {
                    _id: dependencyStatusHelp?._id,
                },
            },
        );

        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] editedDependencyStatusHelp: ${editedDependencyStatusHelp?.[0]}`,
        );

        return {
            _id: dependencyStatusHelp?._id,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Delete a dependency status help
 * @param _id
 */
const deleteDependencyStatusHelp = async ({ _id }: DependencyStatusHelpType) => {
    try {
        AppLogger.info(`[DependencyStatusHelpProvider - deleteDependencyStatusHelp] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await DependencyStatusHelpModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - deleteDependencyStatusHelp] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Delete all dependency status help
 */
const deleteDependencyStatusHelpList = async () => {
    try {
        await DependencyStatusHelpModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - deleteDependencyStatusHelpList] error:  ${error}`,
        );
        return false;
    }
};

/**
 * Get dependency status help list by page and params
 * @param start
 * @param limit
 * @param sort
 */
const getDependencyStatusHelpListByPageAndParams = async ({
    start,
    limit,
    sort,
}: SearchQueryType) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] sort: ${sort}`,
        );

        // Construct the query options based on provided arguments
        const queryOptions: FindOptions = {};

        // Handle pagination
        if (start) {
            // queryOptions.offset = start;
        }

        if (limit) {
            // queryOptions.limit = limit;
        }

        const dependencyStatusHelpList = await DependencyStatusHelpModelType.findAll(queryOptions);
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] dependencyStatusHelpList: ${dependencyStatusHelpList?.length}`,
        );

        return dependencyStatusHelpList?.map((item) => item?.dataValues) || [];
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] error:  ${error}`,
        );
        return [];
    }
};

/**
 * Get dependency status help details by params
 * @param _id
 * @param category
 */
const getDependencyStatusHelpDetailsByParams = async ({
    _id,
    category,
}: DependencyStatusHelpType) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] _id: ${_id}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] category: ${category}`,
        );

        const dependencyStatusHelpDetails = _id
            ? (
                  await DependencyStatusHelpModelType.findOne({
                      where: {
                          _id,
                      },
                  })
              )?.dataValues
            : (
                  await DependencyStatusHelpModelType.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] dependencyStatusHelpDetails _id: ${dependencyStatusHelpDetails?._id}`,
        );

        if (!dependencyStatusHelpDetails?._id) {
            return null;
        }

        return dependencyStatusHelpDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Initialize default data
 */
const initDefaultData = async () => {
    try {
        const dependencyStatusHelpCount = await DependencyStatusHelpModelType.count();

        AppLogger.info(
            `[DependencyStatusHelpProvider - initDefaultData] dependencyStatusHelpCount:  ${dependencyStatusHelpCount}`,
        );

        if (dependencyStatusHelpCount > 0) {
            return true;
        }

        for (const dependencyStatusHelp of defaultDependencyStatusHelp) {
            await createDependencyStatusHelp(dependencyStatusHelp);
        }

        return true;
    } catch (error) {
        AppLogger.info(`[DependencyStatusHelpProvider - initDefaultData] error:  ${error}`);
        return false;
    }
};

const DependencyStatusHelpProvider = {
    initDefaultData,
    createDependencyStatusHelp,
    editDependencyStatusHelp,
    deleteDependencyStatusHelp,
    deleteDependencyStatusHelpList,
    getDependencyStatusHelpListByPageAndParams,
    getDependencyStatusHelpDetailsByParams,
};

export default DependencyStatusHelpProvider;
