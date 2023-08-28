import { inject, Component, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <div [style]="'height: 200px;' + style">
      <p>navbar should be: {{ platform }}</p>
    </div>
  `,
})
export class NavbarComponent {
  platform = inject(PLATFORM_ID);
  style = 'background:' + (isPlatformBrowser(this.platform) ? 'red' : 'green');
}

@Component({
  selector: 'app-root',
  template: `<h1>Welcome to dynamic</h1>
    <ngx-dynamic
      [content]="content"
      [componentData]="componentData"
    ></ngx-dynamic>`,
})
export class AppComponent {
  content = `<p>Hello, this is Home and navbar:</p> <app-navbar></app-nabar>`;
  componentData = {
    component: NavbarComponent,
    selector: 'app-navbar',
  };
  domSanitizer = inject(DomSanitizer);
  // The bypassSecurityTrustHtml would return a new object each time it's invoked, store a reference to the function call result
  sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.content);
}

import {
  ViewContainerRef,
  ApplicationRef,
  EnvironmentInjector,
  createComponent,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'ngx-dynamic',
  template: ` <div [innerHTML]="sanitizedContent"></div> `,
})
export class NgxDynamic {
  @Input() content!: string;
  @Input() componentData!: any;
  vcr = inject(ViewContainerRef);
  envInjector = inject(EnvironmentInjector);
  applicationRef = inject(ApplicationRef);
  document = inject(DOCUMENT);
  domSanitizer = inject(DomSanitizer);
  cd = inject(ChangeDetectorRef);
  // The bypassSecurityTrustHtml would return a new object each time it's invoked, store a reference to the function call result
  sanitizedContent: SafeHtml | undefined;

  ngOnInit() {
    this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(
      this.content
    );
  }

  ngAfterViewInit() {
    try {
      this.render();
    } catch (error: any) {
      console.log('render fail', error.message);
    }
  }

  async render() {
    const hostElement = this.document.querySelector(
      this.componentData.selector
    );
    if (hostElement && this.componentData) {
      const compRef = createComponent(this.componentData.component, {
        hostElement,
        environmentInjector: this.envInjector,
      });
      this.applicationRef.attachView(compRef.hostView);
      compRef.changeDetectorRef.detectChanges();
      this.cd.detectChanges();
    }
  }
}
