import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import pt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { NzModalService } from 'ng-zorro-antd/modal';
import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // provideClientHydration(),
    provideNzIcons(),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    NzModalService
  ]
};
