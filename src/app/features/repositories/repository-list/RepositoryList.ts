import { Component, computed, effect, signal, Signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RepositoryStore } from '../services/repository-store.service';
import { Repository } from '../models/Repository';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-repository-list',
    templateUrl: './repository-list.html',
    imports: [ButtonModule, CardModule, SelectModule, FormsModule, ProgressBarModule],
})
export class AppRepositoryList {
    protected repositories!: Signal<Repository[]>;
    protected repositoryScanningProgress: Signal<number>;
    // protected filteredRepositories = signal<Repository[]>([]);
    // protected owners = signal<OwnerOption[]>([]);

    protected owners = computed<OwnerOption[]>(() => {
        const defaultOptions = [
            { name: 'All', code: 'All' },
            { name: 'Missing owner', code: 'Missing owner' },
        ];
        const ownersArr = [...new Set(this.repositories().flatMap((repository) => repository.owners))]
            .filter((owner) => owner && owner.trim() !== '')
            .sort((a, b) => a!.localeCompare(b!))
            .map((owner) => ({ name: owner!, code: owner! }));

        return ([
            ...defaultOptions,
            ...ownersArr,
        ] as OwnerOption[]);
    });

    protected selectedOwner = signal<OwnerOption | undefined>(undefined);    

    protected filteredRepositories = computed<Repository[] | []>(() => {
        const sel = this.selectedOwner();
        if (!sel) return [];
        if (sel.code === 'All') return [];
        if (sel.code === 'Missing owner') {
            return this.repositories().filter((x) => x.owners === undefined || x.owners?.length === 0);
        }
        return this.repositories().filter((x) => x.owners?.includes(sel.code));
    });    

    constructor(private repositoryStore: RepositoryStore) {
        this.repositories = this.repositoryStore.repositories;
        this.repositoryScanningProgress = this.repositoryStore.repositoryScanningProgress;

        // effect(() => {
        //     this.owners.set(this.getAllOwners());
        // });

        // effect(() => {

        //     if (!this.selectedOwner()) return;

        //     if (this.selectedOwner()?.code === 'Missing owner') this.filterByMissingOwner();
        //     else if (this.selectedOwner()?.code === 'All') this.filteredRepositories.set([]);
        //     else this.filterByOwner(this.selectedOwner()!);
        // });
    }

    // getAllOwners(): OwnerOption[] {
    //     const defaultOptions = [
    //         { name: 'All', code: 'All' },
    //         { name: 'Missing owner', code: 'Missing owner' },
    //     ];
    //     let owners = [...new Set(this.repositories().flatMap((repository) => repository.owners))]
    //         .filter((owner) => owner && owner.trim() !== '')
    //         .sort((a, b) => a!.localeCompare(b!))
    //         .map((owner) => ({ name: owner, code: owner }));

    //     let combinedOwners = [...defaultOptions, ...owners];

    //     return (combinedOwners as OwnerOption[]) ?? [];
    // }

    // filterByOwner(owner: OwnerOption) {
    //     this.filteredRepositories.set(
    //         this.repositories().filter((x) => x.owners?.includes(owner.code)),
    //     );
    // }

    // filterByMissingOwner() {
    //     this.filteredRepositories.set(
    //         this.repositories().filter((x) => x.owners === undefined || x.owners?.length === 0),
    //     );
    // }

    getRepositoriesToRender(): Repository[] {
        return this.filteredRepositories().length
            ? this.filteredRepositories()
            : this.repositories();
    }

    onOwnerChange(owner: OwnerOption) {
        this.selectedOwner.set(owner);
    }
}

interface OwnerOption {
    name: string;
    code: string;
}
