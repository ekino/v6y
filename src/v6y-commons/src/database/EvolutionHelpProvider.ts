import { FindOptions } from 'sequelize';

import { defaultEvolutionHelpStatus } from '../config/EvolutionHelpStatusConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import { EvolutionHelpInputType, EvolutionHelpType } from '../types/EvolutionHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { EvolutionHelpModelType } from './models/EvolutionHelpModel.ts';

/**
 * Formats the input EvolutionHelp object to the format expected by the database
 * @param evolutionHelp
 */
const formatEvolutionHelpInput = (evolutionHelp: EvolutionHelpInputType) => ({
    _id: evolutionHelp._id,
    title: evolutionHelp.title,
    description: evolutionHelp.description,
    category: evolutionHelp.category,
    status: evolutionHelp.status,

    links: evolutionHelp.links
        ?.map((link) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Creates a new EvolutionHelp in the database
 * @param evolutionHelp
 */
const createEvolutionHelp = async (evolutionHelp: EvolutionHelpInputType) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - createEvolutionHelp] evolutionHelp title:  ${evolutionHelp?.title}`,
        );
        if (!evolutionHelp?.title?.length) {
            return null;
        }

        const createdEvolutionHelp = await EvolutionHelpModelType.create(
            formatEvolutionHelpInput(evolutionHelp),
        );
        AppLogger.info(
            `[EvolutionHelpProvider - createEvolutionHelp] createdEvolutionHelp: ${createdEvolutionHelp?._id}`,
        );

        return createdEvolutionHelp;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - createEvolutionHelp] error:  ${error}`);
        return null;
    }
};

/**
 * Edits an existing EvolutionHelp in the database
 * @param evolutionHelp
 */
const editEvolutionHelp = async (evolutionHelp: EvolutionHelpInputType) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - editEvolutionHelp] evolutionHelp id:  ${evolutionHelp?._id}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - editEvolutionHelp] evolutionHelp title:  ${evolutionHelp?.title}`,
        );

        if (!evolutionHelp?._id || !evolutionHelp?.title?.length) {
            return null;
        }

        const editedEvolutionHelp = await EvolutionHelpModelType.update(
            formatEvolutionHelpInput(evolutionHelp),
            {
                where: {
                    _id: evolutionHelp?._id,
                },
            },
        );

        AppLogger.info(
            `[EvolutionHelpProvider - editEvolutionHelp] editedEvolutionHelp: ${editedEvolutionHelp?.[0]}`,
        );

        return {
            _id: evolutionHelp?._id,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - editEvolutionHelp] error:  ${error}`);
        return null;
    }
};

/**
 * Deletes an existing EvolutionHelp from the database
 * @param _id
 */
const deleteEvolutionHelp = async ({ _id }: EvolutionHelpType) => {
    try {
        AppLogger.info(`[EvolutionHelpProvider - deleteEvolutionHelp] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await EvolutionHelpModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - deleteEvolutionHelp] error:  ${error}`);
        return null;
    }
};

/**
 * Deletes all EvolutionHelps from the database
 */
const deleteEvolutionHelpList = async () => {
    try {
        await EvolutionHelpModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - deleteEvolutionHelpList] error:  ${error}`);
        return false;
    }
};

/**
 * Retrieves a list of EvolutionHelps from the database based on the provided search parameters
 * @param start
 * @param limit
 * @param sort
 */
const getEvolutionHelpListByPageAndParams = async ({ start, limit, sort }: SearchQueryType) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] sort: ${sort}`,
        );

        // Construct the query options based on provided arguments
        const queryOptions: FindOptions = {};

        // Handle pagination
        if (start) {
            //  queryOptions.offset = start;
        }

        if (limit) {
            //  queryOptions.limit = limit;
        }

        const evolutionHelpList = await EvolutionHelpModelType.findAll(queryOptions);

        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] evolutionHelpList: ${evolutionHelpList?.length}`,
        );

        return evolutionHelpList?.map((item) => item?.dataValues) || [];
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] error:  ${error}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of an EvolutionHelp based on the provided search parameters
 * @param _id
 * @param category
 */
const getEvolutionHelpDetailsByParams = async ({ _id, category }: EvolutionHelpType) => {
    try {
        AppLogger.info(`[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] _id: ${_id}`);
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] category: ${category}`,
        );

        const evolutionHelpDetails = _id
            ? (
                  await EvolutionHelpModelType.findOne({
                      where: {
                          _id,
                      },
                  })
              )?.dataValues
            : (
                  await EvolutionHelpModelType.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] evolutionHelpDetails _id: ${evolutionHelpDetails?._id}`,
        );

        if (!evolutionHelpDetails?._id) {
            return null;
        }

        return evolutionHelpDetails;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] error: ${error}`);
        return null;
    }
};

/**
 * Initializes the default data for EvolutionHelps
 */
const initDefaultData = async () => {
    try {
        const evolutionHelpCount = await EvolutionHelpModelType.count();

        AppLogger.info(
            `[EvolutionHelpProvider - initDefaultData] evolutionHelpCount:  ${evolutionHelpCount}`,
        );

        if (evolutionHelpCount > 0) {
            return true;
        }

        for (const evolutionHelp of defaultEvolutionHelpStatus) {
            await createEvolutionHelp(evolutionHelp);
        }

        return true;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - initDefaultData] error:  ${error}`);
        return false;
    }
};

const EvolutionHelpProvider = {
    initDefaultData,
    createEvolutionHelp,
    editEvolutionHelp,
    deleteEvolutionHelp,
    deleteEvolutionHelpList,
    getEvolutionHelpListByPageAndParams,
    getEvolutionHelpDetailsByParams,
};

export default EvolutionHelpProvider;
