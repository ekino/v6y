import AppLogger from '../core/AppLogger.ts';
import { FaqInputType, FaqType } from '../types/FaqType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const formatFaqInput = (faq: FaqInputType) => ({
    title: faq.title,
    description: faq.description,
    links:
        faq.links
            ?.map((link) => ({ label: 'More Information', value: link, description: '' }))
            ?.filter((item) => item?.value) ?? [],
});

const createFaq = async (faq: FaqInputType) => {
    try {
        if (!faq?.title?.length) return null;
        const data = formatFaqInput(faq);
        const created = await getPrismaClient().faq.create({
            data: { ...data, links: data.links.length ? data.links : undefined },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.error('[FaqProvider - createFaq] error: ', error);
        return null;
    }
};

const editFaq = async (faq: FaqInputType) => {
    try {
        if (!faq?._id || !faq?.title?.length) return null;
        const data = formatFaqInput(faq);
        await getPrismaClient().faq.update({
            where: { id: faq._id },
            data: { ...data, links: data.links.length ? data.links : undefined },
        });
        return { _id: faq._id };
    } catch (error) {
        AppLogger.error('[FaqProvider - editFaq] error: ', error);
        return null;
    }
};

const deleteFaq = async ({ _id }: FaqType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().faq.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.error('[FaqProvider - deleteFaq] error: ', error);
        return null;
    }
};

const deleteFaqList = async () => {
    try {
        await getPrismaClient().faq.deleteMany();
        return true;
    } catch (error) {
        AppLogger.error('[FaqProvider - deleteFaqList] error: ', error);
        return false;
    }
};

const getFaqListByPageAndParams = async ({ start, limit }: SearchQueryType) => {
    try {
        const list = await getPrismaClient().faq.findMany({
            skip: start ?? undefined,
            take: limit ?? undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.error('[FaqProvider - getFaqListByPageAndParams] error: ', error);
        return [];
    }
};

const getFaqDetailsByParams = async ({ _id }: FaqType) => {
    try {
        if (!_id) return null;
        const item = await getPrismaClient().faq.findUnique({ where: { id: _id } });
        if (!item) return null;
        return { ...item, _id: item.id };
    } catch (error) {
        AppLogger.error('[FaqProvider - getFaqDetailsByParams] error: ', error);
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
export default FaqProvider;
