import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ENV } from '../config/env';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    if (token !== ENV.AUTH_TOKEN) {
      throw new UnauthorizedException('Invalid token.');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
