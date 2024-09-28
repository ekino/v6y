import { FaqInputType, SearchQueryType } from '@v6y/commons';
declare const FaqMutations: {
    createOrEditFaq: (_: unknown, params: {
        faqInput: FaqInputType;
    }) => Promise<import("@v6y/commons/src/database/models/FaqModel.ts").FaqModelType | {
        _id: number;
    } | null>;
    deleteFaq: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: number;
    } | null>;
};
export default FaqMutations;
