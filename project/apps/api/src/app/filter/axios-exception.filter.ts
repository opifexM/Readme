import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

@Catch(AxiosError)
export class AxiosExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AxiosExceptionFilter.name);

  catch(error: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response?.statusText || INTERNAL_SERVER_ERROR_MESSAGE;
    this.logger.error(`HTTP Error Response - Status: ${status} Message: ${message} - Error: ${error.message}`);

    response
      .status(status)
      .json({
        statusCode: status,
        message,
      });
  }
}
