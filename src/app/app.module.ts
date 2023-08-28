import { NgModule } from '@angular/core';
import {
  provideClientHydration,
  BrowserModule,
} from '@angular/platform-browser';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

import { AppComponent, NgxDynamic } from './app.component';
const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
];
@NgModule({
  declarations: [AppComponent],
  imports: [
    NgxDynamic,
    BrowserModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: NoPreloading,
    }),
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
