# AgoraChain

A blockchain voting system based on liquid democracy developed with Hyperledger Composer

## Running the project

As of this moment, this project runs on hyperledger fabric, using the set of `composer-cli` commands for deployment.

There's currently two ways of running the project:

### On the cloud (recommended). 

[The cloud version of composer-playground](https://composer-playground.mybluemix.net/) can be used to run the latest `.bna` file. This file can be found under [composer-env/agora-network/dist](https://github.com/es2812/AgoraChain/tree/master/composer-env/agora-network/dist).

An effort is made to keep this image up-to-date with the files in the repository, but it can be generated using the `createFile.sh` script (under that same directory). See the next point for requisites and instructions to generate the `.bna` file.

### Locally.

Follow these steps:

1. Follow the [Installing the development environment tutorial](https://hyperledger.github.io/composer/latest/installing/development-tools.html) in the Hyperledger Composer website.
2. [`createFile.sh`](https://github.com/es2812/AgoraChain/tree/master/composer-env/agora-network/dist/createFile.sh) generates a `.bna` file according to the network definition. You must specify a version, check the field 'version' in [`package.json`](https://github.com/es2812/AgoraChain/tree/master/composer-env/agora-network/package.json) and specify a **higher** version than the one found in that file.
3. With a `.bna` file created, [`start.sh`](https://github.com/es2812/AgoraChain/tree/master/composer-env/agora-network/dist/start.sh) boots up the Fabric network and installs the chaincode. You must specify the version of the `.bna` file you want to use.
4. The command `composer-playground` starts a local version of the playground in the browser.
5. If you prefer you can issue transactions and create participants using `composer-cli` commands. The file [`test.sh`](https://github.com/es2812/AgoraChain/tree/master/composer-env/agora-network/dist/test.sh) contains a few examples of this.

You can undeploy and kill the network with the [`stop.sh`](https://github.com/es2812/AgoraChain/tree/master/composer-env/agora-network/dist/stop.sh) script

## Proposed Project Milestones

- [x] _20.November.2018_. Finish proposal, analysis and design phase.
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
- **Politicians**: These participants can be delegated on by citizens, and can issue public votes. The way a member of the blockchain declares himself a politician requires the issuing of a new identity, and will be done outside the blockchain itself (but still through the API).
- **Legislators**: These participants can create, open, and close elections.

#### Assets

These objects represent the (intangible) goods used in the system.

- **Election**: This asset represents a voting process, it's owned by one legislator.
- **Vote**: This asset represents a vote, it's issued by a citizen or politician, pointing to the voter in the latter case.
- **Envelope**: This asset represents an identified "envelope" that holds the secret vote by the citizen. Access to it will be restricted.
- **Representation**: This asset represents a relationship of trust between a citizen and a politician.

#### Transactions

The mechanism by which Participants interact with Assets.

- Citizen transactions:

  - **Trust**: Creates a Representation asset between the Citizen and a Politician.
  - **NullTrust**: Deletes the Representation asset between the Citizen and his current representative.
  - **PrepareEnvelope**: Prepares an identified Envelope that will allow the Citizen to vote anonymously.
  - **Anonymous vote**: Creates or modifies (if the citizen has already voted) the Vote asset by the Citizen, related to an Election asset.

- Politician transactions:

  - **Public vote**: Creates or modifies (if the politician has already voted) the Vote by the Politician, related to an Election asset.

- Legislator transactions:

  - **Create elections**: Creates an Election asset.
  - **Open elections**: Allows votes on an Election asset.
  - **Close elections**: Stops allowing votes on an Election asset.

#### Smart contracts

Smart contracts are defined in Hyperledger Composer as **Transaction Functions**, and will be invoked on a transaction. We define the following Transaction Functions in the system:

- On **close elections**, count the number of votes in the ledger and change the state of the asset to the result. An important aspect is to count **public votes** as the number of citizens that politician represents right now *unless* the citizen has issued their own vote in that election.
- On **public vote**, ensure the restrictions of the **Representation** asset for each of the represented citizens are respected, if they're not, null **Representation**.

#### Privacy concerns

Since it's an important principle of our system, there was a need to implement some levels of privacy in the *Anonymous vote* transaction and the *Vote* asset, which must keep a secret who the voter was, while still keeping the rest of the asset and transaction's content public.

It was decided to implement a "double envelope" scheme, used in traditional mail voting. Thus we create the asset **Envelope**. This asset keeps track of the voter, election, and points to a **Vote** asset.

Said **Vote** asset doesn't have a public voter set for Citizens (it does for Politicians), and so it acts as the inner, secret, envelope which contains the choice of the Citizen.

Restrictions must be set for the **Envelope** asset to allow its access and utilization only to the citizen that issued it.

#### Domain Model

![Domain diagram of the system](https://raw.githubusercontent.com/es2812/AgoraChain/d9398842b154da627e7f171968842f2a36767a85/Diagrams/ClassDiagram.png)
Domain diagram
<!-- 
#### Sequence diagrams

TODO: update sequence diagrams

![Anonymous Voting Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_voting.png)
Anonymous Vote Transaction Sequence Diagram
![Public Voting Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_votingpolitic.png)
Public Vote Transaction Sequence Diagram
![Trust Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_trust.png)Trust Transaction Sequence Diagram
![Election Management Sequence](https://raw.githubusercontent.com/es2812/AgoraChain/master/Diagrams/tx_elections.png)
Election Creation/Opening/Closing Transaction Sequence Diagram -->

## References

- [1] Kirby, A.K., Masi, A. and Maymi, F., 2016. Votebook: A proposal for a blockchain-based electronic voting system. The Economist.
- [2] Hardt, S. and Lopes, L.C., 2015. Google votes: A liquid democracy experiment on a corporate social network.