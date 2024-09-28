import { FaqType, SearchQueryType } from '@v6y/commons';
declare const FaqQueries: {
    getFaqListByPageAndParams: (_: unknown, args: SearchQueryType) => Promise<import("@v6y/commons/src/database/models/FaqModel.ts").FaqModelType[]>;
    getFaqDetailsByParams: (_: unknown, args: FaqType) => Promise<FaqType | null>;
};
export default FaqQueries;
