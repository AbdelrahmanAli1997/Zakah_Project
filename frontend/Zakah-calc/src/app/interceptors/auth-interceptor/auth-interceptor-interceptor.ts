import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthStorageService} from '../../services/storage-service/StorageService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const PUBLIC_ENDPOINTS = [
    '/login',
    '/register',
    '/refresh-token',
    '/verify-account',
    '/password'
  ];

  const isPublic = PUBLIC_ENDPOINTS.some(e => req.url.includes(e));
  if (isPublic) {
    return next(req);
  }

  const token = AuthStorageService.getAccessToken();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
