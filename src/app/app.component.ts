import { ElementRef, ApplicationRef, createComponent, Input, ChangeDetectorRef, inject, Component, PLATFORM_ID, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  standalone: true,
  selector: 'app-footer',
  template: `
  Footer should not empty <p [innerHTML]="content"> footer here </p>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class FooterComponent {
  platformId = inject(PLATFORM_ID);
  isServer = isPlatformServer(this.platformId);
  elementRef = inject(ElementRef);
  @HostBinding('attr.id') id!: string;
  content!: string;
  ngOnInit() {
    if (this.isServer) {
      // not work: the p tag will not update innerHTML
      this.content = 'footer content changed';
      // not work: the footer will not have id attribute
      this.id = 'id: server';
      // work: title display if you hover on footer content
      this.elementRef.nativeElement.setAttribute("title", `platform: ${this.platformId}`);
    }
  }
}



@Component({
  selector: 'app-root',
  template: `<p>app-root: {{ platformId }}</p>
    <ngx-dynamic [content]="content" [context]="context" [componentData]="componentData"></ngx-dynamic>
    <app-footer></app-footer>
    `,
  imports: [NgxDynamic, FooterComponent],
  standalone: true,
})
export class AppComponent {
  platformId = inject(PLATFORM_ID);
  context = { data: this.platformId };
  content = `<app-navbar></app-nabar>`;
  componentData = {
    component: NavbarComponent,
    selector: 'app-navbar',
  };
}
