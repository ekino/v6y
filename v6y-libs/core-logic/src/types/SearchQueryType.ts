export interface SearchQueryType {
    searchText?: string;
    keywords?: string[];
    offset?: number;
    start?: number;
    limit?: number;
    id?: string;
    where?: { _id: number; id?: string };
    sort?: string | string[];
}
