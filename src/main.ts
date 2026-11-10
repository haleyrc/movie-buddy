import { normalizePath, requestUrl, Notice, Plugin } from "obsidian";
import { MovieBuddyPluginSettings, MovieBuddySettingTab } from "./settings";
import { IMAGE_URL, GetMovieResponse, SearchResponse, SearchResult, TMDBClient } from "@/tmdb";
import { ResultsModal, SearchModal } from "@/ui/search";
import { renderMovie } from "@/render";
import allMoviesBase from "@/render/templates/allmovies.base";

export default class MovieBuddyPlugin extends Plugin {
    tmdbc: TMDBClient;
    settings: MovieBuddyPluginSettings;

    async onload() {
        await this.loadSettings();
        this.tmdbc = new TMDBClient(() => this.app.secretStorage.getSecret(this.settings.tmdbAccessToken));
        this.addSettingTab(new MovieBuddySettingTab(this.app, this));
        this.addCommand({
            id: "add-movie",
            name: "Add movie",
            callback: () => {
                const searchModal = new SearchModal(this.app, (query: string) => {
                    void this.runSearch(query);
                });
                searchModal.open();
            },
        });
        this.addCommand({
            id: "create-base",
            name: 'Create "All Movies" base',
            callback: () => {
                this.createBase();
            },
        });
    }

    private async runSearch(query: string) {
        let resp: SearchResponse;
        try {
            resp = await this.tmdbc.search(query);
        } catch (e) {
            console.error(e);
            new Notice("Search failed. See console for details.");
            return;
        }

        if (resp.results.length === 0) {
            new Notice("No results");
            return;
        }

        const resultsModal = new ResultsModal(this.app, resp.results, (r) => {
            this.processResult(r).catch((e) => console.error(r));
        });
        resultsModal.open();
    }

    private async processResult(result: SearchResult) {
        try {
            const movie = await this.tmdbc.getMovie(result.id);
            const credits = await this.tmdbc.getCredits(result.id);
            await this.downloadPoster(movie);

            const content = renderMovie(movie, credits);

            const folder = normalizePath("movies");
            if (!this.app.vault.getAbstractFileByPath(folder)) {
                await this.app.vault.createFolder(folder);
            }

            const path = normalizePath(`${folder}/${result.id}.md`);

            // If the file already exists, just leave it as-is and open it for
            // the user.
            const existing = this.app.vault.getFileByPath(path);
            if (existing) {
                new Notice("Movie already exists.");
                await this.app.workspace.getLeaf(false).openFile(existing);
                return;
            }

            const file = await this.app.vault.create(path, content);
            await this.app.workspace.getLeaf(false).openFile(file);
        } catch (e) {
            console.error(e);
            new Notice("Request failed. See console for details.");
        }
    }

    private createBase() {
        const path = normalizePath("All Movies.base");
        this.app.vault.create(path, allMoviesBase).catch((e) => {
            console.error(e);
            new Notice("Save failed. See console for details.");
        });
    }

    private async downloadPoster(movie: GetMovieResponse) {
        const folder = normalizePath("attachments");
        if (!this.app.vault.getAbstractFileByPath(folder)) {
            await this.app.vault.createFolder(folder);
        }

        const resp = await requestUrl({ url: `${IMAGE_URL}${movie.poster_path}` });
        const path = normalizePath(`${folder}/${movie.id}_poster.jpg`);

        if (this.app.vault.getFileByPath(path)) {
            return;
        }

        return this.app.vault.createBinary(path, resp.arrayBuffer);
    }

    async loadSettings() {
        this.settings = Object.assign({}, (await this.loadData()) as Partial<MovieBuddyPluginSettings>);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
