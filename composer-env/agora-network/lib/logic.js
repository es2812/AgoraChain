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
    //[Trusted won't vote option P in election with category K]
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
    //This transaction takes an id, descriptor for the election, 
    //a list of options, a category and its owner
    const factory = await getFactory();

    let created_election = factory.newResource(NS,'Election',tx.electionID);
    created_election.description = tx.description;
    created_election.options = tx.options;
    created_election.category = tx.category;
    created_election.owner = tx.owner;

    let electionRegistry = await getAssetRegistry(NS+'.Election');
    await electionRegistry.add(created_election);
    console.log("Election#"+tx.electionID+" created");
}

/**
 * Implementation of the open election transaction.
 * @param {org.agora.net.TX_OpenElections} openElectionsTransaction
 * @transaction
 */
async function openElectionTransacton(tx){
    //This transaction takes the election to be opened
    if(tx.election.closed){

        tx.election.closed = false;

        let electionRegistry = await getAssetRegistry(NS+'.Election');
        await electionRegistry.update(tx.election);
        console.log("Election#"+tx.election.getIdentifier()+" opened");
    }
    else{
        throw new Error("Election#"+ tx.election.getIdentifier() +" is already open");
    }
}

async function countVotes(votes,nr){
    var results = {};
    if(votes.length > 0){
        if(nr!=null){
            votes.forEach(v => 
                (v.choice in results) ? 
                results[v.choice]+=1+nr[v.voter.getIdentifier()]
                :results[v.choice]=1+nr[v.voter.getIdentifier()]);
        }
        else{
            votes.forEach(v => (v.choice in results) ? results[v.choice]+=1:results[v.choice]=1);
        }
    }
    return results;
}

/**
 * Implementation of the close election transaction.
 * @param {org.agora.net.TX_CloseElections} closeElectionsTransaction
 * @transaction
 */
