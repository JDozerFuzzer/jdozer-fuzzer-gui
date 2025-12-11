import { Module } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { FrontendController } from './frontend.controller';
import { BffModule } from '../bff/bff.module';

@Module({
  imports: [BffModule],
  controllers: [FrontendController],
  providers: [FrontendService]
})
export class FrontendModule { }
