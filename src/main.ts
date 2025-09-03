import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import {
  ClientSideRowModelModule,
  PaginationModule,
  SetFilterModel,

} from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule, // basic row model
  PaginationModule,  
  AllCommunityModule        // pagination
]);

bootstrapApplication(AppComponent, {
providers: [
  provideHttpClient()
]

})
  .catch((err) => console.error(err));
