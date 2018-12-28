import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class IdentityGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentIdentity')) {
            // logged in and has identity so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/identity']);
        return false;
    }
}