import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = 'An unexpected error occurred';
    let errors: any = undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = exceptionResponse.message || message;
      errors = exceptionResponse.errors || exceptionResponse.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
      `HTTP ${status} Error on ${request.method} ${request.url}: ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      errors: errors || null,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
