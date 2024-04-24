import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping(): string {
    return this.appService.pong();
  }

  @Post("/deploy/sw")
  deploySW(): string {
    return this.appService.deploySW();
  }
}