async function closeElectionTransacton(tx){
    //This transaction takes the election to be closed
    if(!tx.election.closed){
        tx.election.closed = true;

        let electionRegistry = await getAssetRegistry(NS+'.Election');
        console.log("Election#"+tx.election.getIdentifier()+" closed");

        //counting votes
        let publicVoteRegistry = await getAssetRegistry(NS+'.PublicVote');
        let secretVoteRegistry = await getAssetRegistry(NS+'.AnonymousVote');

        //counting secret votes directly:
        let votesS = await secretVoteRegistry.getAll();
        //we keep only votes from this election
        votesS = votesS.filter(v => v.election.getIdentifier() == tx.election.getIdentifier());
        console.log("Votos Secretos: ");
        console.log(votesS);
        let resultsecret = await countVotes(votesS,null);
        console.log("Results Secret: ");
        console.log(resultsecret);

        //in public voting we must consider activate representations 
        //belonging to citizens who haven't voted secretly already
        let votesP = await publicVoteRegistry.getAll();
        //we keep only votes from this election
        votesP = votesP.filter(v => v.election.getIdentifier() == tx.election.getIdentifier());
        console.log("Votos Públicos:");
        console.log(votesP);
        //for each public vote we have to track down every representation in which the politician is involved
        let representationRegistry = await getAssetRegistry(NS+'.Representation');
        let representations = await representationRegistry.getAll();
        console.log("Representaciones:");
        console.log(representations);

        if(representations.length>0){ //if there are no representations we simply count the votes normally
            //we store the list of ids from politicians that have voted
            let politicians = votesP.map(v=>v.voter.getIdentifier());
            console.log("Políticos:")
            console.log(politicians);
            //for each politician we calculate how many representations they are in
            let count = {}; 
            politicians.forEach(p => count[p]=representations.filter(r=>r.trusted.getIdentifier()==p).length);

            console.log("Cuenta representaciones:");
            console.log(count);
            //for each voter registered in the election, we check:
            // (1) if they voted
            // (2) if they have representation
            //if (1) and (2) are true we subtract one vote from their trusted politician's count
            let ballotRegitry = await getAssetRegistry(NS+'.Ballot');
            let ballots = await ballotRegitry.getAll();
            ballots = ballots.filter(b=>b.election.getIdentifier()==tx.election.getIdentifier());

            //(1)
            let identifierVotes = votesS.map(v=>v.getIdentifier());
            //TODO: adapt this to v.getIdentifier being a hash of b.anonymousHash
            let citizensWhoVoted = ballots.filter(b => identifierVotes.includes(b.anonymousHash)).map(b => b.voter);
            console.log("Citizens who voted:")
            console.log(citizensWhoVoted)
            //(2)
            citizensWhoVoted = citizensWhoVoted.map(c => c.getIdentifier());
            representations = representations.filter(r => citizensWhoVoted.includes(r.trustee.getIdentifier())); //holds all the representations whose trustees have voted
            console.log("Representations whose trustees have voted:")
            console.log(representations)

            //we fix the count 
            representations.forEach(r => count[r.trusted.getIdentifier()]-=1);
            console.log("Count fixed:")
            console.log(count);

            var resultpublic = await countVotes(votesP,count);      
        }
        else{
            var resultpublic = await countVotes(votesP,null);
        }
        console.log("Results Public: ");
        console.log(resultpublic);
        
        //we reduce resultpublic and resultsecret into one array
        //in the same order than the options array in the election 
        //and set it as the result
        let options = tx.election.options;
        let array_results = new Array(options.length).fill(0);
        let choicesInPublic = Object.keys(resultpublic);
        let choicesInSecret = Object.keys(resultsecret);
        
        options.forEach(function(op,index) {
            if(choicesInPublic.includes(op)){
                array_results[index]+=resultpublic[op];
            }
        });
        options.forEach(function(op,index){
            if(choicesInSecret.includes(op)){
                array_results[index]+=resultsecret[op];
            }   
        });

        //we add all possible write-ins as extra options in the field in the election asset
        //and add the number of votes at the end of the result array in the same order
        let writeins_ = new Set(choicesInPublic.filter(c => 
            !(options.includes(c))).concat(choicesInSecret.filter(c => !(options.includes(c)))));
        let writeins = Array.from(writeins_)
        console.log("Write-ins:");
        console.log(writeins);
        if(writeins.length>0){
            empty = new Array(writeins.length).fill(0);
            array_results = array_results.concat(empty); //we extend the results array to also contain indexes for the writeins

            writeins.forEach(function(op,index) {
                if(choicesInPublic.includes(op)){
                    array_results[options.length+index]+=resultpublic[op]; //the write-ins go after all the original options
                }
            });
            writeins.forEach(function(op,index){
                if(choicesInSecret.includes(op)){
                    array_results[options.length+index]+=resultsecret[op]; //the write-ins go after all the original options
                }   
            });

            tx.election.writeins = writeins;
        }
        tx.election.results = array_results;

        await electionRegistry.update(tx.election);
        console.log("Election#"+tx.election.getIdentifier()+" updated.");
    }
    else{
        throw new Error("Election#"+tx.election.getIdentifier()+" is already closed");
    }
}

/**
 * Implementation of the public vote transaction.
 * @param {org.agora.net.TX_PublicVote} publicVoteTransaction
 * @transaction
 */
async function publicVoteTransaction(tx){
    //we can only vote on open election
    if(tx.election.closed){
        throw new Error("Elections "+tx.election+" is not open");
    }
    else{
        let voteRegistry = await getAssetRegistry(NS+'.PublicVote');
        //we need to check whether the vote already exists
        //the id should be concat(electionID,politicianID)
        let id = tx.election.getIdentifier()+tx.voter.getIdentifier();
        let check = await voteRegistry.exists(id);
        if(check){
            let vote = await voteRegistry.get(id);
            //we update the vote
            if(tx.choice!='' || tx.choice!=null){
                vote.choice = tx.choice;
            }
            else{
                vote.choice = null;
            }
            voteRegistry.update(vote);
            console.log("Vote#"+id+" issued by Politician#"+tx.voter.getIdentifier()+
            " in Election#"+tx.election.getIdentifier()+" updated");
        }
        else{
            //we create the vote
            const factory = await getFactory();
            let vote = factory.newResource(NS,'PublicVote',id);
            vote.election = tx.election;
            vote.voter = tx.voter;
            if(tx.choice!='' || tx.choice!=null){
                vote.choice = tx.choice;
            }
            else{
                vote.choice = null;
            }
            voteRegistry.add(vote);
            console.log("Vote#"+id+" issued by Politician#"+tx.voter.getIdentifier()+
            " in Election#"+tx.election.getIdentifier()+" created");
        }
    }
}

