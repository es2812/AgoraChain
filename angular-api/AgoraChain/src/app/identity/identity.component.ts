
import { Component, OnInit } from '@angular/core';
import { IdentityService } from './identity.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Card } from '../card';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({templateUrl: 'identity.component.html',
            styleUrls: ['identity.component.css']})
export class IdentityComponent implements OnInit {

    importForm: FormGroup;

    private allCards:Array<Card> = [];
    private errorMessage:string;
    allowImport:boolean = false;

    constructor(private identityService:IdentityService, private formBuilder: FormBuilder, private router: Router, private spinnerService: NgxSpinnerService) {

    }

    ngOnInit():void {
        this.loadIdentities();
        this.importForm = this.formBuilder.group({
            file: null
        });
    }

    loadIdentities(): Promise<any> {
        this.spinnerService.show();
        this.allCards = [];
        return this.identityService.getIdentities().toPromise().then((data) => {
            this.errorMessage = null;
            data.forEach(c => {
                let card = new Card();
                card.name = c.name;
                card.default = c.default;
                this.allCards.push(card);
            });

            this.spinnerService.hide();
          })
          .catch((error) => {
            if (error === 'Server error') {
              this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
            } else if (error === '404 - Not Found') {
              this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
              this.errorMessage = error;
            }
            this.spinnerService.hide();
          });
    }

    trackyByCard(index:number, card:Card): string{
        return card.name;
    }

    selectCard(card){
        this.spinnerService.show();

        this.allCards.forEach(c => {
            c.default = false;
        });

        card.default = true;

        this.spinnerService.hide();
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
            .then(()=>{
                window.location.reload();
            })
            .catch((error) => {
            if (error === 'Server error') {
              this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
            } else if (error === '404 - Not Found') {
              this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
              this.errorMessage = error;
            }
            this.spinnerService.hide();
          });
    }

    useIdentity(): Promise<any> {    
        this.spinnerService.show();    
        let selected = this.allCards.filter(c=>c.default==true)[0];
        return this.identityService.useIdentity(selected).toPromise()
        .then(
        ()=> {
            this.navigateToIdentity();
        })
        .catch((error) => {
            if (error === 'Server error') {
              this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
            } else if (error === '404 - Not Found') {
              this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
              this.errorMessage = error;
            }
            this.spinnerService.hide();
          });
    }

    navigateToIdentity(): Promise<any> { 
        return this.identityService.getCurrentParticipant().toPromise()
            .then(
            (data)=>{
                let type = data.split('.')[3].split('#')[0];
                this.router.navigateByUrl('/Current');
                window.location.reload();
                this.spinnerService.hide();
            })
            .catch((error) => {
                if (error === 'Server error') {
                  this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
                } else if (error === '404 - Not Found') {
                  this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
                  this.errorMessage = error;
                }
                this.spinnerService.hide();
              });
    }
}