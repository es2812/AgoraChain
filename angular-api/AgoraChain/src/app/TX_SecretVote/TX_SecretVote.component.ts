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
import { TX_SecretVoteService } from './TX_SecretVote.service';
import $ from 'jquery';
import 'rxjs/add/operator/toPromise';
import { DataService } from 'app/data.service';
import { Election, Envelope } from 'app/org.agora.net';
import { NgxSpinnerService } from 'ngx-spinner';
import { IdentityService } from 'app/identity/identity.service';

@Component({
  selector: 'app-tx_publicvote',
  templateUrl: './TX_SecretVote.component.html',
  styleUrls: ['../TX.css','./TX_SecretVote.component.css'],
  providers: [TX_SecretVoteService]
})
export class TX_SecretVoteComponent implements OnInit {

  private electionsEnvelopes = [];
  private allEnvelopes = [];
  private activeIndex = 0;
  private activeChoices = [];

  private Transaction;
  private currentId;
  private errorMessage;

  constructor(private serviceTX_SecretVote: TX_SecretVoteService, private serviceElection: DataService<Election>, private serviceSpinner: NgxSpinnerService, private serviceEnvelope: DataService<Envelope>) {
  };

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): Promise<any> {
    this.serviceSpinner.show();
    //we get all elections
    return this.serviceElection.getAll('Election').toPromise()
    .then((e)=>{
      //we keep open elections
      let openElections = e.filter((el)=>el.closed==false);
      //we get all envelopes for participant
      return this.serviceEnvelope.getAll('Envelope').toPromise()
      .then((env)=>{
        this.errorMessage = null;
        let openElectionIdentifiers = openElections.map(e=>"resource:org.agora.net.Election#".concat(e.electionID));
        
        //we keep envelopes for open elections
        this.allEnvelopes = env.filter((v)=>openElectionIdentifiers.indexOf(v.election.toString())!=-1);
        let electionsInEnvelope = this.allEnvelopes.map((v)=>v.election.toString().split('#')[1]);
        
        //we keep elections with envelopes
        this.electionsEnvelopes = openElections.filter((v)=> electionsInEnvelope.indexOf(v.electionID)!=-1);
        
        if(this.electionsEnvelopes.length > 0){
          this.selectEnvelope(0);
        }
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

  
  selectEnvelope(i): void{
    this.activeIndex = i;
    this.activeChoices = this.electionsEnvelopes[i].options;
  }

  selectWritein(): void {
    $( "#writeinInput" ).prop("disabled",false);
  }

  deselectWritein(): void {
    $( "#writeinInput" ).prop("disabled",true);
  }

  addTransaction(): Promise<any> {
    this.serviceSpinner.show();
    let electionIdentifier = this.electionsEnvelopes.map(e=>"resource:org.agora.net.Election#".concat(e.electionID))[this.activeIndex];
    let envelope = this.allEnvelopes.filter((env)=>env.election == electionIdentifier)[0];
    let envelopeIdentifier = "org.agora.net.Envelope#".concat(envelope.envelopeID);
    let choice = "";
    if($( "#writeinRadio" ).prop("checked")){
      choice = $( "input[name='writein']" )[0].value;
    }
    else if($( "input[name='choice']:checked" ).length > 0){
      choice = $( "input[name='choice']:checked" ).val();
    }
    this.Transaction = {
      $class: 'org.agora.net.TX_SecretVote',
      'choice': choice,
      'envelope': envelopeIdentifier,
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_SecretVote.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.resetForm();
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
    this.selectEnvelope(0);
    if($( "input[name='choice']:checked" ).length >0 ){
      $( "input[name='choice']:checked" ).prop("checked",false);
    }
  }
}
