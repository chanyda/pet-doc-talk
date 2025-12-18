import { CallHandler, ExecutionContext, HttpException, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const req = context.switchToHttp().getRequest<Request>();
        const method = req.method;
        const url = req.url;

        return next.handle().pipe(
            tap(() => {
                const delay = Date.now() - now;

                const response = context.switchToHttp().getResponse<Response>();
                const statusCode = response.statusCode;

                this.logger.log(`${method} ${url} ${statusCode} ${delay}ms`);
            }),
            catchError((error: unknown) => {
                const delay = Date.now() - now;
                let statusCode = 500;
                let errorMessage = "Internal server error";
                let errorResponse = "";

                if (error instanceof HttpException) {
                    statusCode = error.getStatus();
                    errorMessage = error.message;
                    errorResponse = JSON.stringify(error.getResponse());
                }

                this.logger.error(
                    `${method} ${url} ${statusCode} ${delay}ms - Error: ${errorMessage} - Details: ${errorResponse}`,
                );
                return throwError(() => error);
            }),
        );
    }
}
