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
5. Representation is **private**, except for the citizen represented.
6. Representation can be nulled at any point, including automatic nulling based on a politician's choice in any given election.
7. Citizens and politicians can change their vote until election is closed.
8. To minimize bias, election results are public only after the election is closed.
9. Citizens with representation can still vote directly, without that nulling the representation.


### System modelling

This system will be implemented using a Blockchain, developed with Hyperledger Composer. Hyperledger allows permissioned blockchains, and Composer allows for easy modelling, deployment and usage of the system. Validation policies and security will probably require some direct interaction with Hyperledger Fabric, which is what Composer uses to deploy the network.

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

#### System Diagram

![Class diagram of the system](https://github.com/es2812/AgoraChain/tree/master/Diagrams/ClassDiagram.png "Class diagram")

## References

- [1] Kirby, A.K., Masi, A. and Maymi, F., 2016. Votebook: A proposal for a blockchain-based electronic voting system. The Economist.
- [2] Hardt, S. and Lopes, L.C., 2015. Google votes: A liquid democracy experiment on a corporate social network.
