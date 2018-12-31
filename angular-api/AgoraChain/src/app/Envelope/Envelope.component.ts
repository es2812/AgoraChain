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
import { EnvelopeService } from './Envelope.service';
import 'rxjs/add/operator/toPromise';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'app/data.service';
import { Election, Vote } from 'app/org.agora.net';

@Component({
  selector: 'app-envelope',
  templateUrl: './Envelope.component.html',
  styleUrls: ['./Envelope.component.css'],
  providers: [EnvelopeService]
})
export class EnvelopeComponent implements OnInit {


  private allAssets = [];
  private asset;
  private currentId;
  private errorMessage;


  constructor(public serviceEnvelope: EnvelopeService, private serviceSpinner: NgxSpinnerService, private serviceElection: DataService<Election>, private serviceVote: DataService<Vote>) {

  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    this.serviceSpinner.show();
    const tempList = [];
    return this.serviceEnvelope.getAll()
    .toPromise()
    .then((result) => {
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
      this.loadElections();
      this.loadVotes();
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

  loadElections(): Promise<any> {
    this.serviceSpinner.show();
    return this.serviceElection.getAll('Election')
    .toPromise()
    .then((result)=> {
      this.allAssets.forEach((env)=>{
        let electionId = env.election.toString().split('#')[1];
        let election = result.filter(r=>r.electionID == electionId)[0];
        if(election.closed == true){
          env.election = null;
        }
        else {
          env.election = election;
        }
      })
      this.allAssets = this.allAssets.filter((e)=> e.election != null); //we remove the envelopes whose elections are closed
      this.serviceSpinner.hide();
    })
  }


  loadVotes(): Promise<any> {
    this.serviceSpinner.show();
    return this.serviceVote.getAll('Vote').toPromise()
    .then((result)=>{
      this.errorMessage = null;
      this.allAssets.forEach((env)=>{
        if(env.vote != null){
          let voteId = env.vote.toString().split('#')[1];
          env.vote = result.filter(v=>v.voteID == voteId)[0];
        }
      })
      this.serviceSpinner.hide();
    })
  }
}
