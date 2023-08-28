import {
  inject,
  Component,
  ViewContainerRef,
  ApplicationRef,
  EnvironmentInjector,
  createComponent,
  Input,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  // document = inject(DOCUMENT);
  domSanitizer = inject(DomSanitizer);
  cd = inject(ChangeDetectorRef);
  // The bypassSecurityTrustHtml would return a new object each time it's invoked, store a reference to the function call result
  sanitizedContent: SafeHtml | undefined;

  constructor(@Inject(DOCUMENT) private document: Document) {

  }

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
      console.log('dynamic exist, creating component...', !!hostElement);
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve({});
        }, 500)
      );
      const compRef = createComponent(this.componentData.component, {
        hostElement,
        environmentInjector: this.envInjector,
      });

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve({});
        }, 500)
      );
      this.applicationRef.attachView(compRef.hostView);
      compRef.changeDetectorRef.detectChanges();
      this.cd.detectChanges();
    } else {
      console.log('element not exist');
    }
  }
}
