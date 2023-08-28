import { inject, Component, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <div [style]="style">
      <p>navbar should be: {{ platform }}</p>
      {{ style }}
    </div>
  `,
})
export class NavbarComponent {
  platform = inject(PLATFORM_ID);
  style =
    'height: 200px; background:' +
    (isPlatformBrowser(this.platform) ? 'red' : 'green');
}
