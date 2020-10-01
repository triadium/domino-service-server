/**
 * Web server main programm
 * @module main
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @todo Replace default logger with own implementation
 */

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import * as cluster from 'express-cluster';
import { WebAppModule } from './web.app.module';
import { WebServerConfiguration } from '../common/configuration/web.configuration.provider';
import { WebClusterConfiguration } from '../common/configuration/web.cluster.configuration.provider';

function bootstrap() {

  const clusterConfiguration = new WebClusterConfiguration();

  cluster(
    {
      count: clusterConfiguration.get('WEB_CLUSTER_NODE_COUNT'),
      verbose: clusterConfiguration.isFlagSet('WEB_CLUSTER_VERBOSE'),
      respawn: clusterConfiguration.isFlagSet('WEB_CLUSTER_NODE_RESPAWN'),
    },
    async (worker) => {
      const app = await NestFactory.create(WebAppModule);
      const webServerConfiguration = app.get(WebServerConfiguration);

      app.useStaticAssets(join(__dirname + webServerConfiguration.get('WEB_SERVER_PUBLIC_PATH')));

      app.disable('x-powered-by');
      app.disable('etag');

      const port = webServerConfiguration.get('WEB_SERVER_PORT');
      await app.listen(port);
      Logger.log(`Worker ${worker.id} listening at port ${port}`, 'Web cluster', false);
    },
  );
}
bootstrap();
