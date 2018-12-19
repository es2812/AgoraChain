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
    const citizenRegistry = await getParticipantRegistry(NS+'.Citizen');

    let valid = await citizenRegistry.exists(tx.trustee.getIdentifier())
    if(valid){
        const politicianRegistry = await getParticipantRegistry(NS+'.Politician');
        let valid = await politicianRegistry.exists(tx.trusted.getIdentifier());
        if(valid){
            const factory = await getFactory();

            tx.trustee.representation = factory.newRelationship(NS,'Politician',tx.trusted.getIdentifier());
            
            await citizenRegistry.update(tx.trustee);
            console.log("Representation between Citizen#"+tx.trustee.getIdentifier()+" and Politician#"+tx.trustee.representation.getIdentifier() + " created");
        }
        else{
            throw new Error(tx.trusted+" doesn't exist.")
        }
    }
    else{
        throw new Error(tx.trustee+" doesn't exist.");
    }
}

/**
 * Implementation of the add restriction to Representation transaction.
 * @param {org.agora.net.TX_AddRestriction} addRestrictionTransaction
 * @transaction
 */
async function addRestrictionTransaction(tx) {
    const citizenRegistry = await getParticipantRegistry(NS+'.Citizen');
    let valid = await citizenRegistry.exists(tx.trustee.getIdentifier());

    if(valid){
        const factory = await getFactory();
        const restrictionRegistry = await getAssetRegistry(NS+'.Restriction');
        let restriction = factory.newResource(NS,'Restriction',tx.restrictionID);
        
        restriction.category = tx.category;
        restriction.choice = tx.choice;
        restriction.trustee = factory.newRelationship(NS,'Citizen',tx.trustee.getIdentifier());

        await restrictionRegistry.add(restriction);
    }
    else{
        throw new Error(tx.trustee+" doesn't exist.");
    }
}

/**
 * Implementation of the remove restriction to Representation transaction
 * @param {org.agora.net.TX_RemoveRestriction} removeRestrictionTransaction
 * @transaction 
 */
async function removeRestrictionTransaction(tx) {
    const restrictionRegistry = await getAssetRegistry(NS+'.Restriction');
    let valid = await restrictionRegistry.exists(tx.restriction.getIdentifier());

    if(valid){
        await restrictionRegistry.remove(restriction);
    }
    else{
        throw new Error(tx.restriction+" doesn't exist.")
    }
}

/**
 * Implementation of the null trust transaction.
 * @param {org.agora.net.TX_Nulltrust} nullTrustTransaction
 * @transaction
 */
async function nullTrustTransaction(tx){
    const citizenRegistry = await getParticipantRegistry(NS+'.Citizen');
    let valid = await citizenRegistry.exists(tx.representedToNull.getIdentifier());
    if(valid){
        //we remove the given representation
        tx.representedToNull.representation = undefined;
        await citizenRegistry.update(tx.representedToNull);
        console.log("Representation for Citizen"+tx.representedToNull.getIdentifier()+" deleted");
    }
    else{
        throw new Error(tx.representedToNull+" doesn't exist.")
    }
}

/**
 * Implementation of the create election transaction.
 * @param {org.agora.net.TX_CreateElection} createElectionTransaction
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
    created_election.owner = factory.newRelationship(NS,'Legislator',tx.owner.getIdentifier());

    let electionRegistry = await getAssetRegistry(NS+'.Election');
    await electionRegistry.add(created_election);
    console.log("Election#"+tx.electionID+" created");
}

/**
 * Implementation of the open election transaction.
 * @param {org.agora.net.TX_OpenElection} openElectionTransaction
 * @transaction
 */
async function openElectionTransacton(tx){
    const electionRegistry = await getAssetRegistry(NS+'.Election');
    let valid = electionRegistry.exists(tx.election.getIdentifier());
    if(valid){
        //This transaction takes the election to be opened
        if(tx.election.closed){

            tx.election.closed = false;
            await electionRegistry.update(tx.election);
            console.log("Election#"+tx.election.getIdentifier()+" opened");
        }
        else{
            throw new Error(tx.election +" is already open");
        }
    }
    else{
        throw new Error(tx.election +" doesn't exist");
    }
}

/**
 * This function counts votes both taking into account the number of representations
 * the voter has, and in the cases where representation doesn't apply (secret voting).
 * @param {Array} votes 
 * @param {Object} numRep 
 * @returns {Object} results
 */
async function countVotes(votes,numRep){
    var results = {};
    if(votes.length > 0){
        if(numRep!=null){
            votes.forEach(v => 
                (v.choice in results) ? 
                results[v.choice]+=1+numRep[v.voter.getIdentifier()]
                :results[v.choice]=1+numRep[v.voter.getIdentifier()]);
        }
        else{
            votes.forEach(v => (v.choice in results) ? results[v.choice]+=1:results[v.choice]=1);
        }
    }
    return results;
}

