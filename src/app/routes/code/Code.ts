import { Component, signal, Signal } from "@angular/core";
import { AppRepositoryList } from "../../features/repositories/repository-list/RepositoryList";
import { Repository } from "../../features/repositories/models/Repository";
import { RepositoryService } from "../../features/repositories/services/repository.service";
import { RepositoryStore } from "../../features/repositories/services/repository-store.service";

@Component({
    selector: 'app-code',
    templateUrl: './code.html',
    imports: [AppRepositoryList]
})
export class AppCode {
    protected repositories!: Signal<Repository[]>;

    loading = signal<boolean>(true);

    constructor(private repositoryService: RepositoryService, private repositoryStore: RepositoryStore) {
        this.repositories = this.repositoryStore.repositories;

        this.repositoryService.fetchRepositories().then(() => {
            this.loading.set(false);
        });
    }
}
