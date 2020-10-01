/**
 * Web configuration module
 * @module web/configuration/web.configuration.module
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 * Declares configuration providers for the web server
 * Reads configuration files with name like <NODE_ENV>.<name>.env
 * Names: web
 */

import { Module } from '@nestjs/common';
import { WebServerConfiguration } from './web.configuration.provider';

@Module({
  providers: [WebServerConfiguration],
  exports: [WebServerConfiguration],
})
export class WebConfigurationModule {}