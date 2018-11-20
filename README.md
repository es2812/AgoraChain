# AgoraChain
A blockchain voting system based on liquid democracy developed with Hyperledger Composer

## Proposed Project Milestones

- [ ] _20.November.2018_. Finish proposal, analysis and design phase.
- [ ] _25.December.2018_. Finish implementation.
- [ ] _02.January.2019_ Finish API.
- [ ] _09.January.2019_ End of project.

## Proposal

### Principles of the system

After reviewing proposals on both Blockchain systems [\[1\]](#References) for traditional elections and proposals of Liquid Democracy implementations [\[2\]](#References), a set of principles for the system has been comprised, and are as follows:

1. Citizens can vote either directly or through representation.
2. Any citizen can declare themselves a "politician", and a citizen can set that politician as their representation. Each citizen can only have one representative at one given point.
3. Votes issued directly by citizens are **anonymous**, except for that citizen.
4. Votes issued by politicians are **public** to everyone in the network.
5. Representation can be nulled at any point, including automatic nulling based on a politician's choice in any given election.
6. Citizens and politicians can change their vote until election is closed.
7. Citizens with representation can still vote directly, without that nulling the representation.

### System modelling

This system will be implemented using a Blockchain, developed with Hyperledger Composer. Hyperledger allows permissioned blockchains, and Composer allows for easy modelling, deployment and usage of the system.

Hyperledger Composer's modelling allows for three types of building blocks: participants, assets and transactions.

The way Hyperledger Composer operates is with two blockchains, the **ledger**, which contains all transactions submitted and approved, and the **state database** which contains the current state of assets and participants.

#### Participants

Members of the blockchain. They may own assets and submit transactions. Each participant in the network has an *Identity*, defined as a digital certificate and a private key.

- **Citizens**: These participants can issue anonymous votes and delegate on politicians.
- **Politicians**: These participants can be delegated on by citizens, and can issue public votes.
- **Legislators**: These participants can create, open, and close elections.

#### Assets

These objects represent the (intangible) goods used in the system.

- **Election**: This asset represents a voting process, it's owned by one legislator.
- **Vote**: This asset represents a vote, it's owned by a citizen or politician.
- **Representation**: This asset represents a relationship of trust between a citizen and a politician.

#### Transactions

The mechanism by which Participants interact with Assets.

- Citizen transactions:

    - **Trust**: Creates a Representation asset between the Citizen and a Politician. 
    - **Anonymous vote**: Creates or modifies (if the citizen has already voted) the Vote asset by the Citizen, related to an Election asset.

- Politician transactions:

    - **Public vote**: Creates or modifies (if the politician has already voted) the Vote by the Politician, related to an Election asset.

- Legislator transactions:

    - **Create elections**: Creates an Election asset.
    - **Open elections**: Allows votes on an Election asset.
    - **Close elections**: Stops allowing votes on an Election asset.

#### Smart contracts

Smart contracts are defined in Hyperledger Composer as **Transaction Functions**, and will be invoked on a transaction. We define the following Transaction Functions in the system:

- On **close elections**, count the number of votes in the ledger and change the state of the asset to the result. An important aspect is to count **public votes** as the number of citizens that politician represents *unless* the citizen has issued their own vote in that election.
- On **public vote**, ensure the restrictions of the **Representation** asset for each of the represented citizens are respected, if they're not, null **Representation**.

#### Privacy concerns

Since it's an important principle of our system, there was a need to implement some levels of privacy in the *Anonymous vote* transaction and the *Vote* asset, which must keep a secret who the voter was, while still keeping the rest of the asset and transaction's content public.

It was decided to include a user-set password, *ballotID*, which will be used to keep the voter ID on the transaction and on the Vote asset secret. Thus, only knowledge of this password will allow someone to check the voter. The voter id on the transaction and asset relating to the *anonymous vote* will be a hash of the sum of *ballotID* and *voterID*.

This solution, however, might allow a citizen to vote many times with fraudulent passwords (since there's no way to know the voterID of a vote directly without the user-provided password). For that reason, the system will also keep a parallel, private blockchain, that registers whether a voter has voted in an election. This blockchain will be accessible only to the validator nodes in the system.

As a consequence, the Vote asset will be duplicated, as a PublicVote that contains its owner (that must be a Politician) and an AnonymousVote that won't keep track of its owner, but rather will have a special _secretID_ field that will allow indexing with the citizen that issued it only with the given password.


#### Domain Model

![Domain diagram of the system](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/ClassDiagram.png) 
Domain diagram

#### Sequence diagrams

![Anonymous Voting Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_voting.png) 
Anonymous Vote Transaction Sequence Diagram
![Public Voting Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_votingpolitic.png)
Public Vote Transaction Sequence Diagram
![Trust Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_trust.png)Trust Transaction Sequence Diagram
![Election Management Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_elections.png)
Election Creation/Opening/Closing Transaction Sequence Diagram

## References

- [1] Kirby, A.K., Masi, A. and Maymi, F., 2016. Votebook: A proposal for a blockchain-based electronic voting system. The Economist.
- [2] Hardt, S. and Lopes, L.C., 2015. Google votes: A liquid democracy experiment on a corporate social network.