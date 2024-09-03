import { AppLogger, FaqProvider } from '@v6y/commons';

/**
 * Retrieves a list of FAQs based on pagination and filtering parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including:
 *   - `start` (number): The starting index for pagination.
 *   - `limit` (number): The maximum number of FAQs to retrieve.
 *   - `sort` (object): An optional object defining the sorting criteria.
 * @returns An array of FAQ entries matching the criteria or an empty array on error
 */
const getFaqListByPageAndParams = async (_, args) => {
    try {
        const { start, limit, sort } = args || {};
        // Log the input parameters for debugging/tracking purposes
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] start : ${start}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] limit : ${limit}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] sort : ${sort}`);

        // Fetch the FAQ list (Note: the provided arguments are not being used in the call)
        const faqList = await FaqProvider.getFaqListByPageAndParams({ start, limit, sort });

        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] faqList : ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] error : ${error.message}`);
        return [];
    }
};

/**
 * Retrieves the details of a specific FAQ by its ID
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing the query arguments, including 'faqId'
 * @returns An object containing the FAQ details or an empty object if not found or on error.
 */
const getFaqDetailsByParams = async (_, args) => {
    try {
        const { faqId } = args || {};

        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] faqId : ${faqId}`);

        if (!faqId) {
            return null;
        }

        const faqDetails = await FaqProvider.getFaqDetailsByParams({
            faqId,
        });

        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] faqDetails : ${faqDetails?._id}`);

        return faqDetails;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] error : ${error.message}`);
        return null;
    }
};

/**
 * An object containing FAQ query functions
 */
const FaqQueries = {
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};

export default FaqQueries;
