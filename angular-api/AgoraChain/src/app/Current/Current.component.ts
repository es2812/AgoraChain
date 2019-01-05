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


import { Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
@Component({
    selector: 'app-legislator',
    templateUrl: './Current.component.html'
  })
export class CurrentComponent implements OnInit {
    
    constructor(private router: Router) {};
    
    ngOnInit(): void {
        let type = localStorage.getItem('currentType');
        if(type=='Citizen'){
            this.router.navigateByUrl('/CurrentCitizen');
        }
        else if(type=='Legislator'){
            this.router.navigateByUrl('/CurrentLegislator');
        }
        else if(type=='Politician'){
            this.router.navigateByUrl('/CurrentPolitician');
        }
    }
    
}