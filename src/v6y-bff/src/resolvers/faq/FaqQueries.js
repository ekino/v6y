import { AppLogger, FaqProvider } from '@v6y/commons';

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

        const faqList = await FaqProvider.getFaqListByPageAndParams();

        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] faqList : ${faqList?.length}`);

        return faqList;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqListByPageAndParams] error : ${error.message}`);
        return [];
    }
};

const getFaqDetailsByParams = async (_, args) => {
    try {
        const { faqId } = args || {};

        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] faqId : ${faqId}`);

        const appDetails = await FaqProvider.getFaqDetailsByParams({
            faqId,
        });

        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] appDetails : ${appDetails?._id}`);

        return appDetails;
    } catch (error) {
        AppLogger.info(`[FaqQueries - getFaqDetailsByParams] error : ${error.message}`);
        return {};
    }
};

const FaqQueries = {
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};

export default FaqQueries;
