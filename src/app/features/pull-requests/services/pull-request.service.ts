import { Inject, Injectable } from '@angular/core';
import { mockPullRequests } from '../mock/pull-requests';
import { PullRequestStore } from './pull-request-store.service';
import { PullRequestPortFactoryService } from './ports/pull-request-port-factory.service';

@Injectable({ providedIn: 'root' })
export class PullRequestService {
    constructor(
        private store: PullRequestStore,
        @Inject('MOCK_DATA') private mockData: boolean,
        private pullRequestPortFactory: PullRequestPortFactoryService,
    ) {}

    sendingRequest: boolean = false;

    async fetchPullRequests(force: boolean = false): Promise<boolean> {
        if (this.sendingRequest) {
            console.log('delaying request as existing one open');

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.fetchPullRequests());
                }, 500);
            });
        }

        if (this.store.pullRequests().length && !force) {
            console.log('using cached pullRequests');
            return new Promise((resolve) => resolve(true));
        }

        console.log('fetching pull requests from server');

        console.log(this.mockData);

        if (this.mockData) {
            // random delay between 300ms and 2000ms to better mimic network latency
            const min = 300;
            const max = 2000;
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            return new Promise((resolve) => {
                setTimeout(() => {
                    // populate central store when tickets are "loaded"
                    const randomCount =
                        Math.floor(Math.random() * (mockPullRequests.length - 40 + 1)) + 40;
                    const shuffled = [...mockPullRequests].sort(() => Math.random() - 0.5);
                    const randomSubset = shuffled.slice(0, randomCount);
                    console.log(randomSubset);
                    this.store.setPullRequests(randomSubset);
                    this.sendingRequest = false;
                    resolve(true);
                }, delay);
            });
        }

        const pullRequestPort = await this.pullRequestPortFactory.getPort();
        const pullRequestTickets = await pullRequestPort.getPullRequests();

        this.store.setPullRequests(pullRequestTickets);
        this.sendingRequest = false;

        return true;
    }
}
