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

  restrictionID = new FormControl({value:'', disabled:true}, Validators.required);
  category = new FormControl('', Validators.required);
  choice = new FormControl('', Validators.required);
  trustee = new FormControl({value:'', disabled:true}, Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTX_AddRestriction: TX_AddRestrictionService, private serviceIdentity:IdentityService, private serviceRestrictions: DataService<Restriction>, private spinnerService: NgxSpinnerService, fb: FormBuilder) {
    this.myForm = fb.group({
      restrictionID: this.restrictionID,
      category: this.category,
      choice: this.choice,
      trustee: this.trustee,
      transactionId: this.transactionId,
      timestamp: this.timestamp
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
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the transaction field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.spinnerService.show();
    this.Transaction = {
      $class: 'org.agora.net.TX_AddRestriction',
      'restrictionID': this.restrictionID.value,
      'category': this.category.value,
      'choice': this.choice.value,
      'trustee': this.trustee.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'restrictionID': null,
      'category': null,
      'choice': null,
      'trustee': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTX_AddRestriction.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'restrictionID': null,
        'category': null,
        'choice': null,
        'trustee': null,
        'transactionId': null,
        'timestamp': null
      });
      this.spinnerService.hide()
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

    return this.serviceTX_AddRestriction.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'restrictionID': null,
        'category': null,
        'choice': null,
        'trustee': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.restrictionID) {
        formObject.restrictionID = result.restrictionID;
      } else {
        formObject.restrictionID = null;
      }

      if (result.category) {
        formObject.category = result.category;
      } else {
        formObject.category = null;
      }

      if (result.choice) {
        formObject.choice = result.choice;
      } else {
        formObject.choice = null;
      }

      if (result.trustee) {
        formObject.trustee = result.trustee;
      } else {
        formObject.trustee = null;
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
      'restrictionID': this.uniqueID,
      'category': null,
      'choice': null,
      'trustee': this.currentTrustee,
      'transactionId': null,
      'timestamp': null
    });
  }
}
