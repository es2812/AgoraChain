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
import { RestrictionService } from './Restriction.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-restriction',
  templateUrl: './Restriction.component.html',
  styleUrls: ['./Restriction.component.css'],
  providers: [RestrictionService]
})
export class RestrictionComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  restrictionID = new FormControl('', Validators.required);
  category = new FormControl('', Validators.required);
  choice = new FormControl('', Validators.required);
  trustee = new FormControl('', Validators.required);

  constructor(public serviceRestriction: RestrictionService, fb: FormBuilder) {
    this.myForm = fb.group({
      restrictionID: this.restrictionID,
      category: this.category,
      choice: this.choice,
      trustee: this.trustee
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceRestriction.getAll()
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
      $class: 'org.agora.net.Restriction',
      'restrictionID': this.restrictionID.value,
      'category': this.category.value,
      'choice': this.choice.value,
      'trustee': this.trustee.value
    };

    this.myForm.setValue({
      'restrictionID': null,
      'category': null,
      'choice': null,
      'trustee': null
    });

    return this.serviceRestriction.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'restrictionID': null,
        'category': null,
        'choice': null,
        'trustee': null
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
      $class: 'org.agora.net.Restriction',
      'category': this.category.value,
      'choice': this.choice.value,
      'trustee': this.trustee.value
    };

    return this.serviceRestriction.updateAsset(form.get('restrictionID').value, this.asset)
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

    return this.serviceRestriction.deleteAsset(this.currentId)
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

    return this.serviceRestriction.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'restrictionID': null,
        'category': null,
        'choice': null,
        'trustee': null
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
      'restrictionID': null,
      'category': null,
      'choice': null,
      'trustee': null
      });
  }

}
