import { App, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import MovieBuddyPlugin from "./main";

export interface MovieBuddyPluginSettings {
    tmdbAccessToken?: string;
}

export class MovieBuddySettingTab extends PluginSettingTab {
    plugin: MovieBuddyPlugin;

    constructor(app: App, plugin: MovieBuddyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {}

    getSettingDefinitions() {
        return [
            {
                desc: "See https://developer.themoviedb.org/docs/authentication-application",
                name: "TMDB Access Token",
                render: (setting: Setting) => {
                    setting.addComponent((el: HTMLElement) => {
                        return new SecretComponent(this.app, el)
                            .setValue(this.plugin.settings!.tmdbAccessToken || "")
                            .onChange(async (value) => {
                                this.plugin.settings!.tmdbAccessToken = value;
                                await this.plugin.saveSettings();
                            });
                    });
                },
            },
        ];
    }
}
