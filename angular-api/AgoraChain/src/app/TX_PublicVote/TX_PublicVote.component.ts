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
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-tx_publicvote',
  templateUrl: './TX_PublicVote.component.html',
  styleUrls: ['./TX_PublicVote.component.css'],
  providers: [TX_PublicVoteService]
})
export class TX_PublicVoteComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  choice = new FormControl('', Validators.required);
  election = new FormControl('', Validators.required);
  voter = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceTX_PublicVote: TX_PublicVoteService, fb: FormBuilder) {
    this.myForm = fb.group({
      choice: this.choice,
      election: this.election,
      voter: this.voter,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTX_PublicVote.getAll()
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
      $class: 'org.agora.net.TX_PublicVote',
      'choice': this.choice.value,
      'election': this.election.value,
      'voter': this.voter.value,
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
      $class: 'org.agora.net.TX_PublicVote',
      'choice': this.choice.value,
      'election': this.election.value,
      'voter': this.voter.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceTX_PublicVote.updateTransaction(form.get('transactionId').value, this.Transaction)
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

    return this.serviceTX_PublicVote.deleteTransaction(this.currentId)
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
    this.myForm.setValue({
      'choice': null,
      'election': null,
      'voter': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
