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

@Component({
  selector: 'app-vote',
  templateUrl: './Vote.component.html',
  styleUrls: ['./Vote.component.css'],
  providers: [VoteService]
})
export class VoteComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  voteID = new FormControl('', Validators.required);
  choice = new FormControl('', Validators.required);
  election = new FormControl('', Validators.required);
  voter = new FormControl('', Validators.required);

  constructor(public serviceVote: VoteService, fb: FormBuilder) {
    this.myForm = fb.group({
      voteID: this.voteID,
      choice: this.choice,
      election: this.election,
      voter: this.voter
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceVote.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.agora.net.Vote',
      'voteID': this.voteID.value,
      'choice': this.choice.value,
      'election': this.election.value,
      'voter': this.voter.value
    };

    this.myForm.setValue({
      'voteID': null,
      'choice': null,
      'election': null,
      'voter': null
    });

    return this.serviceVote.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'voteID': null,
        'choice': null,
        'election': null,
        'voter': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.agora.net.Vote',
      'choice': this.choice.value,
      'election': this.election.value,
      'voter': this.voter.value
    };

    return this.serviceVote.updateAsset(form.get('voteID').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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


  deleteAsset(): Promise<any> {

    return this.serviceVote.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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

    return this.serviceVote.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'voteID': null,
        'choice': null,
        'election': null,
        'voter': null
      };

      if (result.voteID) {
        formObject.voteID = result.voteID;
      } else {
        formObject.voteID = null;
      }

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
      'voteID': null,
      'choice': null,
      'election': null,
      'voter': null
      });
  }

}
