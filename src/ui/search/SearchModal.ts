import { App, Modal, Setting } from "obsidian";

export class SearchModal extends Modal {
    private query = "";

    constructor(app: App, onSubmit: (query: string) => void) {
        super(app);
        this.setTitle("Search");
        let query = "";

        new Setting(this.contentEl).setName("Title").addText((text) => {
            text.onChange((value) => (query = value));
        });

        new Setting(this.contentEl).addButton((btn) => {
            btn.setButtonText("Submit")
                .setCta()
                .onClick(() => {
                    this.close();
                    onSubmit(query.trim());
                });
        });

        this.scope.register([], "Enter", (evt) => {
            evt.preventDefault();
            this.close();
            onSubmit(query.trim());
        });
    }
}
