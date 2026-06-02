import { environment } from '../../../environments/environment';

export const clientLogger = {
  warn(message: string, details?: unknown): void {
    if (!environmentIsProduction()) {
      console.warn(message, details ?? '');
    }
  },

  error(message: string, details?: unknown): void {
    if (!environmentIsProduction()) {
      console.error(message, details ?? '');
    }
  },
};

function environmentIsProduction(): boolean {
  return environment.production;
}
