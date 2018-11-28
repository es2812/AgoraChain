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

'use strict';

/**
 * Implementation of the trust transaction.
 * @param {org.agora.net.TX_Trust} trustTransaction
 * @transaction
 */
async function trustTransaction(tx) {
    //Should we check types?
    //The issuer can add a series of restrictions in the following format:
    //[Trusted won't vote option P in elections with category K]
    //We leave this TODO for now

    const NS = 'org.agora.net';
    //We check if the Representation asset exists
    const representationRegistry = await getAssetRegistry(NS+'.Representation');
    //The way Representation is indexed, we'll find it under the same ID as the trustee (unique for trustee)
    check = await representationRegistry.exists(tx.trustee.getIdentifier());
    if(check){
        console.log("Representation#"+tx.trustee.getIdentifier()+" exists");
        rep = await representationRegistry.get(tx.trustee.getIdentifier());
        rep.trusted = tx.trusted;
        await representationRegistry.update(rep);
        console.log("Representation#"+rep.getIdentifier()+" updated");
    }
    else{
        console.log("Representation#"+tx.trustee.getIdentifier()+" exists");
        //We create it
        const factory = await getFactory();
        rep = factory.newResource(NS,'Representation',tx.trustee.getIdentifier());
        rep.trustee = tx.trustee;
        rep.trusted = tx.trusted;
        await representationRegistry.add(rep);
        console.log("Representation#"+rep.getIdentifier()+" added");
    }    
}

/**
 * Implementation of the null trust transaction.
 * @param {org.agora.net.TX_Nulltrust} nullTrustTransaction
 * @transaction
 */
async function nullTrustTransaction(tx){
    let id = tx.representationToNull.getIdentifier();
    const NS = 'org.agora.net';
    var representationRegistry = await getAssetRegistry(NS+'.Representation');
    //we remove the given representation
    await representationRegistry.remove(tx.representationToNull);
    console.log("Representation#"+id+" deleted");
}

/**
 * Demo that creates some participants for testing purposes.
 * @param {org.agora.net.SampleDemo} sampleDemo
 * @transaction
 */
async function sampleDemo(tx) {
    const factory = await getFactory();
    const NS = 'org.agora.net';
    //creating a couple of sample citizens
    var alicia = factory.newResource(NS,'Citizen','Alicia');
    var eli = factory.newResource(NS,'Citizen','Eli');
    alicia.name = 'Alicia Florrick';
    eli.name = 'Eli Gold';

    var participantRegistry = await getParticipantRegistry(NS+'.Citizen');
    // Update the participant in the participant registry.
    await participantRegistry.addAll([alicia,eli]);
    
    //creating sample legislator
    var diane = factory.newResource(NS,'Legislator','Diane');
    diane.name = 'Diane Lockhart';
    participantRegistry = await getParticipantRegistry(NS+'.Legislator');
    // Update the participant in the participant registry.
    await participantRegistry.add(diane);

    //creating sample politicians
    var peter = factory.newResource(NS,'Politician','Peter');
    peter.name = 'Peter Florrick';
    peter.info = 'I have morals for days!';
    var will = factory.newResource(NS,'Politician','Will');
    will.name = 'Will Gardner';
    participantRegistry = await getParticipantRegistry(NS+'.Politician');
    // Update the participant in the participant registry.
    await participantRegistry.addAll([peter,will]);

}

