# Movie Buddy

An Obsidian plugin for creating and managing movie notes backed by TMDB data.

> This repository, plugin, etc. are for intended personal use ONLY and as such are provided AS-IS. Use at your own risk.

> This project is NOT affiliated with TMDB or any other related entities.

## Requirements

In order to use this plugin, you will need a TMDB access token. See https://developer.themoviedb.org for instructions on how to get set up.

## What It Does

This plugin allows you to search for a movie by name, returning a list of results that match from the TMDB API. Once the desired movie is selected, the plugin downloads the movie poster and creates a note for the movie with standard frontmatter and content. Notes and posters are stored in predetermined locations (`/movies/` and `/attachments/` respectively).

The plugin also registers a command to create a Base with some useful views onto the movie notes.
