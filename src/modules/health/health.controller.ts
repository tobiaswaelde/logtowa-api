import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('/')
  getHealth() {
    return {
      status: 'online',
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    };
  }
}
