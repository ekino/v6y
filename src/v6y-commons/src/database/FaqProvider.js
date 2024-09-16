import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import FaqModel from './models/FaqModel.js';

/**
 * Format Faq
 * @param faq
 * @returns {{description, links: *, _id: *, title}}
 */
const formatFaqInput = (faq) => ({
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
 * Creates a new FAQ entry in the database.
 *
 * @param {Object} faq - The FAQ data to be created.
 * @returns {Object|null} The created FAQ object or null on error or if the FAQ model is not found.
 */
const createFaq = async (faq) => {
    try {
        AppLogger.info(`[FaqProvider - createFaq] faq title:  ${faq?.title}`);
        if (!faq?.title?.length) {
            return null;
        }

        const faqModel = DataBaseManager.getDataBaseSchema(FaqModel.name);

        if (!faqModel) {
            return null;
        }

        const createdFaq = await faqModel.create(formatFaqInput(faq));
        AppLogger.info(`[FaqProvider - createFaq] createdFaq: ${createdFaq?._id}`);

        return createdFaq;
    } catch (error) {
        AppLogger.info(`[FaqProvider - createFaq] error:  ${error.message}`);
        return null;
    }
};

/**
 * Edits an existing FAQ entry in the database.
 *
 * @param {Object} faq - The FAQ data with updated information.
 * @returns {Object|null} An object containing the ID of the edited FAQ or null on error or if the FAQ model is not found.
 */
const editFaq = async (faq) => {
    try {
        AppLogger.info(`[FaqProvider - editFaq] faq id:  ${faq?._id}`);
        AppLogger.info(`[FaqProvider - editFaq] faq title:  ${faq?.title}`);

        if (!faq?._id || !faq?.title?.length) {
            return null;
        }

        const faqModel = DataBaseManager.getDataBaseSchema(FaqModel.name);

        if (!faqModel) {
            return null;
        }

        const editedFaq = await faqModel.update(formatFaqInput(faq), {
            where: {
                _id: faq?._id,
            },
        });

        AppLogger.info(`[FaqProvider - editFaq] editedFaq: ${editedFaq?._id}`);

        return {
            _id: faq?.faqId,
        };
    } catch (error) {
        AppLogger.info(`[FaqProvider - editFaq] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes an FAQ from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.faqId - The ID of the FAQ to delete.
 * @returns {Object|null} An object containing the ID of the deleted FAQ, or null on error or if faqId is not provided or if the FAQ model is not found.
 */
const deleteFaq = async ({ faqId }) => {
    try {
        AppLogger.info(`[FaqProvider - deleteFaq] faqId:  ${faqId}`);
        if (!faqId) {
            return null;
        }

        const faqModel = DataBaseManager.getDataBaseSchema(FaqModel.name);

        if (!faqModel) {
            return null;
        }

        await faqModel.destroy({
            where: {
                _id: faqId,
            },
        });

        return {
            _id: faqId,
        };
    } catch (error) {
        AppLogger.info(`[FaqProvider - deleteFaq] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all FAQs from the database
 *
 * @returns {boolean} True if the deletion was successful, false otherwise
 */
const deleteFaqList = async () => {
    try {
        const faqModel = DataBaseManager.getDataBaseSchema(FaqModel.name);
        if (!faqModel) {
            return null;
        }

        await faqModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[FaqProvider - deleteFaqList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves a list of FAQs, potentially paginated and sorted
 *
 * @param {Object} params - An object containing query parameters
 * @param {number} [params.start] - The starting index for pagination (optional)
 * @param {number} [params.limit] - The maximum number of FAQs to retrieve (optional)
 * @param {Object} [params.sort] - An object defining the sorting criteria (optional)
 * @returns {Array|null} An array of FAQ objects or null on error or if the FAQ model is not found
 */
const getFaqListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] start: ${start}`);
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] limit: ${limit}`);
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] sort: ${sort}`);

        const faqModel = DataBaseManager.getDataBaseSchema(FaqModel.name);
        if (!faqModel) {
            return null;
        }

        // Construct the query options based on provided arguments
        const queryOptions = {};

        // Handle pagination
        if (start) {
            queryOptions.offset = start;
        }

        if (limit) {
            queryOptions.limit = limit;
        }

        const faqList = await faqModel.findAll(queryOptions);
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] faqList: ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqProvider - getFaqListByPageAndParams] error:  ${error.message}`);
        return [];
    }
};

/**
 * Retrieves the details of an FAQ by its ID.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.faqId - The ID of the FAQ to retrieve
 * @returns {Object|null} The FAQ details or null if not found or on error or if the FAQ model is not found
 */
const getFaqDetailsByParams = async ({ faqId }) => {
    try {
        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] faqId: ${faqId}`);

        if (!faqId?.length) {
            return null;
        }

        const faqModel = DataBaseManager.getDataBaseSchema(FaqModel.name);

        if (!faqModel) {
            return null;
        }

        const faqDetails = (
            await faqModel.findOne({
                where: { _id: faqId },
            })
        )?.dataValues;

        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] faqDetails _id: ${faqDetails?._id}`);

        if (!faqDetails?._id) {
            return null;
        }

        return faqDetails;
    } catch (error) {
        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] error: ${error.message}`);
        return null;
    }
};

/**
 * An object that provides various operations related to FAQs.
 */
const FaqProvider = {
    createFaq,
    editFaq,
    deleteFaq,
    deleteFaqList,
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};

export default FaqProvider;
