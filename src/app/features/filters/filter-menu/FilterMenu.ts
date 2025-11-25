import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { FilterStore } from '../services/filter-store.service';

@Component({
    selector: 'app-filter-menu',
    templateUrl: './filter-menu.html',
    imports: [SelectButton, FormsModule],
})
export class FilterMenu {
    @Output() filterUpdated = new EventEmitter<string>();

    timeFilterStateOptions: any[] = [
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
    ];

    timeFilter: string = 'week';

    constructor(private filterStore: FilterStore) {}

    timeFilterChanged() {
        this.filterStore.setTimeFilter(this.timeFilter);
        // this.filterUpdated.emit();
    }
}
