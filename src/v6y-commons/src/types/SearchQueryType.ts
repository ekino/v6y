export interface SearchQueryType {
    searchText?: string;
    keywords?: string[];
    offset?: number;
    start?: number;
    limit?: number;
    where?: object;
    sort?: string;
}
