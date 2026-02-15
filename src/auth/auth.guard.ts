import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { extractBearerToken, verifyAuthToken } from '../common/auth-token.util';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = extractBearerToken(req.headers?.authorization);
    if (!token) throw new UnauthorizedException('falta bearer token');
    const payload = verifyAuthToken(token, process.env.AUTH_SECRET || 'change-me-auth-secret');
    if (!payload) throw new UnauthorizedException('token inválido');
    req.user = payload;
    return true;
  }
}
