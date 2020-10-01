import { Module } from '@nestjs/common';
import { QueueConfigurationModule } from '../common/configuration/queue.configuration.module';
import { StorageModule } from '../storages/storage.module';
import { SettingsProcessor, UserProcessor } from './processors';

@Module({
  imports: [QueueConfigurationModule, StorageModule],
  controllers: [SettingsProcessor, UserProcessor ],
  // providers: [],
})
export class UnitAppModule {}