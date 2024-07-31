import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('complex')
  @HttpCode(200)
  getComplex(): string {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return `Complex calculation result: ${sum}`;
  }
}
