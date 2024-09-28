import { FindOptions } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { FaqInputType, FaqType } from '../types/FaqType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { FaqModelType } from './models/FaqModel.ts';

/**
 * Format Faq Input
 * @param faq
 */
const formatFaqInput = (faq: FaqInputType) => ({
    _id: faq?._id,
    title: faq.title,
    description: faq.description,

    links: faq.links
        ?.map((link) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Create An Faq
 * @param faq
 */
const createFaq = async (faq: FaqInputType) => {
    try {
        AppLogger.info(`[FaqProvider - createFaq] faq title:  ${faq?.title}`);
        if (!faq?.title?.length) {
            return null;
        }

        const createdFaq = await FaqModelType.create(formatFaqInput(faq));
        AppLogger.info(`[FaqProvider - createFaq] createdFaq: ${createdFaq?._id}`);

        return createdFaq;
    } catch (error) {
        AppLogger.info(`[FaqProvider - createFaq] error:  ${error}`);
        return null;
    }
};

/**
 * Edit an Faq
 * @param faq
 */
const editFaq = async (faq: FaqInputType) => {
    try {
        AppLogger.info(`[FaqProvider - editFaq] faq id:  ${faq?._id}`);
        AppLogger.info(`[FaqProvider - editFaq] faq title:  ${faq?.title}`);

        if (!faq?._id || !faq?.title?.length) {
            return null;
        }

        const editedFaq = await FaqModelType.update(formatFaqInput(faq), {
            where: {
                _id: faq?._id,
            },
        });

        AppLogger.info(`[FaqProvider - editFaq] editedFaq: ${editedFaq?.[0]}`);

        return {
            _id: faq?._id,
        };
    } catch (error) {
        AppLogger.info(`[FaqProvider - editFaq] error:  ${error}`);
        return null;
    }
};

/**
 * Delete Faq
 * @param _id
 */
const deleteFaq = async ({ _id }: FaqType) => {
    try {
        AppLogger.info(`[FaqProvider - deleteFaq] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await FaqModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(`[FaqProvider - deleteFaq] error:  ${error}`);
        return null;
    }
};

/**
 * Delete Faq List
 */
const deleteFaqList = async () => {
    try {
        await FaqModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[FaqProvider - deleteFaqList] error:  ${error}`);
        return false;
    }
};

/**
 * Get Faq List By Parameters
 * @param start
 * @param limit
 * @param sort
 */
const getFaqListByPageAndParams = async ({ start, limit, sort }: SearchQueryType) => {
    try {
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] start: ${start}`);
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] limit: ${limit}`);
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] sort: ${sort}`);

        // Construct the query options based on provided arguments
        const queryOptions: FindOptions = {};

        // Handle pagination
        if (start) {
            // queryOptions.offset = start;
        }

        if (limit) {
            // queryOptions.limit = limit;
        }

        const faqList = await FaqModelType.findAll(queryOptions);
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] faqList: ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] error:  ${error}`);
        return [];
    }
};

/**
 * Get details of an FAQ
 * @param _id
 */
const getFaqDetailsByParams = async ({ _id }: FaqType) => {
    try {
        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] _id: ${_id}`);

        if (!_id) {
            return null;
        }

        const faqDetails = (
            await FaqModelType.findOne({
                where: { _id },
            })
        )?.dataValues;

        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] faqDetails _id: ${faqDetails?._id}`);

        if (!faqDetails?._id) {
            return null;
        }

        return faqDetails;
    } catch (error) {
        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] error: ${error}`);
        return null;
    }
};

const FaqProvider = {
    createFaq,
    editFaq,
    deleteFaq,
    deleteFaqList,
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};

export default FaqProvider;
