import { FaqType, SearchQueryType } from '@v6y/commons';
declare const FaqQueries: {
    getFaqListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<FaqType[]>;
    getFaqDetailsByParams: (_: unknown, args: FaqType) => Promise<FaqType | null>;
};
export default FaqQueries;
