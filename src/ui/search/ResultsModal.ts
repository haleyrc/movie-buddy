import { SearchResult } from "@/tmdb";
import { App, SuggestModal } from "obsidian";

export class ResultsModal extends SuggestModal<SearchResult> {
    constructor(app: App, private results: SearchResult[], private onPick: (result: SearchResult) => void) {
        super(app);

        const inputContainer = this.inputEl.parentElement;
        (inputContainer ?? this.inputEl).hide();

        this.results.sort((a, b) => b.vote_average * b.vote_count - a.vote_average * a.vote_count);
    }

    getSuggestions(input: string) {
        return this.results;
    }

    onChooseSuggestion(result: SearchResult) {
        this.onPick(result);
    }

    renderSuggestion(result: SearchResult, el: HTMLElement) {
        el.addClass("movie-search-result");

        if (result.poster_path) {
            el.createEl("img", {
                attr: {
                    loading: "lazy",
                    src: `https://image.tmdb.org/t/p/w1280${result.poster_path}`,
                },
                cls: "movie-thumbnail",
            });
        } else {
            el.createDiv({ cls: "movie-thumbnail-placeholder" });
        }

        const text = el.createDiv();
        text.createDiv({ text: result.title });
        text.createEl("small", { text: result.overview });
    }
}
