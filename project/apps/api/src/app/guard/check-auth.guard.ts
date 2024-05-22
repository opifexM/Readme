import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/api-config';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  private readonly logger = new Logger(CheckAuthGuard.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('Checking JWT authorization...');
    const request = context.switchToHttp().getRequest();
    const { data } = await this.httpService.axiosRef.post(`${this.applicationConfig.serviceUrlAuth}/check`, {}, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    })

    request['user'] = data;
    this.logger.log('Checked authorization for JWT token');

    return true;
  }
}
