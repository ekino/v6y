import { AppLogger, FaqProvider } from '@v6y/commons';

/**
 * Creates or edits a FAQ entry.
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the FAQ input data.
 * @returns An object representing the created or edited FAQ entry,
 * or an empty object on error.
 */
const createOrEditFaq = async (_, params) => {
    try {
        const { faqId, title, description, links } = params?.faqInput || {};

        AppLogger.info(`[FaqMutations - createOrEditFaq] faqId : ${faqId}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] title : ${title}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] description : ${description}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] links : ${links?.join(',')}`);

        if (faqId) {
            const editedFaq = await FaqProvider.editFaq({
                _id: faqId,
                title,
                description,
                links,
            });

            AppLogger.info(`[FaqMutations - createOrEditFaq] editedFaq : ${editedFaq?._id}`);

            return {
                _id: faqId,
            };
        }

        const createdFaq = await FaqProvider.createFaq({
            title,
            description,
            links,
        });

        AppLogger.info(`[FaqMutations - createOrEditFaq] createdFaq : ${createdFaq?._id}`);

        return createdFaq;
    } catch (error) {
        AppLogger.info(`[FaqMutations - createOrEditFaq] error : ${error.message}`);
        return null;
    }
};

/**
 * Deletes a FAQ entry
 *
 * @param _ - Placeholder parameter (not used).
 * @param params - An object containing the input data with the FAQ ID to delete
 * @returns An object containing the deleted FAQ ID or an empty object on error.
 */
const deleteFaq = async (_, params) => {
    try {
        const faqId = params?.input?.where?.id || {};

        AppLogger.info(`[FaqMutations - deleteFaq] faqId : ${faqId}`);

        await FaqProvider.deleteFaq({ faqId });

        return {
            _id: faqId,
        };
    } catch (error) {
        AppLogger.info(`[FaqMutations - deleteFaq] error : ${error.message}`);
        return null;
    }
};

/**
 * An object containing FAQ mutation functions
 */
const FaqMutations = {
    createOrEditFaq,
    deleteFaq,
};

export default FaqMutations;
