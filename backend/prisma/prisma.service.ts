import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => { await app.close(); });
  }
  async withTenant<T>(tenantId: number, fn: (tx: PrismaService) => Promise<T>) {
    return this.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(`SET LOCAL "app.current_tenant" = '${tenantId}'`);
      // @ts-expect-error prisma tx typing
      return fn(tx);
    });
  }
}
