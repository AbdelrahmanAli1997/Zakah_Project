import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/storage-service/StorageService';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // Check if we are in the browser
  if (isPlatformBrowser(platformId)) {
    const token = AuthStorageService.getAccessToken(); // This uses localStorage inside
    if (token) {
      return true;
    }
  }

  // If on server, or no token, redirect to login
  router.navigate(['/']);
  return false;
};