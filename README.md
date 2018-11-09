# AgoraChain
A blockchain voting system based on liquid democracy developed with Hyperledger Composer

## Proposed Project Milestones

- [ ] _20.November.2018_. Finish proposal, analysis and design phase.
- [ ] _25.December.2018_. Finish implementation.
- [ ] _02.January.2019_ Finish API.
- [ ] _09.January.2019_ End of project.

## Proposal

### Principles of the system

After reviewing proposals on both Blockchain systems[\[1\]](#References) for traditional elections and proposals of Liquid Democracy implementations [\[2\]](#References), a set of principles for the system has been comprised, and are as follows:

1. Citizens can vote either directly or through representation.
2. Any citizen can declare themselves a "politician", and a citizen can set that politician as their representation. Each citizen can only have one representative at one given point.
3. Votes issued directly by citizens are **anonymous**, except for that citizen.
4. Votes issued by politicians are **public** to everyone in the network.
5. Representation is **private**, except for the citizen represented.
6. Representation can be nulled at any point, including automatic nulling based on a politician's choice in any given election.
7. Citizens and politicians can change their vote until election is closed.
8. To minimize bias, election results are public only after the election is closed.
9. Citizens with representation can still vote directly, without that nulling the representation.


## References

- [1] Kirby, A.K., Masi, A. and Maymi, F., 2016. Votebook: A proposal for a blockchain-based electronic voting system. The Economist.
- [2] Hardt, S. and Lopes, L.C., 2015. Google votes: A liquid democracy experiment on a corporate social network.
