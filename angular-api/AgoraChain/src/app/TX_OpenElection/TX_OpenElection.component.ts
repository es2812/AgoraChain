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
import { TX_OpenElectionService } from './TX_OpenElection.service';
import 'rxjs/add/operator/toPromise';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'app/data.service';
import { Election } from 'app/org.agora.net';
import { IdentityService } from 'app/identity/identity.service';

@Component({
  selector: 'app-tx_openelection',
  templateUrl: './TX_OpenElection.component.html',
  styleUrls: ['../TX.css','./TX_OpenElection.component.css'],
  providers: [TX_OpenElectionService]
})
export class TX_OpenElectionComponent implements OnInit {

  private allElections = [];
  private activeIndex = 0;
  private Transaction;
  private currentId;
  private errorMessage;
  private currentLegislator;

  constructor(private serviceTX_OpenElection: TX_OpenElectionService, private spinnerService: NgxSpinnerService, private serviceElection: DataService<Election>, private serviceIdentity:IdentityService) {};

  ngOnInit(): void {
    this.loadOpenElections();
  }

  loadOpenElections(): Promise<any> {
    this.spinnerService.show();
    const tempList = [];
    return this.serviceIdentity.getCurrentParticipant().toPromise()
    .then((p)=>{
      return this.serviceElection.getAll('Election')
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(transaction => {
          tempList.push(transaction);
        });
        this.allElections = tempList.filter((e)=>(e.owner == "resource:".concat(p)) && (e.closed == true));
        
        this.spinnerService.hide();
      })})
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
      this.spinnerService.hide();
    });
  }

  selectElection(i) {
    this.activeIndex = i;
  }

  addTransaction(): Promise<any> {
    this.spinnerService.show();
    let selectedElection = this.allElections[this.activeIndex];
    this.Transaction = {
      $class: 'org.agora.net.TX_OpenElection',
      'election': "org.agora.net.Election#".concat(selectedElection.electionID),
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_OpenElection.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.resetForm();
      this.spinnerService.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }

      this.spinnerService.hide();
    });
  }

  resetForm(): void {
    this.selectElection(0);
  }
}
