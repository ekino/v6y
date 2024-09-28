declare const FaqResolvers: {
    Query: {
        getFaqListByPageAndParams: (_: unknown, args: import("@v6y/commons").SearchQueryType) => Promise<import("@v6y/commons/src/database/models/FaqModel.ts").FaqModelType[]>;
        getFaqDetailsByParams: (_: unknown, args: import("@v6y/commons").FaqType) => Promise<import("@v6y/commons").FaqType | null>;
    };
    Mutation: {
        createOrEditFaq: (_: unknown, params: {
            faqInput: import("@v6y/commons").FaqInputType;
        }) => Promise<import("@v6y/commons/src/database/models/FaqModel.ts").FaqModelType | {
            _id: number;
        } | null>;
        deleteFaq: (_: unknown, params: {
            input: import("@v6y/commons").SearchQueryType;
        }) => Promise<{
            _id: number;
        } | null>;
    };
};
export default FaqResolvers;
