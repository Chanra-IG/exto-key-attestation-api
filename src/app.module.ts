import { Module } from '@nestjs/common';

import { ConfigModule } from '@lib/config';

import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule, ConfigModule]
})
export class ApplicationModule {}
