import { Injectable, signal, Signal } from '@angular/core';
import { Filter } from '../models/Filter';

@Injectable({ providedIn: 'root' })
export class FilterStore {
    private _filters = signal<Filter>({ time: 'week' });

    readonly filters: Signal<Filter> = this._filters;

    setTimeFilter(timeType: string) {
        const time = timeType === 'week' ? this.getTimeFormat(7) : this.getTimeFormat(30);

        console.log(time)

        // why a promise?
        Promise.resolve().then(() => {
            this.addFilter({ time });
        });
    }

    addFilter(filter: Filter) {
        this._filters.update((curr) => ({ ...curr, filter }));
    }

    clear() {
        this._filters.set({ time: 'week' });
    }

    getTimeFormat(numberOfDaysInPast: number) {
        const date = new Date();
        date.setDate(date.getDate() - numberOfDaysInPast);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(date.getDate()).padStart(2, '0');

        const formatted = `${yyyy}${mm}${dd}`;
        return formatted;
    }
}
