// logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const requestDatetime = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

        const now = Date.now();
        return next.handle()
            .pipe(
                tap(() => this.logger.log(`[${requestDatetime}]: ${method} ${url} (took ${Date.now() - now}ms)`)),
            );
    }
}
