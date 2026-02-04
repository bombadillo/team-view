import { mockRepositoryFiles } from '../mock/repository-files';
import { mockRepositoryFileContents } from '../mock/repository-file-contents';
import { RepositoryFile } from '../models/RepositoryFile';
import { effect, Inject, Injectable, signal } from '@angular/core';
import { mockRepositories } from '../mock/repositories';
import { RepositoryPortFactoryService } from './ports/repository-port-factory.service';
import { RepositoryStore } from './repository-store.service';
import { RepositoryFilesPortFactoryService } from './ports/repository-files-port-factory.service';
import { Repository } from '../models/Repository';
import { RepositoryFileContentsPortFactoryService } from './ports/repository-file-content-factory.service';

import * as yaml from 'js-yaml';
import { GlobalStore } from '../../../services/global-store.service';

@Injectable({ providedIn: 'root' })
export class RepositoryService {
    initiatedRepositoryFileRetrieval = signal<boolean>(false);

    forceCache = signal<boolean>(false);

    constructor(
        private store: RepositoryStore,
        @Inject('MOCK_DATA') private mockData: boolean,
        private repositoryPortFactory: RepositoryPortFactoryService,
        private repositoryFilesPortFactory: RepositoryFilesPortFactoryService,
        private repositoryFileContentsPortFactory: RepositoryFileContentsPortFactoryService,
        private globalStore: GlobalStore,
    ) {
        effect(async () => {
            if (!this.store.repositories().length || this.initiatedRepositoryFileRetrieval())
                return;

            console.log('fetching repository files');
            this.initiatedRepositoryFileRetrieval.set(true);
            // clone without reference
            let repos = this.store.repositories().map((r) => ({ ...r }));
            const total = repos.length;

            for (const repository of repos) {
                const repoOwners = await this.SetRepositoryOwners(repository);
                repository.owners = repoOwners;
            }

            // Update repository in store with detected dotnet versions

            this.store.setRepositories(repos);

            repos = this.store.repositories().map((r) => ({ ...r }));

            for (const [index, repository] of repos.entries()) {
                const repoDotnetVersions = await this.SetDotnetVersions(repository);
                repository.dotnetVersions = repoDotnetVersions;

                // index + 1 ensures that when the first one finishes, you are at a positive %
                const progress = Math.round(((index + 1) / total) * 100);

                this.store.setRepositoryScanningProgress(progress);
                console.log(`Progress: ${progress}%`);
            }

            this.store.setRepositories(repos);
            console.log(repos);
        });

        effect(() => {
            if (globalStore.refreshTrigger() > 0) {
                console.log('blooter the cache');
                this.forceCache.set(true);
                this.fetchRepositories();
            }
        });
    }

    sendingRequest: boolean = false;

