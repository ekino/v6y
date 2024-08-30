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

const getFaqListByPageAndParams = async (_, args) => {
    try {
        const { start, offset, limit, keywords, searchText, where, sort } = args || {};

        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] start : ${start}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] offset : ${offset}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[FaqQueries - getFaqListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] searchText : ${searchText}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] where : ${where}`);
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] sort : ${sort}`);

        const faqList = await FaqProvider.getFaqsByParams();

        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] faqList : ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] error : ${error.message}`);
        return [];
    }
};

const getFaqDetailsInfosByParams = async (_, args) => {
    try {
        const { faqId } = args || {};

        AppLogger.info(`[FaqQueries - getFaqDetailsInfosByParams] faqId : ${faqId}`);

        const appDetails = await FaqProvider.getFaqDetailsInfosByParams({
            faqId,
        });

        AppLogger.info(`[FaqQueries - getFaqDetailsInfosByParams] appDetails : ${appDetails?._id}`);

        return appDetails;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqDetailsInfosByParams] error : ${error.message}`);
        return {};
    }
};

const FaqQueries = {
    getFaqsByParams,
    getFaqListByPageAndParams,
    getFaqDetailsInfosByParams,
};

export default FaqQueries;
