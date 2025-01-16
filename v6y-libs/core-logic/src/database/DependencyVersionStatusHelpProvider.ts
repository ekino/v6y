import { FindOptions } from 'sequelize';

import { defaultDependencyVersionStatusHelp } from '../config/DependencyVersionStatusHelpConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import {
    DependencyVersionStatusHelpInputType,
    DependencyVersionStatusHelpType,
} from '../types/DependencyVersionStatusHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { DependencyVersionStatusHelpModelType } from './models/DependencyVersionStatusHelpModel.ts';

/**
 * Format the dependency version status help input
 * @param dependencyVersionStatusHelp
 */
const formatDependencyVersionStatusHelpInput = (
    dependencyVersionStatusHelp: DependencyVersionStatusHelpInputType,
): DependencyVersionStatusHelpType => ({
    _id: dependencyVersionStatusHelp?._id,
    title: dependencyVersionStatusHelp.title,
    description: dependencyVersionStatusHelp.description,
    category: dependencyVersionStatusHelp.category,
    links: dependencyVersionStatusHelp.links
        ?.map((link: string) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Create a new dependency version status help
 * @param dependencyVersionStatusHelp
 */
const createDependencyVersionStatusHelp = async (
    dependencyVersionStatusHelp: DependencyVersionStatusHelpInputType,
) => {
    try {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - createDependencyVersionStatusHelp] dependencyVersionStatusHelp title:  ${dependencyVersionStatusHelp?.title}`,
        );
        if (!dependencyVersionStatusHelp?.title?.length) {
            return null;
        }

        const createdDependencyVersionStatusHelp =
            await DependencyVersionStatusHelpModelType.create(
                formatDependencyVersionStatusHelpInput(dependencyVersionStatusHelp),
            );
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - createDependencyVersionStatusHelp] createdDependencyVersionStatusHelp: ${createdDependencyVersionStatusHelp?._id}`,
        );

        return createdDependencyVersionStatusHelp;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - createDependencyVersionStatusHelp] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Edit an existing dependency version status help
 * @param dependencyVersionStatusHelp
 */
const editDependencyVersionStatusHelp = async (
    dependencyVersionStatusHelp: DependencyVersionStatusHelpInputType,
) => {
    try {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - editDependencyVersionStatusHelp] dependencyVersionStatusHelp id:  ${dependencyVersionStatusHelp?._id}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - editDependencyVersionStatusHelp] dependencyVersionStatusHelp title:  ${dependencyVersionStatusHelp?.title}`,
        );

        if (!dependencyVersionStatusHelp?._id || !dependencyVersionStatusHelp?.title?.length) {
            return null;
        }

        const editedDependencyVersionStatusHelp = await DependencyVersionStatusHelpModelType.update(
            formatDependencyVersionStatusHelpInput(dependencyVersionStatusHelp),
            {
                where: {
                    _id: dependencyVersionStatusHelp?._id,
                },
            },
        );

        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - editDependencyVersionStatusHelp] editedDependencyVersionStatusHelp: ${editedDependencyVersionStatusHelp?.[0]}`,
        );

        return {
            _id: dependencyVersionStatusHelp?._id,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - editDependencyVersionStatusHelp] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Delete a dependency version status help
 * @param _id
 */
const deleteDependencyVersionStatusHelp = async ({ _id }: DependencyVersionStatusHelpType) => {
    try {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - deleteDependencyVersionStatusHelp] _id:  ${_id}`,
        );
        if (!_id) {
            return null;
        }

        await DependencyVersionStatusHelpModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - deleteDependencyVersionStatusHelp] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Delete all dependency version status help
 */
const deleteDependencyVersionStatusHelpList = async () => {
    try {
        await DependencyVersionStatusHelpModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - deleteDependencyVersionStatusHelpList] error:  ${error}`,
        );
        return false;
    }
};

/**
 * Get dependency version status help list by page and params
 * @param start
 * @param limit
 * @param sort
 */
const getDependencyVersionStatusHelpListByPageAndParams = async ({
    start,
    limit,
    sort,
}: SearchQueryType) => {
    try {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpListByPageAndParams] sort: ${sort}`,
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

        const dependencyVersionStatusHelpList =
            await DependencyVersionStatusHelpModelType.findAll(queryOptions);
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpListByPageAndParams] dependencyVersionStatusHelpList: ${dependencyVersionStatusHelpList?.length}`,
        );

        return dependencyVersionStatusHelpList?.map((item) => item?.dataValues) || [];
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpListByPageAndParams] error:  ${error}`,
        );
        return [];
    }
};

/**
 * Get dependency version status help details by params
 * @param _id
 * @param category
 */
const getDependencyVersionStatusHelpDetailsByParams = async ({
    _id,
    category,
}: DependencyVersionStatusHelpType) => {
    try {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpDetailsByParams] _id: ${_id}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpDetailsByParams] category: ${category}`,
        );

        const dependencyVersionStatusHelpDetails = _id
            ? (
                  await DependencyVersionStatusHelpModelType.findOne({
                      where: {
                          _id,
                      },
                  })
              )?.dataValues
            : (
                  await DependencyVersionStatusHelpModelType.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpDetailsByParams] dependencyVersionStatusHelpDetails _id: ${dependencyVersionStatusHelpDetails?._id}`,
        );

        if (!dependencyVersionStatusHelpDetails?._id) {
            return null;
        }

        return dependencyVersionStatusHelpDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - getDependencyVersionStatusHelpDetailsByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Initialize default data
 */
const initDefaultData = async () => {
    try {
        const dependencyVersionStatusHelpCount = await DependencyVersionStatusHelpModelType.count();

        AppLogger.info(
            `[DependencyVersionStatusHelpProvider - initDefaultData] dependencyVersionStatusHelpCount:  ${dependencyVersionStatusHelpCount}`,
        );

        if (dependencyVersionStatusHelpCount > 0) {
            return true;
        }

        for (const dependencyVersionStatusHelp of defaultDependencyVersionStatusHelp) {
            await createDependencyVersionStatusHelp(dependencyVersionStatusHelp);
        }

        return true;
    } catch (error) {
        AppLogger.info(`[DependencyVersionStatusHelpProvider - initDefaultData] error:  ${error}`);
        return false;
    }
};

const DependencyVersionStatusHelpProvider = {
    initDefaultData,
    createDependencyVersionStatusHelp,
    editDependencyVersionStatusHelp,
    deleteDependencyVersionStatusHelp,
    deleteDependencyVersionStatusHelpList,
    getDependencyVersionStatusHelpListByPageAndParams,
    getDependencyVersionStatusHelpDetailsByParams,
};

export default DependencyVersionStatusHelpProvider;
