import { Module } from '@nestjs/common';
import { SomeProcessor } from './processors/some.processor';
import { QueueConfigurationModule } from '../common/configuration/queue.configuration.module';

@Module({
  imports: [QueueConfigurationModule],
  controllers: [SomeProcessor],
  providers: [],
})
export class UnitAppModule {}