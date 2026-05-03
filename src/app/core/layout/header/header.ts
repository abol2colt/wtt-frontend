import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme/theme';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
