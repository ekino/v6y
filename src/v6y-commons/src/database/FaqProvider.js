"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const FaqModel_1 = require("./models/FaqModel");
/**
 * Format Faq Input
 * @param faq
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
 * Create An Faq
 * @param faq
 */
const createFaq = async (faq) => {
    try {
        AppLogger_1.default.info(`[FaqProvider - createFaq] faq title:  ${faq?.title}`);
        if (!faq?.title?.length) {
            return null;
        }
        const createdFaq = await FaqModel_1.FaqModelType.create(formatFaqInput(faq));
        AppLogger_1.default.info(`[FaqProvider - createFaq] createdFaq: ${createdFaq?._id}`);
        return createdFaq;
    }
    catch (error) {
        AppLogger_1.default.info(`[FaqProvider - createFaq] error:  ${error}`);
        return null;
    }
};
/**
 * Edit an Faq
 * @param faq
 */
const editFaq = async (faq) => {
    try {
        AppLogger_1.default.info(`[FaqProvider - editFaq] faq id:  ${faq?._id}`);
        AppLogger_1.default.info(`[FaqProvider - editFaq] faq title:  ${faq?.title}`);
        if (!faq?._id || !faq?.title?.length) {
            return null;
        }
        const editedFaq = await FaqModel_1.FaqModelType.update(formatFaqInput(faq), {
            where: {
                _id: faq?._id,
            },
        });
        AppLogger_1.default.info(`[FaqProvider - editFaq] editedFaq: ${editedFaq?.[0]}`);
        return {
            _id: faq?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[FaqProvider - editFaq] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Faq
 * @param _id
 */
const deleteFaq = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[FaqProvider - deleteFaq] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await FaqModel_1.FaqModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[FaqProvider - deleteFaq] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Faq List
 */
const deleteFaqList = async () => {
    try {
        await FaqModel_1.FaqModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[FaqProvider - deleteFaqList] error:  ${error}`);
        return false;
    }
};
/**
 * Get Faq List By Parameters
 * @param start
 * @param limit
 * @param sort
 */
const getFaqListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger_1.default.info(`[FaqProvider - getFaqListByPageAndParams] start: ${start}`);
        AppLogger_1.default.info(`[FaqProvider - getFaqListByPageAndParams] limit: ${limit}`);
        AppLogger_1.default.info(`[FaqProvider - getFaqListByPageAndParams] sort: ${sort}`);
        // Construct the query options based on provided arguments
        const queryOptions = {};
        // Handle pagination
        if (start) {
            // queryOptions.offset = start;
        }
        if (limit) {
            // queryOptions.limit = limit;
        }
        const faqList = await FaqModel_1.FaqModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[FaqProvider - getFaqListByPageAndParams] faqList: ${faqList?.length}`);
        return faqList;
    }
    catch (error) {
        AppLogger_1.default.info(`[FaqProvider - getFaqListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Get details of an FAQ
 * @param _id
 */
const getFaqDetailsByParams = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[FaqProvider - getFaqDetailsByParams] _id: ${_id}`);
        if (!_id) {
            return null;
        }
        const faqDetails = (await FaqModel_1.FaqModelType.findOne({
            where: { _id },
        }))?.dataValues;
        AppLogger_1.default.info(`[FaqProvider - getFaqDetailsByParams] faqDetails _id: ${faqDetails?._id}`);
        if (!faqDetails?._id) {
            return null;
        }
        return faqDetails;
    }
    catch (error) {
        AppLogger_1.default.info(`[FaqProvider - getFaqDetailsByParams] error: ${error}`);
        return null;
    }
};
const FaqProvider = {
    createFaq,
    editFaq,
    deleteFaq,
    deleteFaqList,
    getFaqListByPageAndParams,
    getFaqDetailsByParams,
};
exports.default = FaqProvider;
