import { Controller, Get, Render } from '@nestjs/common';
import { FrontendService } from './frontend.service';

@Controller()
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) { }

  @Get()
  @Render('index')
  getIndex(): object {
    return { DOMAIN_URL: 'localhost:3000', CURRENT_USER_TMP: 'ddf14d12-8356-499c-8526-949647d42214' };
  }
}
