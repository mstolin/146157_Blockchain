/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

declare global {
  interface Window { ethereum?: any; }
}
window.ethereum = window.ethereum || {};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
