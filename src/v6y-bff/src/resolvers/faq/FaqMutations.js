import { AppLogger } from '@v6y/commons';

const createOrEditFaq = async (_, params) => {
    try {
        const { faqId, title, description, links } = params?.faqInput || {};

        AppLogger.info(`[FaqMutations - createOrEditFaq] faqId : ${faqId}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] title : ${title}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] description : ${description}`);
        AppLogger.info(`[FaqMutations - createOrEditFaq] links : ${links?.join(',')}`);

        return {
            _id: faqId || 'AZ987',
            title,
            description,
            links,
        };
    } catch (error) {
        AppLogger.info(`[FaqMutations - createOrEditFaq] error : ${error.message}`);
        return {};
    }
};

const deleteFaq = async (_, params) => {
    try {
        const faqId = params?.input?.where?.id || {};
        AppLogger.info(`[FaqMutations - deleteFaq] faqId : ${faqId}`);

        return {
            _id: faqId,
        };
    } catch (error) {
        AppLogger.info(`[FaqMutations - deleteFaq] error : ${error.message}`);
        return {};
    }
};

const FaqMutations = {
    createOrEditFaq,
    deleteFaq,
};

export default FaqMutations;
