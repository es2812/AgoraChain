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

import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import * as sinon from 'sinon';
import { DataService } from '../data.service';
import { ElectionComponent } from './Election.component';
import { ElectionService } from './Election.service';
import { Observable } from 'rxjs'

describe('ElectionComponent', () => {
  let component: ElectionComponent;
  let fixture: ComponentFixture<ElectionComponent>;

  let mockElectionService;
  let mockDataService

  beforeEach(async(() => {

    mockElectionService = sinon.createStubInstance(ElectionService);
    mockElectionService.getAll.returns([]);
    mockDataService = sinon.createStubInstance(DataService);

    TestBed.configureTestingModule({
      declarations: [ ElectionComponent ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
      ],
      providers: [
        {provide: ElectionService, useValue: mockElectionService },
        {provide: DataService, useValue: mockDataService },
      ]
    });

    fixture = TestBed.createComponent(ElectionComponent);
    component = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the table when a Election is added', fakeAsync(() => {
    let loadAllSpy = sinon.stub(component, 'loadAll');
    sinon.stub(component.serviceElection, 'addAsset').returns(new Observable<any>(observer => {
      observer.next('');
      observer.complete();
    }));

    component.addAsset({});

    tick();
    
    expect(loadAllSpy.callCount).toBe(1);

    loadAllSpy.restore();
  }));

  it('should update the table when a Election is updated', fakeAsync(() => {
    let loadAllSpy = sinon.stub(component, 'loadAll');
    sinon.stub(component.serviceElection, 'updateAsset').returns(new Observable<any>(observer => {
      observer.next('');
      observer.complete();
    }));

    // mock form to be passed to the update function
    let mockForm = new FormGroup({
      electionID: new FormControl('id')
    });

    component.updateAsset(mockForm);

    tick();

    expect(loadAllSpy.callCount).toBe(1);

    loadAllSpy.restore();
  }));

  it('should update the table when a Election is deleted', fakeAsync(() => {
    let loadAllSpy = sinon.stub(component, 'loadAll');
    sinon.stub(component.serviceElection, 'deleteAsset').returns(new Observable<any>(observer => {
      observer.next('');
      observer.complete();
    }));

    component.setId('id');
    
    component.deleteAsset();

    tick();

    expect(loadAllSpy.callCount).toBe(1);

    loadAllSpy.restore();
  }));  

});
