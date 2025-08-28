import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from session storage
    const authToken = sessionStorage.getItem('token');
    
    // Clone the request and add the authorization header if token exists
    if (authToken) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return this.handleRequest(authReq, next);
    }
    
    return this.handleRequest(request, next);
  }
  
  private handleRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          // Clear any existing auth data
          sessionStorage.removeItem('Loggedinuser');
          sessionStorage.removeItem('token');
          
          // Redirect to login page with return URL
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.routerState.snapshot.url }
          });
        }
        
        // Re-throw the error to be handled by the service
        return throwError(() => error);
      })
    );
  }
}
