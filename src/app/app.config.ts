import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { routes } from './app.routes';
import * as echarts from 'echarts';
import { provideEchartsCore } from 'ngx-echarts';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),

    provideEchartsCore({ echarts }),

    provideRouter(routes),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
