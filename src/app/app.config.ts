import { BrowserModule, bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { APP_ID, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
    },
];

export const providers = [
    { provide: APP_ID, useValue: 'serverApp' },
    provideClientHydration(),
    importProvidersFrom(RouterModule.forRoot(routes, {
        initialNavigation: 'enabledBlocking',
    })),
];