/**
 * Implementation of the secret vote transaction.
 * @param {org.agora.net.TX_SecretVote} secretVoteTransaction 
 * @transaction
 */
async function secretVoteTransaction(tx){
    //we can only vote on open election
    //TODO: the id of the secretvote should be a hash of tx.anonymousHash to avoid
    //someone voting just by knowing tx.anonymousHash
    if(tx.election.closed){
        throw new Error("Elections "+tx.election+" is not open");
    }
    else{
        //citizen must have registered to vote beforehand
        let ballotRegistry = await getAssetRegistry(NS+'.Ballot');
        let registered = await ballotRegistry.exists(tx.anonymousHash);
        if(!registered){
            throw new Error("Ballot indexed by hash "  +tx.anonymousHash+" not found.");
        }
        else{
            //we check if this is the citizen's first vote
            let voteRegistry = await getAssetRegistry(NS+'.AnonymousVote');
            let notFirstVote = await voteRegistry.exists(tx.anonymousHash);
            if(notFirstVote){
                let vote = await voteResgitry.get(tx.anonymousHash);
                if(tx.choice!='' || tx.choice!=null){
                    vote.choice = tx.choice;
                }
                else{
                    vote.choice = null;
                }
                await voteRegistry.update(vote);
                console.log("Vote#"+tx.anonymousHash+
                " in Election#"+tx.election.getIdentifier()+" updated");
            }
            else{
                let factory = await getFactory();
                let vote =  factory.newResource(NS,'AnonymousVote',tx.anonymousHash);
                vote.election = tx.election;
                if(tx.choice!='' || tx.choice!=null){
                    vote.choice = tx.choice;
                }
                else{
                    vote.choice = null;
                }
                await voteRegistry.add(vote);
                console.log("Vote#"+tx.anonymousHash+
                " in Election#"+tx.election.getIdentifier()+" added");
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
    ballots = ballots.filter(ballot => ballot.election.getIdentifier()==tx.election.getIdentifier() && ballot.voter.getIdentifier() == tx.voter.getIdentifier());
    let userIsRegistered = (ballots.length!=0);

    if(!userIsRegistered){
        //we generate a ballotID
        //TODO: hash(tx.secret+tx.voterID+tx.electionID)
        let ballotID = tx.secret+tx.voter.getIdentifier()+tx.election.getIdentifier();

        let factory = await getFactory();
        let ballot =  factory.newResource(NS,'Ballot',ballotID);
        ballot.voter = tx.voter;
        ballot.election = tx.election;
        await ballotRegistry.add(ballot);
        console.log("Ballot#"+ballot.getIdentifier()+" from Citizen#"+tx.voter.getIdentifier()+
        " in Election#"+tx.election.getIdentifier()+" created");
        console.log("ballotID: "+ballotID);
        return ballotID;
    }
    else{
        throw new Error("Citizen#"+tx.voter.getIdentifier()+" is already registered to vote in Election#"+tx.election.getIdentifier());
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

    //We create some representations
    let rp01 = factory.newResource(NS,'Representation','CT_02PL_01');
    rp01.trustee = eli;
    rp01.trusted = peter;
    
    let representationRegistry = await getAssetRegistry(NS+'.Representation');
    await representationRegistry.add(rp01);

    //We create some public votes for Peter and Will
    let v01 = factory.newResource(NS,'PublicVote','EL_01PL_01');
    v01.choice = "Option 1";
    v01.election = e01;
    v01.voter = peter;
    let v02 = factory.newResource(NS,'PublicVote','EL_01PL_02');
    v02.choice = "Option 3";
    v02.election = e01;
    v02.voter = will;
    let voteRegistry = await getAssetRegistry(NS+'.PublicVote');
    await voteRegistry.addAll([v01,v02]);
}