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
import { NgxSpinnerService } from 'ngx-spinner';
import { IdentityComponent } from 'app/identity';
import { IdentityService } from 'app/identity/identity.service';
import { logging } from 'selenium-webdriver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor (private router:Router, private serviceSpinner:NgxSpinnerService, private serviceIdentity:IdentityService) {
  }
  
  ngOnInit(){
    this.serviceSpinner.show()
    return this.serviceIdentity.getIdentities().toPromise()
      .then((d)=>{
          this.serviceSpinner.hide()
          localStorage.setItem('loggedIn','true');
          this.router.navigate(['/identity']);
      })
      .catch((error)=>{
          console.log(error.statusText)
          if(error.statusText=='Unauthorized'){
              this.serviceSpinner.hide();
              localStorage.setItem('loggedIn','false');
          }
          else{
              this.serviceSpinner.hide()
          }
    })
  }

  login(){
    this.serviceSpinner.show();
    window.location.href = "http://20.0.0.99:3000/auth/github";
    this.serviceSpinner.hide();
  }
}
