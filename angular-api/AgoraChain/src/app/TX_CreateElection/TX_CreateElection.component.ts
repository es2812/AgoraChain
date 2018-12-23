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
import { TX_CreateElectionService } from './TX_CreateElection.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-tx_createelection',
  templateUrl: './TX_CreateElection.component.html',
  styleUrls: ['./TX_CreateElection.component.css'],
  providers: [TX_CreateElectionService]
})
export class TX_CreateElectionComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  electionID = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  options = new FormControl('', Validators.required);
  category = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTX_CreateElection: TX_CreateElectionService, fb: FormBuilder) {
    this.myForm = fb.group({
      electionID: this.electionID,
      description: this.description,
      options: this.options,
      category: this.category,
      owner: this.owner,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
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
    this.Transaction = {
      $class: 'org.agora.net.TX_CreateElection',
      'electionID': this.electionID.value,
      'description': this.description.value,
      'options': this.options.value,
      'category': this.category.value,
      'owner': this.owner.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'electionID': null,
      'description': null,
      'options': null,
      'category': null,
      'owner': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTX_CreateElection.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'electionID': null,
        'description': null,
        'options': null,
        'category': null,
        'owner': null,
        'transactionId': null,
        'timestamp': null
      });
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
      $class: 'org.agora.net.TX_CreateElection',
      'electionID': this.electionID.value,
      'description': this.description.value,
      'options': this.options.value,
      'category': this.category.value,
      'owner': this.owner.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceTX_CreateElection.updateTransaction(form.get('transactionId').value, this.Transaction)
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

    return this.serviceTX_CreateElection.deleteTransaction(this.currentId)
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

    return this.serviceTX_CreateElection.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'electionID': null,
        'description': null,
        'options': null,
        'category': null,
        'owner': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.electionID) {
        formObject.electionID = result.electionID;
      } else {
        formObject.electionID = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.options) {
        formObject.options = result.options;
      } else {
        formObject.options = null;
      }

      if (result.category) {
        formObject.category = result.category;
      } else {
        formObject.category = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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
      'electionID': null,
      'description': null,
      'options': null,
      'category': null,
      'owner': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
