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
import { TX_CloseElectionService } from './TX_CloseElection.service';
import 'rxjs/add/operator/toPromise';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'app/data.service';
import { Election } from 'app/org.agora.net';
import { IdentityService } from 'app/identity/identity.service';

@Component({
  selector: 'app-tx_openelection',
  templateUrl: './TX_CloseElection.component.html',
  styleUrls: ['../TX.css','./TX_CloseElection.component.css'],
  providers: [TX_CloseElectionService]
})
export class TX_CloseElectionComponent implements OnInit {

  myForm: FormGroup;

  private allElections = [];
  private activeIndex = 0;
  private Transaction;
  private currentId;
  private errorMessage;
  private currentLegislator;

  election = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTX_CloseElection: TX_CloseElectionService, fb: FormBuilder, private spinnerService: NgxSpinnerService, private serviceElection: DataService<Election>, private serviceIdentity:IdentityService) {
    this.myForm = fb.group({
      election: this.election,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadCloseElections();
  }

  loadCloseElections(): Promise<any> {
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
        this.allElections = tempList.filter((e)=>(e.owner == "resource:".concat(p)) && (e.closed == false));
        
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
    });
  }

  selectElection(i) {
    this.activeIndex = i;
  }

  addTransaction(form: any): Promise<any> {
    this.spinnerService.show();
    let selectedElection = this.allElections[this.activeIndex];
    this.Transaction = {
      $class: 'org.agora.net.TX_CloseElection',
      'election': "org.agora.net.Election#".concat(selectedElection.electionID),
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'election': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTX_CloseElection.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'election': null,
        'transactionId': null,
        'timestamp': null
      });
      this.spinnerService.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


  getForm(id: any): Promise<any> {
    return this.serviceTX_CloseElection.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'election': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.election) {
        formObject.election = result.election;
      } else {
        formObject.election = null;
      }

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
      this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'election': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
