import AppLogger from '../core/AppLogger.ts';
import { DeprecatedDependencyType } from '../types/DeprecatedDependencyType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { DeprecatedDependencyModelType } from './models/DeprecatedDependencyModel.ts';

/**
 * Create a new deprecated dependency
 * @param deprecatedDependency
 */
const createDeprecatedDependency = async (deprecatedDependency: DeprecatedDependencyType) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - createDeprecatedDependency] deprecatedDependency name:  ${deprecatedDependency?.name}`,
        );

        if (!deprecatedDependency?.name?.length) {
            return null;
        }

        const createdDeprecatedDependency =
            await DeprecatedDependencyModelType.create(deprecatedDependency);
        AppLogger.info(
            `[DeprecatedDependencyProvider - createDeprecatedDependency] createdDeprecatedDependency _id: ${createdDeprecatedDependency?._id}`,
        );

        return createdDeprecatedDependency;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - createDeprecatedDependency] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Edit an existing deprecated dependency
 * @param deprecatedDependency
 */
const editDeprecatedDependency = async (deprecatedDependency: DeprecatedDependencyType) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] deprecatedDependency id:  ${deprecatedDependency?._id}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] deprecatedDependency name:  ${deprecatedDependency?.name}`,
        );

        if (!deprecatedDependency?._id || !deprecatedDependency?.name?.length) {
            return null;
        }

        const editedDeprecatedDependency = await DeprecatedDependencyModelType.update(
            deprecatedDependency,
            {
                where: {
                    _id: deprecatedDependency?._id,
                },
            },
        );

        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] editedDeprecatedDependency: ${editedDeprecatedDependency?.[0]}`,
        );

        return {
            _id: deprecatedDependency?._id,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Delete a deprecated dependency
 * @param _id
 */
const deleteDeprecatedDependency = async ({ _id }: DeprecatedDependencyType) => {
    try {
        AppLogger.info(`[DeprecatedDependencyProvider - deleteDeprecatedDependency] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await DeprecatedDependencyModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - deleteDeprecatedDependency] error:  ${error}`,
        );
        return null;
    }
};

/**
 * Delete all deprecated dependencies
 */
const deleteDeprecatedDependencyList = async () => {
    try {
        await DeprecatedDependencyModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - deleteDeprecatedDependencyList] error:  ${error}`,
        );
        return false;
    }
};

/**
 * Get deprecated dependencies by page and query parameters
 * @param start
 * @param limit
 * @param sort
 */
const getDeprecatedDependencyListByPageAndParams = async ({
    start,
    limit,
    sort,
}: SearchQueryType) => {
    try {
        // Construct the query options based on provided arguments
        const queryOptions = {};

        // Handle pagination
        if (start !== undefined) {
            // queryOptions.offset = start;
        }

        if (limit !== undefined) {
            //    queryOptions.limit = limit;
        }

        // Handle sorting
        if (sort) {
            // queryOptions.order = sort; // Assuming 'sort' specifies the sorting order directly
        }

        const deprecatedDependencyList = await DeprecatedDependencyModelType.findAll(queryOptions);
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] deprecatedDependencyList: ${deprecatedDependencyList?.length}`,
        );

        return deprecatedDependencyList;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] error:  ${error}`,
        );
        return [];
    }
};

/**
 * Get deprecated dependency details by parameters
 * @param _id
 * @param name
 */
const getDeprecatedDependencyDetailsByParams = async ({ _id, name }: DeprecatedDependencyType) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] _id: ${_id}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] name: ${name}`,
        );

        const deprecatedDependencyDetails = _id
            ? (
                  await DeprecatedDependencyModelType.findOne({
                      where: {
                          _id,
                      },
                  })
              )?.dataValues
            : (
                  await DeprecatedDependencyModelType.findOne({
                      where: {
                          name,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] deprecatedDependencyDetails _id: ${deprecatedDependencyDetails?._id}`,
        );

        if (!deprecatedDependencyDetails?._id) {
            return null;
        }

        return deprecatedDependencyDetails;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] error: ${error}`,
        );
        return null;
    }
};

const DeprecatedDependencyProvider = {
    createDeprecatedDependency,
    editDeprecatedDependency,
    deleteDeprecatedDependency,
    deleteDeprecatedDependencyList,
    getDeprecatedDependencyListByPageAndParams,
    getDeprecatedDependencyDetailsByParams,
};

export default DeprecatedDependencyProvider;
