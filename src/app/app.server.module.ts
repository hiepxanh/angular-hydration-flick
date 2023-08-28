import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NgxDynamic } from './ngx-dynamic.component';
@NgModule({
  imports: [AppModule, ServerModule, NgxDynamic],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
