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
import { TX_NulltrustService } from './TX_Nulltrust.service';
import 'rxjs/add/operator/toPromise';
import { IdentityService } from 'app/identity/identity.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tx_nulltrust',
  templateUrl: './TX_Nulltrust.component.html',
  styleUrls: ['../TX.css'],
  providers: [TX_NulltrustService]
})
export class TX_NulltrustComponent implements OnInit {

  private currentRepresented;
  private Transaction;
  private currentId;
  private errorMessage;


  constructor(private serviceTX_Nulltrust: TX_NulltrustService, private loadService: NgxSpinnerService, private identityService:IdentityService) {};

  ngOnInit(): void {
    this.loadRepresented();
  }

  loadRepresented(): Promise<any>{
    this.loadService.show();
    return this.identityService.getCurrentParticipant().toPromise()
    .then((result)=>{
      this.currentRepresented = result
      this.loadService.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
      this.loadService.hide();
    });
  }
  
  addTransaction(): Promise<any> {
    this.loadService.show();
    this.Transaction = {
      $class: 'org.agora.net.TX_Nulltrust',
      'representedToNull': this.currentRepresented,
      'transactionId': null,
      'timestamp': null
    };

    return this.serviceTX_Nulltrust.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadService.hide();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
      this.loadService.hide();
    });
  }
}
