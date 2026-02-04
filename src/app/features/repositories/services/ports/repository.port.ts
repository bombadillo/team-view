import { Repository } from "../../models/Repository";

export interface RepositoryPort {
    getRepositories(force: boolean): Promise<Repository[] | null>;
}