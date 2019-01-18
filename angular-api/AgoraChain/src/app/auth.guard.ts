/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IdentityService } from 'app/identity/identity.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private serviceIdentity: IdentityService, private serviceSpinner: NgxSpinnerService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        this.serviceSpinner.show()
        return this.serviceIdentity.getIdentities().toPromise()
        .then((d)=>{
            this.serviceSpinner.hide()
            localStorage.setItem('loggedIn','true');
            return true;
        }
        )
        .catch((error)=>{
            console.log(error.statusText)
            if(error.statusText=='Unauthorized'){
                this.serviceSpinner.hide();
                localStorage.setItem('loggedIn','false');
                this.router.navigate(['/']);
            }
            else{
                this.serviceSpinner.hide()
            }
        })
    }
}