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
import { ElectionService } from './Election.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-election',
  templateUrl: './Election.component.html',
  styleUrls: ['./Election.component.css'],
  providers: [ElectionService]
})
export class ElectionComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  electionID = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  category = new FormControl('', Validators.required);
  options = new FormControl('', Validators.required);
  writeins = new FormControl('', Validators.required);
  results = new FormControl('', Validators.required);
  closed = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceElection: ElectionService, fb: FormBuilder) {
    this.myForm = fb.group({
      electionID: this.electionID,
      description: this.description,
      category: this.category,
      options: this.options,
      writeins: this.writeins,
      results: this.results,
      closed: this.closed,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceElection.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList.filter((e)=>e.closed);
      console.log(this.allAssets);
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
      $class: 'org.agora.net.Election',
      'electionID': this.electionID.value,
      'description': this.description.value,
      'category': this.category.value,
      'options': this.options.value,
      'writeins': this.writeins.value,
      'results': this.results.value,
      'closed': this.closed.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'electionID': null,
      'description': null,
      'category': null,
      'options': null,
      'writeins': null,
      'results': null,
      'closed': null,
      'owner': null
    });

    return this.serviceElection.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'electionID': null,
        'description': null,
        'category': null,
        'options': null,
        'writeins': null,
        'results': null,
        'closed': null,
        'owner': null
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
      $class: 'org.agora.net.Election',
      'description': this.description.value,
      'category': this.category.value,
      'options': this.options.value,
      'writeins': this.writeins.value,
      'results': this.results.value,
      'closed': this.closed.value,
      'owner': this.owner.value
    };

    return this.serviceElection.updateAsset(form.get('electionID').value, this.asset)
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

    return this.serviceElection.deleteAsset(this.currentId)
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

    return this.serviceElection.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'electionID': null,
        'description': null,
        'category': null,
        'options': null,
        'writeins': null,
        'results': null,
        'closed': null,
        'owner': null
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

      if (result.category) {
        formObject.category = result.category;
      } else {
        formObject.category = null;
      }

      if (result.options) {
        formObject.options = result.options;
      } else {
        formObject.options = null;
      }

      if (result.writeins) {
        formObject.writeins = result.writeins;
      } else {
        formObject.writeins = null;
      }

      if (result.results) {
        formObject.results = result.results;
      } else {
        formObject.results = null;
      }

      if (result.closed) {
        formObject.closed = result.closed;
      } else {
        formObject.closed = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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
      'category': null,
      'options': null,
      'writeins': null,
      'results': null,
      'closed': null,
      'owner': null
      });
  }

}
