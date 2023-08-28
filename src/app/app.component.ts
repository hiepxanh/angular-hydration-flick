import { inject, Component, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { NgxDynamic } from './ngx-dynamic.component';

@Component({
  selector: 'app-root',
  template: `<h1>Welcome to dynamic</h1>
    <ngx-dynamic
      [content]="content"
      [componentData]="componentData"
    ></ngx-dynamic>`,
  standalone: true,
  imports: [NgxDynamic]
})
export class AppComponent {
  content = `html from server: <app-home></app-home>`;
  componentData = {
    component: HomeComponent,
    selector: 'app-home',
  };
  domSanitizer = inject(DomSanitizer);
  // The bypassSecurityTrustHtml would return a new object each time it's invoked, store a reference to the function call result
  sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.content);
}
