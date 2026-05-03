import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header'; // <-- این خط اضافه شود
import { SidebarComponent } from './core/layout/sidebar/sidebar';
import { LeftSidebar } from './core/layout/left-sidebar/left-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, LeftSidebar],
  templateUrl: './app.html',
})
export class App {
  title = 'wtt-frontend';
}
