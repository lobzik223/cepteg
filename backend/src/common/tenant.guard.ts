import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const raw = req.header('X-Tenant-Id');
    const n = Number(raw);
    if (!raw || !Number.isFinite(n) || n <= 0) {
      throw new BadRequestException('X-Tenant-Id header is required');
    }
    req.tenantId = n;
    return true;
  }
}
