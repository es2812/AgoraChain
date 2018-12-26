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

import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Person } from '../org.agora.net';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class CurrentService {

  constructor(private dataService: DataService<Person>) {
  };

  public getParticipant(full:string): Observable<Person> {
    let fs = full.split('.')[3].split('#');
    let ns = fs[0];
    let id = fs[1];
    return this.dataService.getSingle(ns, id);
  }

  public updateParticipant(ns:string, id: any, itemToUpdate: any): Observable<Person> {
    return this.dataService.update(ns, id, itemToUpdate);
  }

}
