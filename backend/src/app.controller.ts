import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
root() {                          // ✅ tip belirtmeseniz de olur
  return { ok: true, name: 'backend', version: '1.0.0' };
}

@Get('/healthz')
health() {
  return this.appService.health();
}

}
