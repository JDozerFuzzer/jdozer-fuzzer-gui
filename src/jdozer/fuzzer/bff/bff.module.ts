import { Module } from '@nestjs/common';
import { BffService } from './bff.service';
import { BffController } from './bff.controller';
import { HttpModule } from '@nestjs/axios';
import { FuzzerStorageModule } from './model/FuzzerStorageModule';

@Module({
  imports: [
    HttpModule.register({
      // baseURL: 'http://localhost:8080',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    }),
    FuzzerStorageModule
  ],
  controllers: [BffController],
  providers: [BffService]
})
export class BffModule { }