    async fetchRepositories(force: boolean = false): Promise<boolean> {
        if (this.sendingRequest) {
            console.log('delaying request as existing one open');

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.fetchRepositories());
                }, 500);
            });
        }

        if (this.mockData) {
            // random delay between 300ms and 2000ms to better mimic network latency
            const min = 300;
            const max = 2000;
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            return new Promise((resolve) => {
                setTimeout(() => {
                    // populate central store when tickets are "loaded"
                    const randomCount =
                        Math.floor(Math.random() * (mockRepositories.length - 40 + 1)) + 40;
                    const shuffled = [...mockRepositories].sort(() => Math.random() - 0.5);
                    const randomSubset = shuffled.slice(0, randomCount);
                    this.store.setRepositories(randomSubset);
                    this.sendingRequest = false;
                    resolve(true);
                }, delay);
            });
        }

        const repositoryPort = await this.repositoryPortFactory.getPort();
        const repositoryTickets = await repositoryPort.getRepositories(force);

        if (repositoryTickets) this.store.setRepositories(repositoryTickets);

        this.sendingRequest = false;

        this.initiatedRepositoryFileRetrieval.set(false);

        return true;
    }

    async SetDotnetVersions(repository: Repository) {
        let cachedDotnetVersions: any = localStorage.getItem('repository-versions') ?? '{}';
        cachedDotnetVersions = JSON.parse(cachedDotnetVersions);
        let dotnetVersions: any;
        console.log(cachedDotnetVersions);
        console.log(cachedDotnetVersions[repository.id]);

        const preventCache = false;

        if (!preventCache && cachedDotnetVersions[repository.id] && !this.forceCache()) {
            console.log('use cached dotnet version');
            dotnetVersions = cachedDotnetVersions[repository.id].dotnet;
            console.log(dotnetVersions);
        } else {
            // return;
            const repositoryFiles = await this.fetchRepositoryFiles(repository);

            cachedDotnetVersions[repository.id] = {};

            const csprojMatches = this.getFileMatches('csproj', repositoryFiles, repository);

            const csprojContent = await this.getRepositoryFileContentForAllProjects(
                repository,
                csprojMatches,
            );

            const dotnetVersionsMap = await this.getDotnetVersions(csprojContent);
            dotnetVersions = dotnetVersionsMap;

            console.log('dotnetVersions', dotnetVersions);
            cachedDotnetVersions[repository.id].dotnet = dotnetVersions;

            localStorage.setItem('repository-versions', JSON.stringify(cachedDotnetVersions));
            console.log(JSON.stringify(cachedDotnetVersions));
        }

        console.log('detected dotnet versions:', dotnetVersions);

        return dotnetVersions;

        // Update repository in store with detected dotnet versions
        // const current = this.store.repositories();
        // const updated = current.map((r) => {
        //     if (r.id === repository.id) {
        //         console.log(repository.name)
        //         const dotnetVersionsList = dotnetVersions;

        //         console.log(dotnetVersionsList)

        //         if (!dotnetVersionsList) return r;

        //         console.log(`updating repository ${repository.id} with ${dotnetVersionsList}`);

        //         return { ...r, dotnetVersions: dotnetVersionsList || [] };
        //     }

        //     return r;
        // });

        // this.store.setRepositories(updated);
    }

    async SetRepositoryOwners(repository: Repository): Promise<string[]> {
        let cachedRepoOwners: any = localStorage.getItem('repository-owners') ?? '{}';
        cachedRepoOwners = JSON.parse(cachedRepoOwners);

        let repoOwners: string[];

        // console.log('force cache', this.forceCache());
        // console.log('cached entry', cachedRepoOwners[repository.id].length)
        // console.log(cachedRepoOwners[repository.id].length && !this.forceCache())

        if (repository.id in cachedRepoOwners && !this.forceCache()) {
            console.log('using cached repo owner');
            repoOwners = cachedRepoOwners[repository.id];
        } else {
            console.log('fetching repo owner for repo', repository.id);

            console.log('cached entry missing', cachedRepoOwners[repository.id]);

            const repositoryFiles = await this.fetchRepositoryFiles(repository);
            const catalogMatches = this.getFileMatches(
                'catalog-info.yaml',
                repositoryFiles,
                repository,
            );

            const catalogContent = await this.getRepositoryFileContentForAllProjects(
                repository,
                catalogMatches,
            );

            repoOwners = await this.getRepoOwners(catalogContent);

            cachedRepoOwners[repository.id] = repoOwners;

            localStorage.setItem('repository-owners', JSON.stringify(cachedRepoOwners));
        }

        return repoOwners;
    }

    getFileMatches(
        filePattern: string,
        repositoryFiles: RepositoryFile[],
        repository: Repository,
    ): string[] {
        // Now returns a simple array of strings
        const pattern = filePattern.toLowerCase();

        // Filter the files and map them to their path strings immediately
        const matchedPaths = (repositoryFiles || [])
            .filter((f) => typeof f.path === 'string' && f.path.toLowerCase().includes(pattern))
            .map((f) => f.path);

        if (matchedPaths.length > 0) {
            console.log(
                `Found ${matchedPaths.length} ${filePattern} file(s) in repository ${repository.id}:`,
                matchedPaths,
            );
        } else {
            console.log(`No ${filePattern} files found in repository ${repository.id}`);
        }

        return matchedPaths;
    }

    // getFileMatches(
    //     filePattern: string,
    //     repositoryFiles: RepositoryFile[],
    //     repository: Repository,
    // ): Map<string, string[]> {
    //     const fileMatches = (repositoryFiles || []).filter(
    //         (f) => typeof f.path === 'string' && f.path.toLowerCase().includes(filePattern),
    //     );

    //     const filesPerRepo = new Map<string, string[]>();

    //     if (fileMatches.length) {
    //         console.log(
    //             `Found ${fileMatches.length} ${filePattern} file(s) in repository ${repository.id}:`,
    //             fileMatches,
    //         );
    //         filesPerRepo.set(
    //             repository.id,
    //             fileMatches.map((match) => match.path),
    //         );
    //     } else {
    //         console.log(`No ${filePattern} files found in repository ${repository.id}`);
    //     }

    //     return filesPerRepo;
    // }

    async getDotnetVersions(
        csprojContents: string[], // Changed from Map to a simple string array
        force: boolean = false,
    ): Promise<string[]> {
        // Returns just the versions
        const detected = new Set<string>(); // Using a Set automatically handles uniqueness

        if (!csprojContents || !csprojContents.length) {
            return [];
        }

        for (const content of csprojContents) {
            if (!content || typeof content !== 'string') continue;

            // Try TargetFrameworks (plural) first, then TargetFramework
            const tfMatch = content.match(/<TargetFrameworks?>([^<]+)<\/TargetFrameworks?>/i);

            if (tfMatch && tfMatch[1]) {
                // split multiple frameworks by ';' and trim
                const parts = tfMatch[1]
                    .split(';')
                    .map((p) => p.trim())
                    .filter(Boolean);

                for (const p of parts) {
                    detected.add(p);
                }
                continue;
            }

            // Fallback: try to find netX.Y inside content
            const fallback = content.match(/net\d+(?:\.\d+)?/gi);
            if (fallback) {
                for (const f of fallback) {
                    detected.add(f);
                }
            }
        }

        // Convert Set back to a sorted Array
        return Array.from(detected).sort();
    }

    // async getDotnetVersions(
    //     csprojContentsByRepo: Map<string, string[]>,
    //     force: boolean = false,
    // ): Promise<Map<string, string[]>> {
    //     // Result: map repoId -> array of detected target frameworks (e.g., net8.0)
    //     const versionsByRepo = new Map<string, string[]>();

    //     for (const [repoId, contents] of csprojContentsByRepo.entries()) {
    //         const detected: string[] = [];
    //         if (!contents || !contents.length) {
    //             versionsByRepo.set(repoId, detected);
    //             continue;
    //         }

    //         for (const content of contents) {
    //             if (!content || typeof content !== 'string') continue;

    //             // Try TargetFrameworks (plural) first, then TargetFramework
    //             const tfMatch = content.match(/<TargetFrameworks?>([^<]+)<\/TargetFrameworks?>/i);
    //             if (tfMatch && tfMatch[1]) {
    //                 // split multiple frameworks by ';' and trim
    //                 const parts = tfMatch[1]
    //                     .split(';')
    //                     .map((p) => p.trim())
    //                     .filter(Boolean);
    //                 for (const p of parts) {
    //                     if (!detected.includes(p)) detected.push(p);
    //                 }
    //                 continue;
    //             }

    //             // Fallback: try to find netX.Y inside content
    //             const fallback = content.match(/net\d+(?:\.\d+)?/gi);
    //             if (fallback) {
    //                 for (const f of fallback) {
    //                     if (!detected.includes(f)) detected.push(f);
    //                 }
    //             }
    //         }

    //         versionsByRepo.set(repoId, detected);
    //     }

    //     return versionsByRepo;
    // }

    getRepoOwners(catalogInfoByRepo: string[], force: boolean = false): string[] {
        // Result: map repoId -> array of detected owners (e.g., group:default/integrationteam)
        const owners: string[] = [];

        for (const [repoId, contents] of catalogInfoByRepo) {
            console.log('scanning repo', repoId);

            for (const content of contents) {
                const docs = yaml.loadAll(content) as any[];

                // Extract owners
                const uniqueOwners = [...new Set(docs.map((d) => d?.spec?.owner).filter(Boolean))];

                if (!owners.includes(uniqueOwners[0])) owners.push(uniqueOwners[0]);
            }
        }
        return owners;
    }

    async fetchRepositoryFiles(
        repository: Repository,
        force: boolean = false,
    ): Promise<RepositoryFile[]> {
        // Simulate network delay for mock data
        if (this.mockData) {
            const min = 300;
            const max = 2000;
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Shuffle and return a random subset of files
                    const randomCount =
                        Math.floor(Math.random() * (mockRepositoryFiles.length - 10 + 1)) + 10;
                    const shuffled = [...mockRepositoryFiles].sort(() => Math.random() - 0.5);
                    const randomSubset = shuffled.slice(0, randomCount);
                    resolve(randomSubset);
                }, delay);
            });
        }
        // In a real implementation, fetch from API or port

        const repositoryFilesPort = await this.repositoryFilesPortFactory.getPort();
        const repositoryFiles = await repositoryFilesPort.getRepositoryFiles(repository.id, force);
        return repositoryFiles ?? [];
    }

    // TODO: Could potentially split this off to a different serivce that can fetch the content for all repositories
    async getRepositoryFileContentForAllProjects(
        repository: Repository,
        filePaths: string[], // Changed from Map to a simple array of paths
    ): Promise<string[]> {
        if (!filePaths || !filePaths.length) {
            return [];
        }

        // Use Promise.all to fetch all files in parallel
        const contentPromises = filePaths.map(async (path) => {
            try {
                return await this.getRepositoryFileContent(repository, path);
            } catch (err) {
                console.error(`Error fetching content for ${path} in repo ${repository.id}:`, err);
                return null; // Return null so we can filter out failures
            }
        });

        const results = await Promise.all(contentPromises);

        // Filter out nulls (failed fetches) and return the string array
        return results.filter((content): content is string => content !== null);
    }

    // async getRepositoryFileContentForAllProjects(
    //     repository: Repository,
    //     fileMatches: Map<string, string[]>,
    // ) {
    //     const contentsByRepo = new Map<string, string[]>();

    //     for (const [repoId, paths] of fileMatches.entries()) {
    //         const contents: string[] = [];
    //         if (!paths || !paths.length) {
    //             contentsByRepo.set(repoId, contents);
    //             continue;
    //         }

    //         for (const path of paths) {
    //             try {
    //                 const content = await this.getRepositoryFileContent(repository, path);
    //                 contents.push(content);
    //             } catch (err) {
    //                 console.error(`Error fetching content for ${path} in repo ${repoId}:`, err);
    //             }
    //         }

    //         contentsByRepo.set(repoId, contents);
    //     }

    //     return contentsByRepo;
    // }

    async getRepositoryFileContent(
        repository: Repository,
        path: string,
        force: boolean = false,
    ): Promise<string> {
        // Simulate network delay for mock data
        if (this.mockData) {
            const min = 300;
            const max = 2000;
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Shuffle and return a random instance
                    const shuffled = [...mockRepositoryFileContents].sort(
                        () => Math.random() - 0.5,
                    );
                    const randomSubset = shuffled.slice(0, 1);
                    resolve(randomSubset[0]);
                }, delay);
            });
        }

        const repositoryFileContentsPort = await this.repositoryFileContentsPortFactory.getPort();
        const repositoryFileContents = await repositoryFileContentsPort.getRepositoryFileContents(
            repository.id,
            path,
            force,
        );

        return repositoryFileContents;
    }
}
