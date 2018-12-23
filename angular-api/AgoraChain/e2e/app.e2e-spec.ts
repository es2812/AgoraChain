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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for AgoraChain', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be AgoraChain', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('AgoraChain');
    })
  });

  it('network-name should be agora-network@1.0.0',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('agora-network@1.0.0.bna');
    });
  });

  it('navbar-brand should be AgoraChain',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('AgoraChain');
    });
  });

  
    it('Election component should be loadable',() => {
      page.navigateTo('/Election');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Election');
      });
    });

    it('Election table should have 9 columns',() => {
      page.navigateTo('/Election');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  
    it('Vote component should be loadable',() => {
      page.navigateTo('/Vote');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Vote');
      });
    });

    it('Vote table should have 5 columns',() => {
      page.navigateTo('/Vote');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Envelope component should be loadable',() => {
      page.navigateTo('/Envelope');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Envelope');
      });
    });

    it('Envelope table should have 5 columns',() => {
      page.navigateTo('/Envelope');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Restriction component should be loadable',() => {
      page.navigateTo('/Restriction');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Restriction');
      });
    });

    it('Restriction table should have 5 columns',() => {
      page.navigateTo('/Restriction');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Citizen component should be loadable',() => {
      page.navigateTo('/Citizen');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Citizen');
      });
    });

    it('Citizen table should have 5 columns',() => {
      page.navigateTo('/Citizen');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Politician component should be loadable',() => {
      page.navigateTo('/Politician');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Politician');
      });
    });

    it('Politician table should have 5 columns',() => {
      page.navigateTo('/Politician');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Legislator component should be loadable',() => {
      page.navigateTo('/Legislator');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Legislator');
      });
    });

    it('Legislator table should have 4 columns',() => {
      page.navigateTo('/Legislator');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('TX_Trust component should be loadable',() => {
      page.navigateTo('/TX_Trust');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_Trust');
      });
    });
  
    it('TX_AddRestriction component should be loadable',() => {
      page.navigateTo('/TX_AddRestriction');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_AddRestriction');
      });
    });
  
    it('TX_RemoveRestriction component should be loadable',() => {
      page.navigateTo('/TX_RemoveRestriction');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_RemoveRestriction');
      });
    });
  
    it('TX_Nulltrust component should be loadable',() => {
      page.navigateTo('/TX_Nulltrust');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_Nulltrust');
      });
    });
  
    it('TX_CreateElection component should be loadable',() => {
      page.navigateTo('/TX_CreateElection');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_CreateElection');
      });
    });
  
    it('TX_OpenElection component should be loadable',() => {
      page.navigateTo('/TX_OpenElection');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_OpenElection');
      });
    });
  
    it('TX_CloseElection component should be loadable',() => {
      page.navigateTo('/TX_CloseElection');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_CloseElection');
      });
    });
  
    it('TX_PublicVote component should be loadable',() => {
      page.navigateTo('/TX_PublicVote');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_PublicVote');
      });
    });
  
    it('TX_PrepareEnvelope component should be loadable',() => {
      page.navigateTo('/TX_PrepareEnvelope');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_PrepareEnvelope');
      });
    });
  
    it('TX_SecretVote component should be loadable',() => {
      page.navigateTo('/TX_SecretVote');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TX_SecretVote');
      });
    });
  

});