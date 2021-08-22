import { Controller, Get, Request, Post, UseGuards, Body, HttpStatus } from '@nestjs/common';
// import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Base')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
