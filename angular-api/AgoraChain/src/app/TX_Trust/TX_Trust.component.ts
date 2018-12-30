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
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'app/data.service';
import { Politician, Citizen } from 'app/org.agora.net';

@Component({
  selector: 'app-tx_trust',
  templateUrl: './TX_Trust.component.html',
  styleUrls: ['../TX.css'],
  providers: [TX_TrustService]
})
export class TX_TrustComponent implements OnInit {

  myForm: FormGroup;

  private currentTrustee;
  private allPoliticians = [];
  private Transaction;
  private currentId;
  private errorMessage;

  trustee = new FormControl({value:'', disabled: true}, Validators.required);
  trusted = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceIdentity: IdentityService, private serviceTX_Trust: TX_TrustService, private trustedService: DataService<Politician>, 
    fb: FormBuilder, private spinnerService: NgxSpinnerService) {
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
      this.spinnerService.hide();
    });
  }

  loadPoliticians(): Promise<any> {
    this.spinnerService.show();
    const tempList = [];
    return this.trustedService.getAll('Politician').toPromise()
    .then( (data) =>
    {
      this.errorMessage = null;
      data.forEach(p => {
        tempList.push(p);
      })
      this.allPoliticians = tempList;
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
    this.spinnerService.show()
    let trustedIdentification = "org.agora.net.Politician".concat("#",this.trusted.value);
    
    this.Transaction = {
      $class: 'org.agora.net.TX_Trust',
      'trustee': this.currentTrustee,
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
      this.spinnerService.hide();
    });
  }

  resetForm(): void {
    let trusted = '';
    if(this.allPoliticians.length > 0){
      trusted = this.allPoliticians[0].id;
    }
    this.myForm.setValue({
      'trustee': this.currentTrustee,
      'trusted': trusted,
      'transactionId': null,
      'timestamp': null
    });
  }
}
