import { inject, Component, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxDynamic } from './ngx-dynamic.component';
import { NavbarComponent } from './navbar.component';
@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <ngx-dynamic
      [content]="content"
      [componentData]="componentData"
    ></ngx-dynamic>
  `,
  imports: [NgxDynamic],
})
export class HomeComponent {
  content = `<p>Hello, this is Home and navbar:</p> <app-navbar></app-nabar>`;
  platform = inject(PLATFORM_ID);
  componentData = {
    component: NavbarComponent,
    selector: 'app-navbar',
  };
}
