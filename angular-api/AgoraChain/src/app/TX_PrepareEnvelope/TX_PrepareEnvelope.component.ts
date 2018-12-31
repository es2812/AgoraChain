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
  styleUrls: ['../TX.css'],
  providers: [TX_PrepareEnvelopeService]
})
export class TX_PrepareEnvelopeComponent implements OnInit {

  private allElections = [];
  private uniqueID;
  private currentParticipant;
  private activeIndex = 0;

  private Transaction;
  private currentId;
  private errorMessage;

  constructor(private serviceTX_PrepareEnvelope: TX_PrepareEnvelopeService, private serviceElection: DataService<Election>, private serviceSpinner: NgxSpinnerService, private serviceIdentity:IdentityService, private serviceEnvelope: DataService<Envelope>) {};

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
      this.serviceSpinner.hide(); 
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
      this.serviceSpinner.hide(); 
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
      this.serviceSpinner.hide(); 
    });
  }

  selectElection(i):void{
    this.activeIndex = i;
  }

  addTransaction(): Promise<any> {
    this.serviceSpinner.show();
    let selectedElection = "org.agora.net.Election#".concat(this.allElections[this.activeIndex].electionID);
    this.Transaction = {
      $class: 'org.agora.net.TX_PrepareEnvelope',
      'envelopeID': this.uniqueID,
      'voter': this.currentParticipant,
      'election': selectedElection,
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_PrepareEnvelope.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.resetForm()
      this.serviceSpinner.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
      this.serviceSpinner.hide(); 
    });
  }

  resetForm(): void {
    this.selectElection(0);
  }
}
