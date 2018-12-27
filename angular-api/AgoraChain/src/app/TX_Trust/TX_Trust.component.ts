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
import { TX_TrustService } from './TX_Trust.service';
import 'rxjs/add/operator/toPromise';
import { IdentityService } from 'app/identity/identity.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataService } from 'app/data.service';
import { Politician, Citizen } from 'app/org.agora.net';

@Component({
  selector: 'app-tx_trust',
  templateUrl: './TX_Trust.component.html',
  styleUrls: ['./TX_Trust.component.css'],
  providers: [TX_TrustService]
})
export class TX_TrustComponent implements OnInit {

  myForm: FormGroup;

  private currentTrustee;
  private allPoliticians;
  private Transaction;
  private currentId;
  private errorMessage;

  trustee = new FormControl({value:'', disabled: true}, Validators.required);
  trusted = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceIdentity: IdentityService, private serviceTX_Trust: TX_TrustService, private trustedService: DataService<Politician>, 
    private trusteeService: DataService<Citizen>,fb: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) {
    this.myForm = fb.group({
      trustee: this.trustee,
      trusted: this.trusted,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadTrustee();
    this.loadPoliticians();
  }

  loadTrustee(): Promise<any> {
    return this.serviceIdentity.getCurrentParticipant().toPromise()
    .then((p)=>{
      let fs = p.split('.')[3].split('#');
      return this.trusteeService.getSingle(fs[0],fs[1]).toPromise()
      .then((d)=> {
        this.currentTrustee = d;
      })
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

  loadPoliticians(): Promise<any> {
    const tempList = [];
    return this.trustedService.getAll('Politician').toPromise()
    .then( (data) =>
    {
      this.errorMessage = null;
      data.forEach(p => {
        tempList.push(p);
      })
      this.allPoliticians = tempList;
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
    this.spinnerService.show()
    
    let trusteeIdentification = "org.agora.net.Citizen".concat("#",this.currentTrustee.id);
    let trustedIdentification = "org.agora.net.Politician".concat("#",this.trusted.value);
    
    this.Transaction = {
      $class: 'org.agora.net.TX_Trust',
      'trustee': trusteeIdentification,
      'trusted': trustedIdentification,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'trustee': null,
      'trusted': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceTX_Trust.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'trustee': null,
        'trusted': null,
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

    return this.serviceTX_Trust.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'trustee': null,
        'trusted': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.trustee) {
        formObject.trustee = result.trustee;
      } else {
        formObject.trustee = null;
      }

      if (result.trusted) {
        formObject.trusted = result.trusted;
      } else {
        formObject.trusted = null;
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
      'trustee': this.currentTrustee.name.concat(" ",this.currentTrustee.lastname),
      'trusted': this.allPoliticians[0].id,
      'transactionId': null,
      'timestamp': null
    });
  }
}
