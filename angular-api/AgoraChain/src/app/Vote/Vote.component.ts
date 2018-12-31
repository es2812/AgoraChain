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
import { VoteService } from './Vote.service';
import 'rxjs/add/operator/toPromise';
import { DataService } from 'app/data.service';
import { Election, Politician } from 'app/org.agora.net';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vote',
  templateUrl: './Vote.component.html',
  styleUrls: ['./Vote.component.css'],
  providers: [VoteService]
})
export class VoteComponent implements OnInit {

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  constructor(public serviceVote: VoteService, private serviceElection: DataService<Election>, private serviceSpinner: NgxSpinnerService,
    private servicePolitician: DataService<Politician>) {
    
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    this.serviceSpinner.show();
    const tempList = [];
    return this.serviceVote.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
      this.loadElections();
      this.loadVoters();
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
    return this.serviceElection.getAll('Election').toPromise()
    .then((el)=>{
      this.allAssets.forEach((v)=>{
          let electionId = v.election.toString().split('#')[1];
          v.election = el.filter((e)=> e.electionID == electionId)[0];
      })
      this.serviceSpinner.hide();
    })
  }

  loadVoters(): Promise<any> {
    this.serviceSpinner.show();
    return this.servicePolitician.getAll('Politician').toPromise()
    .then((p)=>{
      this.allAssets.forEach((v)=>{
        if(v.voter != null){
          let voterId = v.voter.toString().split('#')[1];
          v.voter = p.filter((pol)=>pol.id == voterId)[0];
        }
      })
      this.serviceSpinner.hide();
    })
  }

}
