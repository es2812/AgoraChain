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
const NS = 'org.agora.net';
/**
 * Implementation of the trust transaction.
 * @param {org.agora.net.TX_Trust} trustTransaction
 * @transaction
 */
async function trustTransaction(tx) {
    //The issuer can add a series of restrictions in the following format:
    //[Trusted won't vote option P in elections with category K]
    //We leave this TODO for now

    //We check if the Representation asset exists
    const representationRegistry = await getAssetRegistry(NS+'.Representation');
    //The way Representation is indexed, we'll find it under the same ID as the trustee (unique for trustee)
    let check = await representationRegistry.exists(tx.trustee.getIdentifier());
    let rep;
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
    let representationRegistry = await getAssetRegistry(NS+'.Representation');
    //we remove the given representation
    await representationRegistry.remove(tx.representationToNull);
    console.log("Representation#"+id+" deleted");
}

/**
 * Implementation of the create election transaction.
 * @param {org.agora.net.TX_CreateElections} createElectionTransaction
 * @transaction
 */
async function createElectionTransacton(tx){
    //This transaction takes an id, descriptor for the elections, a list of options, a category and its owner

    const factory = await getFactory();

    let created_elections = factory.newResource(NS,'Election',tx.electionID);
    created_elections.description = tx.description;
    created_elections.options = tx.options;
    created_elections.category = tx.category;
    created_elections.owner = tx.owner;

    let electionRegistry = await getAssetRegistry(NS+'.Election');
    await electionRegistry.add(created_elections);
}

/**
 * Implementation of the open elections transaction.
 * @param {org.agora.net.TX_OpenElections} openElectionsTransaction
 * @transaction
 */
async function openElectionTransacton(tx){
    //This transaction takes the election to be opened
    if(tx.elections.closed){

        tx.elections.closed = false;

        let electionRegistry = await getAssetRegistry(NS+'.Election');
        await electionRegistry.update(tx.elections);
    }
    else{
        throw new Error(tx.elections+" is already open");
    }
}

/**
 * Implementation of the close elections transaction.
 * @param {org.agora.net.TX_CloseElections} closeElectionsTransaction
 * @transaction
 */
async function closeElectionTransacton(tx){
    //This transaction takes the election to be closed
    if(!tx.elections.closed){
        tx.elections.closed = true;

        let electionRegistry = await getAssetRegistry(NS+'.Election');
        await electionRegistry.update(tx.elections);
    }
    else{
        throw new Error(tx.elections+" is already closed");
    }
}

/**
 * Demo that creates some participants for testing purposes.
 * @param {org.agora.net.SampleDemo} sampleDemo
 * @transaction
 */
async function sampleDemo(tx) {
    const factory = await getFactory();
    //creating a couple of sample citizens
    let alicia = factory.newResource(NS,'Citizen','CT_01');
    let eli = factory.newResource(NS,'Citizen','CT_02');
    alicia.name = 'Alicia';
    alicia.lastname = 'Florrick';
    eli.name = 'Eli';
    eli.lastname = 'Gold';

    let participantRegistry = await getParticipantRegistry(NS+'.Citizen');
    // Update the participant in the participant registry.
    await participantRegistry.addAll([alicia,eli]);
    
    //creating sample legislator
    let diane = factory.newResource(NS,'Legislator','LG_01');
    diane.name = 'Diane';
    diane.lastname = 'Lockhart';
    participantRegistry = await getParticipantRegistry(NS+'.Legislator');
    // Update the participant in the participant registry.
    await participantRegistry.add(diane);

    //creating sample politicians
    let peter = factory.newResource(NS,'Politician','PL_01');
    peter.name = 'Peter';
    peter.lastname = 'Florrick';
    peter.info = 'I have morals for days!';
    let will = factory.newResource(NS,'Politician','PL_02');
    will.name = 'Will';
    will.lastname = 'Gardner';
    participantRegistry = await getParticipantRegistry(NS+'.Politician');
    // Update the participant in the participant registry.
    await participantRegistry.addAll([peter,will]);
}

