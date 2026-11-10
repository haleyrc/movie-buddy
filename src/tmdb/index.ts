import { requestUrl } from "obsidian";

const API_URL = "https://api.themoviedb.org/3";
export const IMAGE_URL = "https://image.tmdb.org/t/p/w1280";

export interface CastMember {
    character: string;
    id: number;
    name: string;
}

export interface CrewMember {
    id: number;
    job: string;
    name: string;
}

export interface GetCreditsResponse {
    cast: CastMember[];
    crew: CrewMember[];
}

export interface GetMovieResponse {
    belongs_to_collection?: GetMovieResponseCollection;
    genres: GetMovieResponseGenre[];
    id: number;
    imdb_id: string;
    overview: string;
    poster_path: string;
    tagline: string;
    title: string;
}

export interface GetMovieResponseCollection {
    name: string;
}

export interface GetMovieResponseGenre {
    name: string;
}

export interface SearchResponse {
    results: SearchResult[];
}

export interface SearchResult {
    id: number;
    overview: string;
    popularity: number;
    poster_path: string;
    title: string;
    vote_average: number;
    vote_count: number;
}

export class TMDBClient {
    constructor(private getAccessToken: () => string | undefined) {}

    async getCredits(id: number): Promise<GetCreditsResponse> {
        return this.makeRequest<GetCreditsResponse>(`${API_URL}/movie/${id}/credits`);
    }

    async getMovie(id: number): Promise<GetMovieResponse> {
        return this.makeRequest<GetMovieResponse>(`${API_URL}/movie/${id}`);
    }

    async search(query: string): Promise<SearchResponse> {
        let url = new URL(`${API_URL}/search/movie`);
        let params = new URLSearchParams(url.search);
        params.append("query", query);
        params.append("language", "en-US");
        url.search = params.toString();
        return this.makeRequest<SearchResponse>(url.toString());
    }

    private async makeRequest<T>(url: string): Promise<T> {
        const accessToken = this.getAccessToken();
        if (!accessToken || accessToken === "") {
            throw new Error("Access token missing or invalid");
        }
        return requestUrl({
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "GET",
            url: url,
        }).json as T;
    }
}
