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

const deleteFaqsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteFaqsList] error:  ${error.message}`);
    }
};

const getFaqsByParams = async () => {
    try {
        return faqs;
    } catch (error) {
        AppLogger.info(`[getFaqsByParams] error:  ${error.message}`);
        return [];
    }
};

const FaqProvider = {
    insertFaqList,
    deleteFaqsList,
    getFaqsByParams,
};

export default FaqProvider;
