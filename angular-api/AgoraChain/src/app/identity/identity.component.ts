
import { Component, OnInit } from '@angular/core';
import { IdentityService } from './identity.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Card } from '../card';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({templateUrl: 'identity.component.html',
            styleUrls: ['identity.component.css']})
export class IdentityComponent implements OnInit {

    importForm: FormGroup;

    private allCards:Array<Card>;
    private errorMessage:string;
    allowImport:boolean = false;

    constructor(private identityService:IdentityService, private formBuilder: FormBuilder, private router: Router) {
        this.allCards = [];
    }

    ngOnInit():void {
        this.loadIdentities();
        this.importForm = this.formBuilder.group({
            file: null
        });
    }

    loadIdentities(): Promise<any> {
        this.allCards = [];
        return this.identityService.getIdentities().toPromise().then((data) => {
            this.errorMessage = null;
            data.forEach(c => {
                let card = new Card();
                card.name = c.name;
                card.default = c.default;
                this.allCards.push(card);
            });
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

    trackyByCard(index:number, card:Card): string{
        return card.name;
    }

    selectCard(card){

        this.allCards.forEach(c => {
            c.default = false;
        });

        card.default = true;
    }

    fileToUpload: File = null;
    handleFileInput(files: FileList){
        this.fileToUpload = files.item(0);
        //allow import
        this.allowImport = true;
    }

    get f() { return this.importForm.controls; }

    onSubmit() {
        if(this.importForm.invalid){
            return;
        }
        this.identityService.importIdentity(this.fileToUpload).toPromise()
          .catch((error) => {
            if (error === 'Server error') {
              this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
            } else if (error === '404 - Not Found') {
              this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
              this.errorMessage = error;
            }
          });;
        window.location.reload();
    }

    useIdentity(): Promise<any> {
        let selected = this.allCards.filter(c=>c.default==true)[0];

        return this.identityService.useIdentity(selected).toPromise()
        .then(
            ()=> {
                localStorage.setItem('currentIdentity',selected.name);
                window.location.reload();
                this.router.navigateByUrl('/Citizen');
            }
        )
        .catch((error) => {
            if (error === 'Server error') {
              this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
            } else if (error === '404 - Not Found') {
              this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
              this.errorMessage = error;
            }
          });
    }
}