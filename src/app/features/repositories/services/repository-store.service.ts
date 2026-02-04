import { Injectable, signal, Signal } from '@angular/core';
import { Repository } from '../models/Repository';

@Injectable({ providedIn: 'root' })
export class RepositoryStore {
    private _repositories = signal<Repository[]>([]);
    private _repositoryScanningProgress = signal<number>(0);

    readonly repositories: Signal<Repository[]> = this._repositories;
    readonly repositoryScanningProgress: Signal<number> = this._repositoryScanningProgress;

    setRepositories(repositories: Repository[]) {
        this._repositories.set(repositories);
    }

    setRepositoryScanningProgress(repositoryScanningProgress: number) {
        this._repositoryScanningProgress.set(repositoryScanningProgress);
    }

    clear() {
        this._repositories.set([]);
    }
}
