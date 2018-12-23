import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.agora.net{
   export abstract class Person extends Participant {
      id: string;
      name: string;
      lastname: string;
   }
   export class Citizen extends Person {
      representation: Politician;
   }
   export class Politician extends Person {
      info: string;
   }
   export class Legislator extends Person {
   }
   export class Election extends Asset {
      electionID: string;
      description: string;
      category: string;
      options: string[];
      writeins: string[];
      results: number[];
      closed: boolean;
      owner: Legislator;
   }
   export class Vote extends Asset {
      voteID: string;
      choice: string;
      election: Election;
      voter: Politician;
   }
   export class Envelope extends Asset {
      envelopeID: string;
      voter: Citizen;
      election: Election;
      vote: Vote;
   }
   export class Restriction extends Asset {
      restrictionID: string;
      category: string;
      choice: string;
      trustee: Citizen;
   }
   export class TX_Trust extends Transaction {
      trustee: Citizen;
      trusted: Politician;
   }
   export class TX_AddRestriction extends Transaction {
      restrictionID: string;
      category: string;
      choice: string;
      trustee: Citizen;
   }
   export class TX_RemoveRestriction extends Transaction {
      restriction: Restriction;
   }
   export class TX_Nulltrust extends Transaction {
      representedToNull: Citizen;
   }
   export class TX_CreateElection extends Transaction {
      electionID: string;
      description: string;
      options: string[];
      category: string;
      owner: Legislator;
   }
   export class TX_OpenElection extends Transaction {
      election: Election;
   }
   export class TX_CloseElection extends Transaction {
      election: Election;
   }
   export class TX_PublicVote extends Transaction {
      choice: string;
      election: Election;
      voter: Politician;
   }
   export class TX_PrepareEnvelope extends Transaction {
      envelopeID: string;
      voter: Citizen;
      election: Election;
   }
   export class TX_SecretVote extends Transaction {
      choice: string;
      envelope: Envelope;
   }
// }
