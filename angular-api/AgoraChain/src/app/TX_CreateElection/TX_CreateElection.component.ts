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
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TX_CreateElectionService } from './TX_CreateElection.service';
import 'rxjs/add/operator/toPromise';
import { IdentityService } from 'app/identity/identity.service';
import { DataService } from 'app/data.service';
import { Election } from 'app/org.agora.net';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tx_createelection',
  templateUrl: './TX_CreateElection.component.html',
  styleUrls: ['../TX.css','./TX_CreateElection.component.css'],
  providers: [TX_CreateElectionService]
})
export class TX_CreateElectionComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;
  private currentLegislator;
  private uniqueID;

  description = new FormControl('', Validators.required);
  options = new FormArray([
    new FormControl('')]);
  category = new FormControl('', Validators.required);
  

  constructor(private serviceTX_CreateElection: TX_CreateElectionService, private fb: FormBuilder, private serviceIdentity: IdentityService,
    private serviceElection: DataService<Election>, private spinnerService: NgxSpinnerService) {
    this.myForm = fb.group({
      description: this.description,
      options: this.fb.array([ this.createOption() ]),
      category: this.category
    });
    
  };

  ngOnInit(): void {
    this.spinnerService.show();
    this.loadOwner();
    this.loadAll();
  }

  getUniqueID(): Promise<any> {
    this.spinnerService.show();
    return this.serviceElection.getAll('Election').toPromise()
    .then((result)=> {
      this.errorMessage = null;
      
      //we use as deterministic ID the length+1
      this.uniqueID = result.length+1;
      this.spinnerService.hide();
      this.resetForm();
    })
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

  loadOwner(): Promise<any> {
    return this.serviceIdentity.getCurrentParticipant().toPromise()
    .then((p)=>{
      this.currentLegislator = p;
      this.spinnerService.hide();
    })
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

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTX_CreateElection.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
    })
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

  createOption(): FormGroup {
    return this.fb.group({
      name: ''
    })
  }

  addOption(): void {
    this.options = this.myForm.get('options') as FormArray;
    this.options.push(this.createOption())
  }

  removeOption(): void {
    this.options = this.myForm.get('options') as FormArray;
    this.options.removeAt(-1);
  }

  addTransaction(form: any): Promise<any> {
    this.spinnerService.show();
    let optionsList = [];
    this.myForm.get('options').value.forEach(dat=>{optionsList.push(dat.name)});
    
    this.Transaction = {
      $class: 'org.agora.net.TX_CreateElection',
      'electionID': this.uniqueID,
      'description': this.description.value,
      'options': optionsList,
      'category': this.category.value,
      'owner': this.currentLegislator,
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_CreateElection.addTransaction(this.Transaction)
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
    });
  }

  resetForm(): void {
    this.myForm.reset();
    while(this.myForm.get('options').value.length > 1){
      this.removeOption()
    }
  }
}
