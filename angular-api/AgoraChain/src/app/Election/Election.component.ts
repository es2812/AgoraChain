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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ElectionService } from './Election.service';
import 'rxjs/add/operator/toPromise';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'app/data.service';
import { Legislator } from 'app/org.agora.net';

@Component({
  selector: 'app-election',
  templateUrl: './Election.component.html',
  styleUrls: ['./Election.component.css'],
  providers: [ElectionService]
})
export class ElectionComponent implements OnInit {

  private closedElections = [];
  private openElections = [];
  private asset;
  private currentId;
  private errorMessage;

  constructor(public serviceElection: ElectionService, private serviceSpinner: NgxSpinnerService, private serviceLegislator: DataService<Legislator>) {};

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    this.serviceSpinner.show();
    const tempList = [];
    return this.serviceElection.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.closedElections = tempList.filter((e)=>e.closed);
      this.openElections = tempList.filter((e)=>!e.closed);
      this.loadOwners();
      this.serviceSpinner.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
      this.serviceSpinner.hide();
    });
  }

  loadOwners():Promise<any> {
    this.serviceSpinner.show();
    return this.serviceLegislator.getAll('Legislator')
    .toPromise()
    .then((el)=>{
      this.closedElections.forEach((v)=>{
        let ownerId = v.owner.toString().split('#')[1];
        v.owner = el.filter((e)=> e.id == ownerId)[0];
      })
      this.openElections.forEach((v)=>{
        let ownerId = v.owner.toString().split('#')[1];
        v.owner = el.filter((e)=> e.id == ownerId)[0];
      })
      this.serviceSpinner.hide();
    })
  }
}
