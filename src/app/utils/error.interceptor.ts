import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('error interceptor', request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log the error (you can customize this log)
        console.error('HTTP Error:', error);

        // Pass the error along to the calling code
        return throwError(() => error);
      })
    );
  }
}
