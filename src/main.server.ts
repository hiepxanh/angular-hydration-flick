import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { ServerModule } from "@angular/platform-server";
import { importProvidersFrom } from "@angular/core";
import { providers } from "./app/app.config";

export default () => bootstrapApplication(AppComponent, {
    providers: [...providers, importProvidersFrom(ServerModule),]
});
