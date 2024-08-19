import { AppLogger, FaqProvider } from '@v6y/commons';

const getFaqsByParams = async () => {
    try {
        const faqList = await FaqProvider.getFaqsByParams();

        AppLogger.info(`[FaqQueries - getFaqsByParams] faqList : ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqsByParams] error : ${error.message}`);
        return [];
    }
};

const FaqQueries = {
    getFaqsByParams,
};

export default FaqQueries;
