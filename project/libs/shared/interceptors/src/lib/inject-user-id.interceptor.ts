import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class InjectUserIdInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InjectUserIdInterceptor.name);

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    request.userId = userId;
    this.logger.log(`[${request.method} ${request.url}]: Injected userId into query: '${userId}'`);

    return next.handle();
  }
}
