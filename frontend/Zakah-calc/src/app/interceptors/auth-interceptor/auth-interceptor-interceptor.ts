import { HttpInterceptorFn } from '@angular/common/http';
import { AuthStorageService } from '../../services/storage-service/StorageService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const PUBLIC_ENDPOINTS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/account/verify-account',
  '/api/v1/auth/account/resend-otp',
  '/api/v1/auth/password/forget-password',
  '/api/v1/auth/password/verify-otp',
  '/api/v1/auth/password/resend-otp',
  '/api/v1/auth/password/reset-password',
];


  const url = req.url;
  let path = url;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname;
    } catch {
      path = url;
    }
  }

  console.log('🔄 Interceptor - Request URL:', url);
  console.log('🔄 Interceptor - Request Path:', path);

  const isPublic = PUBLIC_ENDPOINTS.some(endpoint => {
    const isPublicEndpoint = path.startsWith(endpoint);
    console.log(`Checking if ${path} starts with ${endpoint}: ${isPublicEndpoint}`);
    return isPublicEndpoint;
  });

  console.log('🔍 Is public endpoint?', isPublic);

  if (isPublic) {
    console.log('✅ Interceptor - PUBLIC endpoint, skipping token');
    return next(req);
  }

  console.log('🔒 Interceptor - PRIVATE endpoint, adding token...');
  const token = AuthStorageService.getAccessToken();

  if (!token) {
    console.error('❌ Interceptor - No token found for private endpoint!');
    return next(req);
  }

  console.log('✅ Interceptor - Token found, adding to request');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
