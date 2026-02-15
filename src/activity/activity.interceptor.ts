import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityService } from './activity.service';
import { AuthService } from '../auth/auth.service';
import { extractBearerToken } from '../common/auth-token.util';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(
    private readonly activity: ActivityService,
    private readonly authService: AuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = String(req?.method || 'GET').toUpperCase();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return next.handle();

    const url = String(req?.originalUrl || req?.url || '');
    // Evita auto-registrar operaciones sobre el propio módulo de auditoría.
    if (url.split('?')[0].startsWith('/activity-logs')) return next.handle();
    const token = extractBearerToken(req?.headers?.authorization);
    const payload = token ? this.authService.decodeToken(token) : null;
    const userId = payload?.sub ?? null;

    return next.handle().pipe(
      tap(async () => {
        const entity = url.split('?')[0].split('/').filter(Boolean)[0] || 'unknown';
        const entityId = req?.params?.id ? String(req.params.id) : null;
        const body = req?.body || {};
        const headerRaw = String(req?.headers?.['x-entity-name'] || '').trim();
        let headerName = headerRaw;
        try { headerName = headerRaw ? decodeURIComponent(headerRaw) : ''; } catch {}
        const displayName =
          headerName ||
          String(body?.title || '').trim() ||
          String(body?.name || '').trim() ||
          String(body?.username || '').trim() ||
          String(body?.email || '').trim() ||
          String(body?.bank || '').trim() ||
          null;
        await this.activity.log({
          userId,
          action: method,
          entity,
          entityId,
          metadata: {
            path: url,
            ip: req?.ip,
            displayName,
          },
        });
      }),
    );
  }
}
