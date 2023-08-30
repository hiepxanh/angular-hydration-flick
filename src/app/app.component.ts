import { inject, Component, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  ElementRef,
  ApplicationRef,
  createComponent,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ngx-dynamic',
  template: ``,
})
export class NgxDynamic {
  platformId = inject(PLATFORM_ID);
  @Input() content!: string;
  @Input() context!: any;
  @Input() componentData!: any;
  elementRef = inject(ElementRef);
  applicationRef = inject(ApplicationRef);
  document = inject(DOCUMENT);
  domSanitizer = inject(DomSanitizer);
  cd = inject(ChangeDetectorRef);
  isServer = isPlatformServer(this.platformId);
  ngOnInit() {
    if (this.isServer) {
      this.elementRef.nativeElement.innerHTML = (
        this.domSanitizer.bypassSecurityTrustHtml(this.content) as any
      )['changingThisBreaksApplicationSecurity'];
      console.log('at server', this.content);
    } else {
      console.log('at client', this.content);
    }
  }

  ngAfterViewInit() {
    if (this.isServer) {
      console.log('2', this.platformId, this.isServer, this.context);
      this.render();
    }
  }

  async render() {
    const hostElement = this.document.querySelector(
      this.componentData.selector
    );
    if (hostElement && this.componentData) {
      const compRef = createComponent(this.componentData.component, {
        hostElement,
        environmentInjector: this.applicationRef.injector,
      });
      compRef.setInput('data', this.context.data);
      this.applicationRef.attachView(compRef.hostView);
      compRef.changeDetectorRef.detectChanges();
      this.cd.detectChanges();
    }
  }
}


@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `<p>navbar data: {{ data }}</p>`,
})
export class NavbarComponent {
  @Input() data!: any;
}

@Component({
  selector: 'app-root',
  template: `<p>app-root: {{ platform }}</p>
    <ngx-dynamic
      [content]="content"
      [context]="context"
      [componentData]="componentData"
    ></ngx-dynamic>`,
  imports: [NgxDynamic],
  standalone: true,
})
export class AppComponent {
  platform = inject(PLATFORM_ID);
  context = { data: this.platform };
  content = `<app-navbar></app-nabar>`;
  componentData = {
    component: NavbarComponent,
    selector: 'app-navbar',
  };
}
