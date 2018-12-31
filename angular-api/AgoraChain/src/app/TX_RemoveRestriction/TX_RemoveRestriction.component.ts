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
import { TX_RemoveRestrictionService } from './TX_RemoveRestriction.service';
import 'rxjs/add/operator/toPromise';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'app/data.service';
import { Restriction } from 'app/org.agora.net';

@Component({
  selector: 'app-tx_removerestriction',
  templateUrl: './TX_RemoveRestriction.component.html',
  styleUrls: ['../TX.css'],
  providers: [TX_RemoveRestrictionService]
})
export class TX_RemoveRestrictionComponent implements OnInit {

  myForm: FormGroup;

  private allRestrictions = [];
  private Transaction;
  private currentId;
  private errorMessage;

  restriction = new FormControl('', Validators.required);

  constructor(private serviceTX_RemoveRestriction: TX_RemoveRestrictionService, fb: FormBuilder, private spinnerService:NgxSpinnerService, private serviceRestriction: DataService<Restriction>) {
    this.myForm = fb.group({
      restriction: this.restriction
    });
  };

  ngOnInit(): void {
  }

  loadRestrictions(): Promise<any> {
    this.spinnerService.show();
    const tempList = [];
    return this.serviceRestriction.getAll('Restriction')
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(r => {
        tempList.push(r);
      });
      this.allRestrictions = tempList;
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
      this.spinnerService.hide();
    });
  }

  addTransaction(form: any): Promise<any> {
    this.spinnerService.show();
    let restrictionIdentifier = "org.agora.net.Restriction#".concat(this.restriction.value);
    this.Transaction = {
      $class: 'org.agora.net.TX_RemoveRestriction',
      'restriction': restrictionIdentifier,
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_RemoveRestriction.addTransaction(this.Transaction)
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
    let id = "";
    if(this.allRestrictions.length>0){
      id = this.allRestrictions[0].restrictionID;
    }
    this.myForm.setValue({
      'restriction': id
    });
  }
}
