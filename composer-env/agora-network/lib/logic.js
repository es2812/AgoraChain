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
    //This transaction takes an id, descriptor for the elections, 
    //a list of options, a category and its owner
    const factory = await getFactory();

    let created_elections = factory.newResource(NS,'Election',tx.electionID);
    created_elections.description = tx.description;
    created_elections.options = tx.options;
    created_elections.category = tx.category;
    created_elections.owner = tx.owner;

    let electionRegistry = await getAssetRegistry(NS+'.Election');
    await electionRegistry.add(created_elections);
    console.log("Election#"+tx.electionID+" created");
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
        console.log("Election#"+tx.elections.getIdentifier()+" opened");
    }
    else{
        throw new Error("Election#"+ tx.elections.getIdentifier() +" is already open");
    }
}

async function countVotes(voteRegistry,electionsID){
    votes = await voteRegistry.getAll();
    //we keep votes for this election only
    console.log("Total votes of this type in the system: ");
    console.log(votes);
    var results = {};
    votes = votes.filter(v => v.elections.getIdentifier() == electionsID);
    if(votes.length > 0){
        votes = votes.map(v => v.choice);
        console.log("Votes in Election#"+electionsID+": ");
        console.log(votes);
        votes.forEach(curr => (curr in results) ? results[curr]+=1:results[curr]=1);
    }
    return results;
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
        console.log("Election#"+tx.elections.getIdentifier()+" closed");

        //counting votes
        let publicVoteRegistry = await getAssetRegistry(NS+'.PublicVote');
        let secretVoteRegistry = await getAssetRegistry(NS+'.AnonymousVote');

        //counting secret votes:
        let resultsecret = await countVotes(secretVoteRegistry,tx.elections.getIdentifier());
        console.log("Results Secret: ");
        console.log(resultsecret);
        let resultpublic = await countVotes(publicVoteRegistry,tx.elections.getIdentifier());
        console.log("Results Public: ");
        console.log(resultpublic);
        
        //TODO: consider representations
    }
    else{
        throw new Error("Election#"+tx.elections.getIdentifier()+" is already closed");
    }
}

/**
 * Implementation of the public vote transaction.
 * @param {org.agora.net.TX_PublicVote} publicVoteTransaction
 * @transaction
 */
async function publicVoteTransaction(tx){
    //we can only vote on open elections
    if(tx.elections.closed){
        throw new Error("Elections "+tx.elections+" is not open");
    }
    else{
        let voteRegistry = await getAssetRegistry(NS+'.PublicVote');
        //we need to check whether the vote already exists
        //the id should be concat(electionsID,politicianID)
        let id = tx.elections.getIdentifier()+tx.voter.getIdentifier();
        let check = await voteRegistry.exists(id);
        if(check){
            let vote = await voteRegistry.get(id);
            //we update the vote
            if(tx.choice!='' && tx.choice!=null){
                vote.choice = tx.choice;
            }
            voteRegistry.update(vote);
            console.log("Vote#"+id+" issued by Politician#"+tx.voter.getIdentifier()+
            " in Election#"+tx.elections.getIdentifier()+" updated");
        }
        else{
            //we create the vote
            const factory = await getFactory();
            let vote = factory.newResource(NS,'PublicVote',id);
            vote.elections = tx.elections;
            vote.voter = tx.voter;
            if(tx.choice!='' && tx.choice!=null){
                vote.choice = tx.choice;
            }
            voteRegistry.add(vote);
            console.log("Vote#"+id+" issued by Politician#"+tx.voter.getIdentifier()+
            " in Election#"+tx.elections.getIdentifier()+" created");
        }
    }
}

/**
 * Implementation of the secret vote transaction.
 * @param {org.agora.net.TX_SecretVote} secretVoteTransaction 
 * @transaction
 */
async function secretVoteTransaction(tx){
    //we can only vote on open elections
    if(tx.elections.closed){
        throw new Error("Elections "+tx.elections+" is not open");
    }
    else{
        //citizen must have registered to vote beforehand
        let ballotRegistry = await getAssetRegistry(NS+'.Ballot');
        let registered = await ballotRegistry.exists(tx.anonymousHash);
        if(!registered){
            throw new Error("Ballot indexed by secret" +tx.anonymousHash+" not found.");
        }
        else{
            //we check if this is the citizen's first vote
            let voteRegistry = await getAssetRegistry(NS+'.AnonymousVote');
            let notFirstVote = await voteRegistry.exists(tx.anonymousHash);
            if(notFirstVote){
                let vote = await voteResgitry.get(tx.anonymousHash);
                if(tx.choice){
                    vote.choice = tx.choice;
                }
                else{
                    vote.choice = null;
                }
                await voteRegistry.update(vote);
                console.log("Vote#"+tx.anonymousHash+
                " in Election#"+tx.elections.getIdentifier()+" updated");
            }
            else{
                let factory = await getFactory();
                let vote =  factory.newResource(NS,'AnonymousVote',tx.anonymousHash);
                vote.elections = tx.elections;
                if(tx.choice){
                    vote.choice = tx.choice;
                }
                await voteRegistry.add(vote);
                console.log("Vote#"+tx.anonymousHash+
                " in Election#"+tx.elections.getIdentifier()+" added");
            }
        }

    }
}

/**
 * Implementation of the register to vote transaction
 * @param {org.agora.net.TX_Registry} registerTransaction
 * @transaction
 */
async function registerTransaction(tx){
    //we check that the user isn't already registered
    let ballotRegistry = await getAssetRegistry(NS+'.Ballot');
    let ballots = await ballotRegistry.getAll();
    ballots = ballots.filter(ballot => ballot.elections==tx.elections && ballot.voter == tx.voter);
    let userIsRegistered = (ballots.length!=0);

    if(!userIsRegistered){
        //we generate a ballotID
        //TODO: hash(tx.secret+tx.voterID+tx.electionsID)
        let ballotID = tx.secret+tx.voter.getIdentifier()+tx.elections.getIdentifier();

        let factory = await getFactory();
        let ballot =  factory.newResource(NS,'Ballot',ballotID+tx.voterID.getIdentifier());
        await ballotRegistry.add(ballot);
        console.log("Ballot#"+ballot.getIdentifier()+" from Citizen#"+tx.voter.getIdentifier()+
        " in Election#"+tx.elections.getIdentifier()+" created");
        console.log("ballotID: "+ballotID);
        return ballotID;
    }
    else{
        throw new Error("Citizen#"+tx.voter.getIdentifier()+" is already registered to vote in Election#"+tx.elections.getIdentifier());
    }    
}

/**
 * Demo that creates some participants and assets for testing purposes.
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

    //We create an open election for Diane
    let e01 = factory.newResource(NS,'Election','EL_01');
    e01.description = "A sample election for testing purposes";
    e01.category = "Sample";
    e01.options = ["Option 1", "Option 2", "Option 3"];
    e01.owner = diane;
    e01.closed = false;

    let electionRegistry = await getAssetRegistry(NS+'.Election');
    await electionRegistry.add(e01);

    //We create some public votes for Peter and Will
    let v01 = factory.newResource(NS,'PublicVote','PL_01EL_01');
    v01.choice = "Option 1";
    v01.elections = e01;
    v01.voter = peter;
    let v02 = factory.newResource(NS,'PublicVote','PL_02EL_01');
    v02.choice = "Option 3";
    v02.elections = e01;
    v02.voter = will;


    let voteRegistry = await getAssetRegistry(NS+'.PublicVote');

    await voteRegistry.addAll([v01,v02]);
}