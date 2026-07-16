import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Verificação de Status (Health Check)' })
  @ApiResponse({ status: 200, description: 'Retorna uma string simples confirmando que a API está online.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
