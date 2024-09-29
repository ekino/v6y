import { ApplicationInputType, SearchQueryType } from '@v6y/commons';
declare const ApplicationMutations: {
    createOrEditApplication: (_: unknown, params: {
        applicationInput: ApplicationInputType;
    }) => Promise<{
        _id: number;
    } | null>;
    deleteApplication: (_: unknown, params: {
        input: SearchQueryType;
    }) => Promise<{
        _id: string;
    } | null>;
};
export default ApplicationMutations;
