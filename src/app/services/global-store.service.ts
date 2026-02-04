import { Injectable, signal, Signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalStore {
    private _refreshTrigger = signal<number>(0);

    readonly refreshTrigger: Signal<number> = this._refreshTrigger;

    triggerRefresh() {
        this._refreshTrigger.update(n => n + 1);
    }
}
