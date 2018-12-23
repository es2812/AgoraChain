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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { Card } from '../card';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

// Can be injected into a constructor
@Injectable()
export class IdentityService {

    constructor(private http: HttpClient){}
    options = {}

    getIdentities(): Observable<any>{
        let requestURL = 'http://localhost:3000/api/wallet';
        this.options = {withCredentials: true, headers: new HttpHeaders({'Accept':'application/json'})}
        return this.http.get(requestURL,this.options);
    }

    importIdentity(file:File): Observable<any>{
        const formData = new FormData();
        formData.append('card',file);
        let requestURL = 'http://localhost:3000/api/wallet/import';
        this.options = {withCredentials: true, headers: new HttpHeaders({})}
        return this.http.post(requestURL,formData,this.options);
    }

    useIdentity(card:Card): Observable<any>{
        let requestURL = 'http://localhost:3000/api/wallet/'+card.name+'/setDefault';
        this.options = {withCredentials: true, headers: new HttpHeaders({'Content-Type':'application/json'})}
        return this.http.post(requestURL,card.card,this.options);
    }
}
