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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { IdentityGuard } from './identity.guard';
import { TypeGuard } from './type.guard';

import { HomeComponent } from './home/home.component';
import { IdentityComponent } from './identity/identity.component';
import { SuccessComponent } from './home/success.component';

import { ElectionComponent } from './Election/Election.component';
import { VoteComponent } from './Vote/Vote.component';
import { EnvelopeComponent } from './Envelope/Envelope.component';
import { RestrictionComponent } from './Restriction/Restriction.component';

import { CurrentComponent } from './Current/Current.component';
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
import { ErrorComponent } from './home/error.component';
import { LogOutComponent } from './home/logout.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path:'success', component: SuccessComponent},
  { path:'error', component: ErrorComponent},
  { path:'logout', component: LogOutComponent},
  { path: 'identity', component: IdentityComponent, canActivate: [AuthGuard]},
  { path: 'Election', component: ElectionComponent, canActivate: [AuthGuard, IdentityGuard]  },
  { path: 'Vote', component: VoteComponent, canActivate: [AuthGuard, IdentityGuard]  },
  { path: 'Envelope', component: EnvelopeComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'Restriction', component: RestrictionComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard] },
  { path: 'Current', component: CurrentComponent, canActivate: [AuthGuard, IdentityGuard] },
  { path: 'CurrentCitizen', component: CurrentCitizenComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard] },
  { path: 'CurrentPolitician', component: CurrentPoliticianComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard] },
  { path: 'CurrentLegislator', component: CurrentLegislatorComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'Politician', component: PoliticianComponent, canActivate: [AuthGuard, IdentityGuard]  },
  { path: 'Legislator', component: LegislatorComponent, canActivate: [AuthGuard, IdentityGuard]  },
  { path: 'TX_Trust', component: TX_TrustComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_AddRestriction', component: TX_AddRestrictionComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_RemoveRestriction', component: TX_RemoveRestrictionComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard] },
  { path: 'TX_Nulltrust', component: TX_NulltrustComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_CreateElection', component: TX_CreateElectionComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_OpenElection', component: TX_OpenElectionComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_CloseElection', component: TX_CloseElectionComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_PublicVote', component: TX_PublicVoteComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_PrepareEnvelope', component: TX_PrepareEnvelopeComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: 'TX_SecretVote', component: TX_SecretVoteComponent, canActivate: [AuthGuard, IdentityGuard, TypeGuard]  },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: [AuthGuard, IdentityGuard, TypeGuard]
})
export class AppRoutingModule { }
