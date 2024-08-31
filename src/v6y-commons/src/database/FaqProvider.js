import { faqs } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertFaq = async (faq) => {
    try {
        AppLogger.info(`[insertFaq] faq title:  ${faq?.title}`);
        if (!faq?.title?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[insertFaq] error:  ${error.message}`);
        return {};
    }
};

const insertFaqList = async (faqList) => {
    try {
        if (!faqList?.length) {
            return;
        }

        for (const faq of faqList) {
            await insertFaq(faq);
        }
    } catch (error) {
        AppLogger.info(`[insertFaqList] error:  ${error.message}`);
    }
};

const deleteFaqList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteFaqList] error:  ${error.message}`);
    }
};

const getFaqListByPageAndParams = async () => {
    try {
        return faqs;
    } catch (error) {
        AppLogger.info(`[getFaqListByPageAndParams] error:  ${error.message}`);
        return [];
    }
};

const getFaqDetailsByParams = async ({ faqId }) => {
    try {
        AppLogger.info(`[FaqProvider - getApplicationDetailsByParams] faqId: ${faqId}`);

        if (!faqId?.length) {
            return null;
        }

        const faqDetails = faqs?.find((faq) => faq._id === faqId);

        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] appDetails _id: ${faqDetails?._id}`);

        if (!faqDetails?._id) {
            return null;
        }

        return faqDetails;
    } catch (error) {
        AppLogger.info(`[FaqProvider - getFaqDetailsByParams] error: ${error.message}`);
        return {};
    }
};

const FaqProvider = {
    insertFaqList,
    deleteFaqList,
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};

export default FaqProvider;
