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

@Injectable()
export class TypeGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url = state.url;
        const type = localStorage.getItem('currentType');
        
        switch (url) {
            //Citizen only urls
            case "/Envelope":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/Restriction":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/CurrentCitizen":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/TX_Trust":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/TX_Nulltrust":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/TX_AddRestriction":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/TX_RemoveRestriction":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/TX_PrepareEnvelope":
                if(type == 'Citizen'){
                    return true;
                }
                break
            case "/TX_SecretVote":
                if(type == 'Citizen'){
                    return true;
                }
                break
            
            //Politician only urls
            case "/CurrentPolitician":
                if(type == 'Politician'){
                    return true;
                }
                break
            case "/TX_PublicVote":
                if(type == 'Politician'){
                    return true;
                }
                break
            //Legislator only urls
            case "/CurrentLegislator":
                if(type == 'Legislator'){
                    return true;
                }
                break
            case "/TX_CreateElection":
                if(type == 'Legislator'){
                    return true;
                }
                break
            case "/TX_CloseElection":
                if(type == 'Legislator'){
                    return true;
                }
                break
            case "/TX_OpenElection":
                if(type == 'Legislator'){
                    return true;
                }
                break 
            default:
                break;
        }
        return false;
    }
}