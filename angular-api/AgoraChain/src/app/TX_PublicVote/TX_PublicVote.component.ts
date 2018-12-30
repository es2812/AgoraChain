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
import { TX_PublicVoteService } from './TX_PublicVote.service';
import $ from 'jquery';
import 'rxjs/add/operator/toPromise';
import { DataService } from 'app/data.service';
import { Election } from 'app/org.agora.net';
import { NgxSpinnerService } from 'ngx-spinner';
import { IdentityService } from 'app/identity/identity.service';

@Component({
  selector: 'app-tx_publicvote',
  templateUrl: './TX_PublicVote.component.html',
  styleUrls: ['../TX.css','./TX_PublicVote.component.css'],
  providers: [TX_PublicVoteService]
})
export class TX_PublicVoteComponent implements OnInit {

  myForm: FormGroup;

  private openElections = [];
  private activeIndex = 0;
  private activeChoices = [];
  private Transaction;
  private currentParticipant;
  private currentId;
  private errorMessage;

  choice = new FormControl('', Validators.required);
  election = new FormControl('', Validators.required);
  voter = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTX_PublicVote: TX_PublicVoteService, fb: FormBuilder, private serviceElection: DataService<Election>, private serviceSpinner: NgxSpinnerService, private serviceIdentity: IdentityService) {
    this.myForm = fb.group({
      choice: this.choice,
      election: this.election,
      voter: this.voter,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadElections();
    this.loadParticipant();
  }

  loadElections(): Promise<any> {
    this.serviceSpinner.show();
    const tempList = [];
    return this.serviceElection.getAll('Election')
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.filter((r)=>r.closed==false).forEach((d)=>tempList.push(d));
      this.openElections = tempList;
      if(this.openElections.length > 0){
        this.selectElection(0);
      }
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

  loadParticipant(): Promise<any> {
    this.serviceSpinner.show();
    const tempList = [];
    return this.serviceIdentity.getCurrentParticipant()
    .toPromise()
    .then((result) => {
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
  
  selectElection(i): void{
    this.activeIndex = i;
    console.log(this.openElections[i]);
    this.activeChoices = this.openElections[i].options;
    console.log(this.activeChoices);
  }

  selectWritein(): void {
    $( "#writeinInput" ).prop("disabled",false);
  }

  deselectWritein(): void {
    $( "#writeinInput" ).prop("disabled",true);
  }

  addTransaction(form: any): Promise<any> {
    this.serviceSpinner.show();
    let electionIdentifier = "org.agora.net.Election#".concat(this.openElections[this.activeIndex].electionID);
    let choice = "";
    if($( "#writeinRadio" ).prop("checked")){
      choice = $( "input[name='writein']" )[0].value;
    }
    else if($( "input[name='choice']:checked" ).length > 0){
      choice = $( "input[name='choice']:checked" ).val();
    }
    this.Transaction = {
      $class: 'org.agora.net.TX_PublicVote',
      'choice': choice,
      'election': electionIdentifier,
      'voter': this.currentParticipant,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'choice': null,
      'election': null,
      'voter': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTX_PublicVote.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'choice': null,
        'election': null,
        'voter': null,
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

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceTX_PublicVote.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'choice': null,
        'election': null,
        'voter': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.choice) {
        formObject.choice = result.choice;
      } else {
        formObject.choice = null;
      }

      if (result.election) {
        formObject.election = result.election;
      } else {
        formObject.election = null;
      }

      if (result.voter) {
        formObject.voter = result.voter;
      } else {
        formObject.voter = null;
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
    this.selectElection(0);
    if($( "input[name='choice']:checked" ).length >0 ){
      $( "input[name='choice']:checked" ).prop("checked",false);
    }
    this.myForm.setValue({
      'choice': null,
      'election': null,
      'voter': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
