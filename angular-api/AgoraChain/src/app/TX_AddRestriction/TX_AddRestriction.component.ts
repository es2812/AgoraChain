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
import { TX_AddRestrictionService } from './TX_AddRestriction.service';
import 'rxjs/add/operator/toPromise';
import { Restriction, Citizen } from 'app/org.agora.net';
import { DataService } from 'app/data.service';
import { IdentityService } from 'app/identity/identity.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tx_addrestriction',
  templateUrl: './TX_AddRestriction.component.html',
  styleUrls: ['../TX.css'],
  providers: [TX_AddRestrictionService]
})
export class TX_AddRestrictionComponent implements OnInit {

  myForm: FormGroup;

  private currentTrustee;
  private Transaction;
  private currentId;
  private errorMessage;
  private uniqueID;

  category = new FormControl('', Validators.required);
  choice = new FormControl('', Validators.required);

  constructor(private serviceTX_AddRestriction: TX_AddRestrictionService, private serviceIdentity:IdentityService, private serviceRestrictions: DataService<Restriction>, private spinnerService: NgxSpinnerService, fb: FormBuilder) {
    this.myForm = fb.group({
      category: this.category,
      choice: this.choice
    });
  };

  ngOnInit(): void {
    this.loadRepresented();
  }

  loadRepresented(): Promise<any>{
    this.spinnerService.show();
    return this.serviceIdentity.getCurrentParticipant().toPromise()
    .then((p)=>{
      this.currentTrustee = p;
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
      this.spinnerService.hide()
    });
  }

  getUniqueID(): Promise<any> {
    this.spinnerService.show();
    const tempList = [];
    return this.serviceRestrictions.getAll('Restriction')
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      //we use as deterministic ID the length+1
      this.uniqueID = tempList.length+1;   
      this.resetForm();
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
      this.spinnerService.hide()
    });
  }

  addTransaction(form: any): Promise<any> {
    this.spinnerService.show();
    this.Transaction = {
      $class: 'org.agora.net.TX_AddRestriction',
      'restrictionID': this.uniqueID,
      'category': form.get('category').value,
      'choice': form.get('choice').value,
      'trustee': this.currentTrustee,
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_AddRestriction.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.resetForm();
      this.spinnerService.hide()
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }

      this.spinnerService.hide()
    });
  }

  resetForm(): void {
    this.myForm.reset();
  }
}
