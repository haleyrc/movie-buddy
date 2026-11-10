import { stringifyYaml } from "obsidian";
import Mustache from "mustache";
import movieTemplate from "./templates/movie.md";
import { CrewMember, GetCreditsResponse, GetMovieResponse, GetMovieResponseGenre } from "@/tmdb";

export function renderMovie(movie: GetMovieResponse, credits: GetCreditsResponse): string {
    const frontmatter = stringifyYaml({
        collection: movie.belongs_to_collection ? `[[${movie.belongs_to_collection.name}]]` : undefined,
        favorite: false,
        genres: movie.genres.map((g) => `[[${g.name}]]`),
        imdb_id: movie.imdb_id,
        poster: `[[${movie.id}_poster.jpg]]`,
        synopsis: movie.overview,
        tags: [],
        tagline: movie.tagline,
        title: movie.title,
        tmdb_id: movie.id,
        version: 1,
    });

    const body = Mustache.render(
        movieTemplate,
        {
            ...movie,
            cast: credits.cast,
            crew: credits.crew.filter((member: CrewMember) => !["Director", "Writer"].includes(member.job)),
            directors: credits.crew.filter((member: CrewMember) => member.job === "Director"),
            writers: credits.crew.filter((member: CrewMember) => member.job === "Writer"),
            genres: movie.genres.map((genre: GetMovieResponseGenre) => genre.name).join(" • "),
        },
        {},
        { escape: (value) => String(value) },
    );

    return `---\n${frontmatter}---\n\n${body}`;
}