/**
 * Implementation of the close election transaction.
 * @param {org.agora.net.TX_CloseElection} closeElectionTransaction
 * @transaction
 */
async function closeElectionTransacton(tx){
    const electionRegistry = await getAssetRegistry(NS+'.Election');
    let valid = electionRegistry.exists(tx.election.getIdentifier());
    if(valid){
        //This transaction takes the election to be closed
        if(!tx.election.closed){
            tx.election.closed = true;
            console.log("Election#"+tx.election.getIdentifier()+" closed");

            //counting votes
            let voteRegistry = await getAssetRegistry(NS+'.Vote');
            let votes = await voteRegistry.getAll();
            votes = votes.filter(v=>v.election.getIdentifier()==tx.election.getIdentifier()); //only votes from this election

            //counting secret votes directly:
            let votesS = votes.filter(v=>v.voter==null);
            console.log("Votos Secretos: ");
            console.log(votesS);
            let resultsecret = await countVotes(votesS,null);
            console.log("Results Secret: ");
            console.log(resultsecret);

            //in public voting we must consider active representations 
            //belonging to citizens who haven't voted secretly already.
            let votesP = votes.filter(v=>v.voter!=undefined);
            console.log("Votos Públicos:");
            console.log(votesP);
            //for each public vote we have to track down every representation in which the politician is involved
            let citizenRegistry = await getParticipantRegistry(NS+'.Citizen');
            let citizens = await citizenRegistry.getAll();
            let citizensRepresented = citizens.filter(c => c.representation!=undefined);
            console.log("Representaciones:");
            console.log(citizensRepresented);

            if(citizensRepresented.length>0){ //if there are no representations we simply count the votes normally
                //we store the list of ids from politicians that have voted
                let politicians = votesP.map(v=>v.voter.getIdentifier());
                console.log("Políticos:")
                console.log(politicians);
                //for each politician we calculate how many representations they are in
                let count = {}; 
                politicians.forEach(p => count[p]=citizensRepresented.filter(c=>c.representation.getIdentifier()==p).length);

                console.log("Cuenta representaciones:");
                console.log(count);

                //for each voter registered in the election, we check:
                // (1) if they voted
                // (2) if they have representation
                //if (1) and (2) are true we subtract one vote from their trusted politician's count
                let envelopeRegistry = await getAssetRegistry(NS+'.Envelope');
                let envelopes = await envelopeRegistry.getAll();
                envelopes = envelopes.filter(e=>e.election.getIdentifier()==tx.election.getIdentifier()); //envelopes for this election only

                //(1)
                let citizensWhoVoted = envelopes.filter(e=>e.vote!=null); //if they voted then there's a vote inside the envelope
                console.log("Citizens who voted:")
                console.log(citizensWhoVoted)
                //(2)
                citizensWhoVoted = citizensWhoVoted.map(e=>e.voter.getIdentifier());
                console.log("Citizens who voted:")
                console.log(citizensWhoVoted)
                citizensRepresented = citizensRepresented.filter(c => citizensWhoVoted.includes(c.getIdentifier())); //holds all the citizens with representations who have voted
                console.log("Citizens with representation who have voted:")
                console.log(citizensRepresented)

                //we fix the count 
                citizensRepresented.forEach(c => count[c.representation.getIdentifier()]-=1);
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
            throw new Error(tx.election+" is already closed");
        }
    }
    else{
        throw new Error(tx.election+" doesn't exist.");
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
        throw new Error("Election "+tx.election+" is not open");
    }
    else{
        let voteRegistry = await getAssetRegistry(NS+'.Vote');
        //we need to check whether the vote already exists
        //the id should be concat(electionID,politicianID)
        let id = tx.election.getIdentifier()+tx.voter.getIdentifier();
        let notFirstVote = await voteRegistry.exists(id);
        if(notFirstVote){
            var vote = await voteRegistry.get(id);
            //we update the vote
            if(tx.choice!='' && tx.choice!=null && tx.choice!=undefined){
                vote.choice = tx.choice;
            }
            else{
                vote.choice = '';
            }
            await voteRegistry.update(vote);
            console.log("Vote#"+id+" issued by Politician#"+tx.voter.getIdentifier()+
            " in Election#"+tx.election.getIdentifier()+" updated");
        }
        else{
            //we create the vote
            const factory = await getFactory();
            var vote = factory.newResource(NS,'Vote',id);
            vote.election = factory.newRelationship(NS,'Election',tx.election.getIdentifier());
            vote.voter = factory.newRelationship(NS,'Politician',tx.voter.getIdentifier());
            if(tx.choice!='' && tx.choice!=null && tx.choice!=undefined){
                vote.choice = tx.choice;
            }
            else{
                vote.choice = '';
            }
            await voteRegistry.add(vote);
            console.log("Vote#"+id+" issued by Politician#"+tx.voter.getIdentifier()+
            " in Election#"+tx.election.getIdentifier()+" created");
        }
        
        //we check all the restrictions associated with the politician's trustees and null in those that any of them apply
        const citizenRegistry = await getParticipantRegistry(NS+'.Citizen');
        let citizensRepresentedBy = await citizenRegistry.getAll();
        citizensRepresentedBy = citizensRepresentedBy.filter(c=>
            (c.representation!=undefined) && (c.representation.getIdentifier()==tx.voter.getIdentifier()));
        citizensRepresentedBy = citizensRepresentedBy.map(c=>c.getIdentifier());

        const restrictionRegistry = await getAssetRegistry(NS+'.Restriction');
        let restrictions = await restrictionRegistry.getAll();
        restrictions = restrictions.filter(r => citizensRepresentedBy.includes(r.trustee.getIdentifier()));

        let citizensRepresentedToNull = restrictions.filter(r=>(r.category==tx.election.category)&&(r.choice==vote.choice));
        citizensRepresentedToNull = await Promise.all(citizensRepresentedToNull.map(r=>citizenRegistry.get(r.trustee.getIdentifier())));

        citizensRepresentedToNull = new Set(citizensRepresentedToNull); //unique values
        citizensRepresentedToNull = Array.from(citizensRepresentedToNull);
        citizensRepresentedToNull.forEach(c => c.representation=undefined);
        
        await citizenRegistry.updateAll(citizensRepresentedToNull);
    }
}

/**
 * Implementation of the secret vote transaction.
 * @param {org.agora.net.TX_SecretVote} secretVoteTransaction 
 * @transaction
 */
async function secretVoteTransaction(tx){
    //we can only vote on open election
    if(tx.envelope.election.closed){
        throw new Error(tx.envelope.election+" is not open");
    }
    else{
        let voteRegistry = await getAssetRegistry(NS+'.Vote');
        let envelopeRegistry = await getAssetRegistry(NS+'.Envelope');
        //we check if it's the citizen's first vote (the envelope doesn't already have a vote inside)
        let isFirstVote = (tx.envelope.vote == undefined);
        if(isFirstVote){
            let factory = await getFactory();
            let vote =  factory.newResource(NS,'Vote',tx.envelope.getIdentifier()); //we should decide the voteID for now envelopeID
            vote.election = factory.newRelationship(NS,'Election',tx.envelope.election.getIdentifier());
            if(tx.choice!='' && tx.choice!=null  && tx.choice!=undefined){
                vote.choice = tx.choice;
            }
            else{
                vote.choice = '';
            }
            await voteRegistry.add(vote);
            console.log("Vote#"+vote.getIdentifier()+
            " in Election#"+tx.envelope.election.getIdentifier()+" added");

            tx.envelope.vote = factory.newRelationship(NS,'Vote',vote.getIdentifier());
            await envelopeRegistry.update(tx.envelope);
        }
        else{
            let vote = await voteRegistry.get(tx.envelope.vote.getIdentifier());
            if(tx.choice!='' && tx.choice!=null  && tx.choice!=undefined){
                vote.choice = tx.choice;
            }
            else{
                vote.choice = '';
            }
            await voteRegistry.update(vote);
            console.log("Vote#"+vote.getIdentifier()+
            " in Election#"+vote.election.getIdentifier()+" updated");
        }
    }
}

/**
 * Implementation of the prepare envelope transaction
 * @param {org.agora.net.TX_PrepareEnvelope} envelopeTransaction
 * @transaction
 */
async function envelopeTransaction(tx){
    //we check that the user doesn't already have an envelope for that election
    let envelopeRegistry = await getAssetRegistry(NS+'.Envelope');
    let envelopes = await envelopeRegistry.getAll();
    envelopes = envelopes.filter(e => 
        e.election.getIdentifier()==tx.election.getIdentifier() && e.voter.getIdentifier() == tx.voter.getIdentifier());
    if(envelopes.length==0){
        //we can only create an envelope for an open election
        if(tx.election.closed){
            throw new Error(tx.election+" is not open");
        }
        else{
            //TODO: decide id for the envelope (it can't give away the voter id). for now we take it from client api
            let factory = await getFactory();
            
            let envelope =  factory.newResource(NS,'Envelope',tx.envelopeID);
            envelope.voter = factory.newRelationship(NS,'Citizen',tx.voter.getIdentifier());
            envelope.election = factory.newRelationship(NS,'Election',tx.election.getIdentifier());

            await envelopeRegistry.add(envelope);
            console.log("Envelope#"+envelope.getIdentifier()+" from Citizen#"+tx.voter.getIdentifier()+
            " in Election#"+tx.election.getIdentifier()+" created");
        }
    }
    else{
        throw new Error("Citizen#"+tx.voter.getIdentifier()+" already has an envelope for Election#"+tx.election.getIdentifier());
    }    
}