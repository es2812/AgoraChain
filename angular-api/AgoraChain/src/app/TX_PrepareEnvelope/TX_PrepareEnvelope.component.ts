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
import { TX_PrepareEnvelopeService } from './TX_PrepareEnvelope.service';
import 'rxjs/add/operator/toPromise';
import { DataService } from 'app/data.service';
import { Election, Envelope } from 'app/org.agora.net';
import { NgxSpinnerService } from 'ngx-spinner';
import { IdentityService } from 'app/identity/identity.service';

@Component({
  selector: 'app-tx_prepareenvelope',
  templateUrl: './TX_PrepareEnvelope.component.html',
  styleUrls: ['../TX.css','./TX_PrepareEnvelope.component.css'],
  providers: [TX_PrepareEnvelopeService]
})
export class TX_PrepareEnvelopeComponent implements OnInit {

  myForm: FormGroup;

  private allElections = [];
  private uniqueID;
  private currentParticipant;
  private activeIndex = 0;

  private Transaction;
  private currentId;
  private errorMessage;

  envelopeID = new FormControl('', Validators.required);
  voter = new FormControl('', Validators.required);
  election = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTX_PrepareEnvelope: TX_PrepareEnvelopeService, fb: FormBuilder, private serviceElection: DataService<Election>, private serviceSpinner: NgxSpinnerService, private serviceIdentity:IdentityService, private serviceEnvelope: DataService<Envelope>) {
    this.myForm = fb.group({
      envelopeID: this.envelopeID,
      voter: this.voter,
      election: this.election,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.getCurrentParticipant();
  }

  loadElections(): Promise<any> {
    this.serviceSpinner.show();
    const tempList = [];
    return this.serviceElection.getAll('Election')
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allElections = tempList;
      //we should get rid of elections whose votes exist
      return this.serviceEnvelope.getAll('Envelope').toPromise()
      .then((envs)=>
      {
        let electionsWithEnvelopes = envs.map(e=>e.election.toString().split('#')[1]);
        this.allElections = this.allElections.filter((e)=> (e.closed == false) && (electionsWithEnvelopes.indexOf(e.electionID)==-1));
        this.serviceSpinner.hide(); 
      })
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

  getCurrentParticipant(): Promise<any> {
    this.serviceSpinner.show();
    return this.serviceIdentity.getCurrentParticipant().toPromise()
    .then((result)=>{
      this.errorMessage = null;
      this.currentParticipant = result;
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
    });
  }

  getUniqueID(): Promise<any> {
    this.serviceSpinner.show();
    return this.serviceEnvelope.getAll('Envelope')
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      this.uniqueID = result.length + 1;
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
    });
  }

  selectElection(i):void{
    this.activeIndex = i;
  }

  addTransaction(form: any): Promise<any> {
    this.serviceSpinner.show();
    let selectedElection = "org.agora.net.Election#".concat(this.allElections[this.activeIndex].electionID);
    this.Transaction = {
      $class: 'org.agora.net.TX_PrepareEnvelope',
      'envelopeID': this.uniqueID,
      'voter': this.currentParticipant,
      'election': selectedElection,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'envelopeID': null,
      'voter': null,
      'election': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTX_PrepareEnvelope.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'envelopeID': null,
        'voter': null,
        'election': null,
        'transactionId': null,
        'timestamp': null
      });
      this.serviceSpinner.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.agora.net.TX_PrepareEnvelope',
      'envelopeID': this.envelopeID.value,
      'voter': this.voter.value,
      'election': this.election.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceTX_PrepareEnvelope.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.serviceTX_PrepareEnvelope.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceTX_PrepareEnvelope.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'envelopeID': null,
        'voter': null,
        'election': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.envelopeID) {
        formObject.envelopeID = result.envelopeID;
      } else {
        formObject.envelopeID = null;
      }

      if (result.voter) {
        formObject.voter = result.voter;
      } else {
        formObject.voter = null;
      }

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
    this.activeIndex = 0;
    this.myForm.setValue({
      'envelopeID': null,
      'voter': null,
      'election': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
