/**
 * Interceptor that logs the execution time of
 * a class method, usually controller's handler
 * @module common/interceptors/logging.interceptor
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 *
 * @description
 * Interceptor counts calls and marks starting and ending messages
 * with the same index. And it counts the execution time also.
 */

import { Injectable, NestInterceptor, ExecutionContext, Logger, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isString } from 'lodash';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  static index: number = 0;

  static logErrorMessage(index: number, error: HttpException | Error, context: string): void {
    let message: string;
    const response = (error instanceof HttpException) ? error.getResponse() as any : error.message;

    if (isString(response)) {
      message = `[${index}] ${response}`;
    }
    else {
      message = `[${index}] ${response.message} <${response.error}>`;
    }

    Logger.error(message, '', context, true);
  }

  static logBeforeCallMessage(index: number, context: string): void {
    Logger.log(`[${index}] Before call`, context, false);
  }

  static logAfterCallMessage(index: number, context: string): void {
    Logger.log(`[${index}] After call`, context, true);
  }

  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {

    LoggingInterceptor.index++;

    const index = LoggingInterceptor.index;
    const logContext = context.getClass().name + '/' + context.getHandler().name;
    LoggingInterceptor.logBeforeCallMessage(index, logContext);
    return call$.pipe(
      tap(() => LoggingInterceptor.logAfterCallMessage(index, logContext)),
      catchError(error => {
        LoggingInterceptor.logErrorMessage(index, error, logContext);
        throw error;
      }),
    );
  }
}