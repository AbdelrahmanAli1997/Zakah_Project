import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import {AuthStorageService} from '../../services/storage-service/StorageService';
import {AuthService} from '../../services/auth-service/auth.service';


let isRefreshing = false;

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (
        error.status === 401 &&
        !isRefreshing &&
        AuthStorageService.getRefreshToken()
      ) {
        isRefreshing = true;

        return authService.refreshToken().pipe(
          switchMap(() => {
            isRefreshing = false;

            const token = AuthStorageService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });

            return next(retryReq);
          }),
          catchError(err => {
            isRefreshing = false;
            AuthStorageService.clear();
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
