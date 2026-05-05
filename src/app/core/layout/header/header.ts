import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme/theme';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  public layout = inject(LayoutService); // فقط سرویس رو اضافه کن
}
