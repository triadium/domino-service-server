/**
 * Web application module
 * @module app.module
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { WebConfigurationModule } from '../common/configuration/web.configuration.module';
import { ProducerModule } from '../common/producers';
// import * as cookieParser from 'cookie-parser';
// import * as helmet from 'helmet';
// import { ConnectionPoolModule } from 'connection-pool/connection-pool.module';
// import { StorageModule } from 'storage/storage.module';
// import { UserApiController } from './controller/api/user.api-controller';
// import { AuthorizationModule } from './authorization/authorization.module';
// import { AccessRightsModule } from './access-rights/access-rights.module';
// import { AdvertisementApiController } from './controller/api/advertisement.api-controller';
// import { AdvertisementSectionApiController } from './controller/api/advertisement-section.api-controller';
// import { ImageApiController } from './controller/image.controller';
import { SettingsController, UserController } from './controllers';

@Module({
  imports: [
    WebConfigurationModule,
    ProducerModule,
    // AuthorizationModule,
    // AccessRightsModule,
    // ConnectionPoolModule,
    // StorageModule,
],
  controllers: [
    SettingsController,
    UserController,
    // ImageApiController, UserApiController, AdvertisementApiController, AdvertisementSectionApiController
  ],
})
export class WebAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // tslint:disable-next-line:quotemark
    const cspSelf = "'self'";
    // consumer.apply(
    //   cookieParser(),
    //   helmet({
    //     contentSecurityPolicy: {
    //       directives: {
    //         defaultSrc: [cspSelf],
    //         styleSrc: [cspSelf],
    //       },
    //     },
    //     noCache: true,
    //     hidePoweredBy: true,
    //   }),
    // ).forRoutes(UserApiController);
  }
}
