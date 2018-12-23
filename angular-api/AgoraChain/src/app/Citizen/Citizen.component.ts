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
import { CitizenService } from './Citizen.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-citizen',
  templateUrl: './Citizen.component.html',
  styleUrls: ['./Citizen.component.css'],
  providers: [CitizenService]
})
export class CitizenComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  representation = new FormControl('', Validators.required);
  id = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  lastname = new FormControl('', Validators.required);


  constructor(public serviceCitizen: CitizenService, fb: FormBuilder) {
    this.myForm = fb.group({
      representation: this.representation,
      id: this.id,
      name: this.name,
      lastname: this.lastname
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCitizen.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.agora.net.Citizen',
      'representation': this.representation.value,
      'id': this.id.value,
      'name': this.name.value,
      'lastname': this.lastname.value
    };

    this.myForm.setValue({
      'representation': null,
      'id': null,
      'name': null,
      'lastname': null
    });

    return this.serviceCitizen.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'representation': null,
        'id': null,
        'name': null,
        'lastname': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.agora.net.Citizen',
      'representation': this.representation.value,
      'name': this.name.value,
      'lastname': this.lastname.value
    };

    return this.serviceCitizen.updateParticipant(form.get('id').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceCitizen.deleteParticipant(this.currentId)
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

    return this.serviceCitizen.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'representation': null,
        'id': null,
        'name': null,
        'lastname': null
      };

      if (result.representation) {
        formObject.representation = result.representation;
      } else {
        formObject.representation = null;
      }

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.lastname) {
        formObject.lastname = result.lastname;
      } else {
        formObject.lastname = null;
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
      'representation': null,
      'id': null,
      'name': null,
      'lastname': null
    });
  }
}
