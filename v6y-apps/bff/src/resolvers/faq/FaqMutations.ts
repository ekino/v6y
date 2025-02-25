import { AppLogger, FaqInputType, FaqProvider, SearchQueryType } from '@v6y/core-logic';

/**
 * Create or edit faq
 * @param _
 * @param params
 */
const createOrEditFaq = async (_: unknown, params: { faqInput: FaqInputType }) => {
    try {
        const { _id, title, description, links } = params?.faqInput || {};

        AppLogger.info(`[FaqMutations - createOrEditFaq] _id : ${_id}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] title : ${title}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] description : ${description}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] links : ${links?.join(',')}`);

        if (_id) {
            const editedFaq = await FaqProvider.editFaq({
                _id,
                title,
                description,
                links,
            });

            AppLogger.info(`[FaqMutations - createOrEditFaq] editedFaq : ${editedFaq?._id}`);

            return {
                _id,
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
        AppLogger.info(`[FaqMutations - createOrEditFaq] error : ${error}`);
        return null;
    }
};

/**
 * Delete faq
 * @param _
 * @param params
 */
const deleteFaq = async (_: unknown, params: { input: SearchQueryType }) => {
    try {
        const whereClause = params?.input;
        if (!whereClause) {
            return null;
        }

        const faqId = whereClause.id;
        if (!faqId) {
            return null;
        }

        AppLogger.info(`[FaqMutations - deleteFaq] faqId : ${faqId}`);

        await FaqProvider.deleteFaq({ _id: parseInt(faqId, 10) });

        return {
            _id: faqId,
        };
    } catch (error) {
        AppLogger.info(`[FaqMutations - deleteFaq] error : ${error}`);
        return null;
    }
};

const FaqMutations = {
    createOrEditFaq,
    deleteFaq,
};

export default FaqMutations;
