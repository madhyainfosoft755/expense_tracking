import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, isDevMode
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withHashLocation } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

import { provideStore, provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { DatePipe } from '@angular/common';

import * as authFeature from '@auth';

import { AUTH_FEATURE_KEY, authReducer, AuthEffects, errorHandlingInterceptor, authInterceptor, metaReducers } from '@auth';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),

        provideStore({ auth: authFeature.authReducer }, { metaReducers }),
        provideEffects(AuthEffects),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
        MessageService,
        // AppNotificationService,
        provideRouter(
          appRoutes,
          withHashLocation(),
          withInMemoryScrolling({
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
          }),
          withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(
          withFetch(), // Enable fetch API
          withInterceptors([
            authInterceptor,
            errorHandlingInterceptor,
          ])
        ),
        provideAnimationsAsync(),
        DatePipe
    ]
};
