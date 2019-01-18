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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { httpFactory } from '@angular/http/src/http_module';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-logout',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class LogOutComponent implements OnInit{

  constructor (private router: Router, private http:Http, 
    private serviceSpinner:NgxSpinnerService) {
  }

  ngOnInit(){
    this.serviceSpinner.show();
    if (localStorage.getItem('loggedIn')=='true'){
      return this.http.get('http://20.0.0.99:3000/auth/logout',{'withCredentials':true}).toPromise()
        .then(()=>{
            localStorage.clear();
            this.router.navigate(['/']);
            this.serviceSpinner.hide();
            window.location.reload();
        })
        .catch(error=>{
        this.serviceSpinner.hide();
        })
    }
    else {
      this.router.navigate(['/']);
    }
  }
  
}
