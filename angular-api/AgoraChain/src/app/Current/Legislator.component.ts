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
import { CurrentService } from './Current.service';
import 'rxjs/add/operator/toPromise';
import { IdentityService } from 'app/identity/identity.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-legislator',
  templateUrl: './Legislator.component.html',
  styleUrls: ['./Current.component.css'],
  providers: [CurrentService]
})
export class CurrentLegislatorComponent implements OnInit {
    myForm: FormGroup;

    private participant;
    private currentId;
    private errorMessage;
  
    id = new FormControl('', Validators.required);
    name = new FormControl('', Validators.required);
    lastname = new FormControl('', Validators.required);
  
  
    constructor(private identityService: IdentityService, private serviceLegislator: CurrentService, fb: FormBuilder, private serviceSpinner: NgxSpinnerService) {
      this.myForm = fb.group({
        id: this.id,
        name: this.name,
        lastname: this.lastname
      });
    };
  
    ngOnInit(): void {
      this.load();
    }
  
    load(): Promise<any> {
      this.serviceSpinner.show();
      return this.identityService.getCurrentParticipant()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        return this.serviceLegislator.getParticipant(result).toPromise()
        .then((result)=>{
          this.participant = result;
          this.serviceSpinner.hide();
        })
        .catch((error) => {
          if (error === 'Server error') {
            this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
          } else if (error === '404 - Not Found') {
            this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
            this.errorMessage = error;
          }
          this.serviceSpinner.hide();
        });
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
          this.errorMessage = error;
        }
        this.serviceSpinner.hide();
      });
    }
  
    updateParticipant(form: any): Promise<any> {
      this.serviceSpinner.show();
      this.participant = {
        $class: 'org.agora.net.Legislator',
        'name': this.name.value,
        'lastname': this.lastname.value
      };
  
      return this.serviceLegislator.updateParticipant('Legislator',form.get('id').value, this.participant)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.serviceSpinner.hide();
        this.load();
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
  
    getForm(id: any): Promise<any> {
      
      this.serviceSpinner.show();
      return this.serviceLegislator.getParticipant('org.agora.net.Legislator#'+id)
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        const formObject = {
          'id': null,
          'name': null,
          'lastname': null
        };
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
        this.serviceSpinner.hide();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
        this.serviceSpinner.hide();
      });
  
    }
}