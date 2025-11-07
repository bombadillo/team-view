import { Component, signal } from '@angular/core';
import { AppMenu } from './components/menu/Menu';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [RouterModule, AppMenu],
})
export class App {
    protected readonly title = signal('team-view2');
}
