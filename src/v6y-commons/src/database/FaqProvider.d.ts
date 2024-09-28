import { FaqInputType, FaqType } from '../types/FaqType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { FaqModelType } from './models/FaqModel.ts';
declare const FaqProvider: {
    createFaq: (faq: FaqInputType) => Promise<FaqModelType | null>;
    editFaq: (faq: FaqInputType) => Promise<{
        _id: number;
    } | null>;
    deleteFaq: ({ _id }: FaqType) => Promise<{
        _id: number;
    } | null>;
    deleteFaqList: () => Promise<boolean>;
    getFaqListByPageAndParams: ({ start, limit, sort }: SearchQueryType) => Promise<FaqModelType[]>;
    getFaqDetailsByParams: ({ _id }: FaqType) => Promise<FaqType | null>;
};
export default FaqProvider;
