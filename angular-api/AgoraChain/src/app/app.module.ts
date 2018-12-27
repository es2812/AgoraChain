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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { IdentityComponent } from './identity/identity.component'

import { ElectionComponent } from './Election/Election.component';
import { VoteComponent } from './Vote/Vote.component';
import { EnvelopeComponent } from './Envelope/Envelope.component';
import { RestrictionComponent } from './Restriction/Restriction.component';

import { CurrentCitizenComponent } from './Current/Citizen.component';
import { CurrentPoliticianComponent } from './Current/Politician.component';
import { CurrentLegislatorComponent } from './Current/Legislator.component';


import { PoliticianComponent } from './Politician/Politician.component';
import { LegislatorComponent } from './Legislator/Legislator.component';

import { TX_TrustComponent } from './TX_Trust/TX_Trust.component';
import { TX_AddRestrictionComponent } from './TX_AddRestriction/TX_AddRestriction.component';
import { TX_RemoveRestrictionComponent } from './TX_RemoveRestriction/TX_RemoveRestriction.component';
import { TX_NulltrustComponent } from './TX_Nulltrust/TX_Nulltrust.component';
import { TX_CreateElectionComponent } from './TX_CreateElection/TX_CreateElection.component';
import { TX_OpenElectionComponent } from './TX_OpenElection/TX_OpenElection.component';
import { TX_CloseElectionComponent } from './TX_CloseElection/TX_CloseElection.component';
import { TX_PublicVoteComponent } from './TX_PublicVote/TX_PublicVote.component';
import { TX_PrepareEnvelopeComponent } from './TX_PrepareEnvelope/TX_PrepareEnvelope.component';
import { TX_SecretVoteComponent } from './TX_SecretVote/TX_SecretVote.component';
import { IdentityService } from './identity/identity.service';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IdentityComponent,
    ElectionComponent,
    VoteComponent,
    EnvelopeComponent,
    RestrictionComponent,
    CurrentCitizenComponent,
    CurrentPoliticianComponent,
    CurrentLegislatorComponent,
    PoliticianComponent,
    LegislatorComponent,
    TX_TrustComponent,
    TX_AddRestrictionComponent,
    TX_RemoveRestrictionComponent,
    TX_NulltrustComponent,
    TX_CreateElectionComponent,
    TX_OpenElectionComponent,
    TX_CloseElectionComponent,
    TX_PublicVoteComponent,
    TX_PrepareEnvelopeComponent,
    TX_SecretVoteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinner
  ],
  providers: [
    DataService,
    IdentityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
