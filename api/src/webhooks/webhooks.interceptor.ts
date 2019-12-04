import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
  constructor(protected configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cryptoJS = require('crypto-js');
    const compare = require('secure-compare');

    const request = context.switchToHttp().getRequest();

    const body: any = request.body;
    const xHubSignature = request.headers['x-hub-signature'];

    const signature: string =
      'sha1=' +
      cryptoJS
        .HmacSHA1(
          JSON.stringify(body),
          this.configService.get('GITHUB_WEBHOOK_SECRET'),
        )
        .toString();

    if (compare(signature, xHubSignature)) {
      return next.handle();
    } else {
      return of([]);
    }
  }
}
