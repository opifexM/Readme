import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class InjectUserIdToBodyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InjectUserIdToBodyInterceptor.name);

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    request.body['userId'] = userId;
    this.logger.log(`[${request.method}: ${request.url}]: Injected userId into body: '${userId}'`);

    return next.handle();
  }
}
