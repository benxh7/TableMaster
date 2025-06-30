import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Esperamos a leer la sesión
  const usuario = await auth.obtenerUsuario();

  if (!usuario) {
    // Si no hay sesión, devolvemos la UrlTree de redirección
    return router.parseUrl('/login');
  }

  // Si hay sesión, permitimos el acceso
  return true;
};