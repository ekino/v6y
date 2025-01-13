import { AppLogger, FaqProvider, FaqType, SearchQueryType } from '@v6y/core-logic';

/**
 * Fetch the FAQ list by page and parameters
 * @param _
 * @param args
 */
const getFaqListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { start, limit, sort } = args || {};
        // Log the input parameters for debugging/tracking purposes
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] start : ${start}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] limit : ${limit}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] sort : ${sort}`);

        // Fetch the FAQ list (Note: the provided arguments are not being used in the call)
        const faqList = await FaqProvider.getFaqListByPageAndParams({
            start,
            limit,
            sort,
        });

        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] faqList : ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] error : ${error}`);
        return [];
    }
};

/**
 * Fetch the FAQ details by parameters
 * @param _
 * @param args
 */
const getFaqDetailsByParams = async (_: unknown, args: FaqType) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] _id : ${_id}`);

        if (!_id) {
            return null;
        }

        const faqDetails = await FaqProvider.getFaqDetailsByParams({
            _id,
        });

        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] faqDetails : ${faqDetails?._id}`);

        return faqDetails;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] error : ${error}`);
        return null;
    }
};

const FaqQueries = {
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};

export default FaqQueries;
