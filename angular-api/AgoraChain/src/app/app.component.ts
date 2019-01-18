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
import { IdentityService } from './identity/identity.service'
import $ from 'jquery';
import { DataService } from './data.service';
import { Person } from './org.agora.net';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  currentParticipant:Person = null;
  errorMessage:string;
  currentType:string = '';
  participantLink:string = '';
  loggedIn:boolean = false;

  constructor(private identityService:IdentityService, private dataService: DataService<Person>, private spinnerService: NgxSpinnerService){
    if(localStorage.getItem('loggedIn')=='true'){
      this.loggedIn = true;
    }
    else{
      this.loggedIn = false;
    }
  }


  ngOnInit() {
    $('.nav a').on('click', function(){
      $('.nav').find('.active').removeClass('active');
      $(this).parent().addClass('active');
    });

    $('.dropdown').on('show.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
    });

    $('.dropdown').on('hide.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
    });

    $('.dropdown-menu li').on('click', function(){
      $(this).parent().parent().addClass('active');
    });
    this.getIdentity();
  }

  getIdentity():Promise<any>{
    this.spinnerService.show();
    return this.identityService.getCurrentParticipant().toPromise()
    .then(
      (data)=>{
        this.loggedIn = true;
        let fs = data.split('.')[3].split('#');
        let ns = fs[0];

        this.currentType = ns;
        localStorage.setItem('currentType',this.currentType);
        let id = fs[1];

        return this.dataService.getSingle(ns,id).toPromise()
        .then( (p) => 
        {
          this.currentParticipant = p;
          localStorage.setItem('currentIdentity',this.currentParticipant.id);
          this.spinnerService.hide();
        }
        )
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
      this.spinnerService.hide();
    });
  }
}
