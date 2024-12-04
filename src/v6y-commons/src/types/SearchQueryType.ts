export interface SearchQueryType {
    searchText?: string;
    keywords?: string[];
    offset?: number;
    start?: number;
    limit?: number;
    where?: { _id: number; id?: string };
    sort?: string | string[];
}
