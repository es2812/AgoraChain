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
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.agora.net.SampleDemo} sampleDemo
 * @transaction
 */
async function sampleDemo(tx) {
    const factory = await getFactory();
    const NS = 'org.agora.net';
    //creating a couple of sample citizens
    var alicia = factory.newResource(NS,'Citizen','CT_01');
    var eli = factory.newResource(NS,'Citizen','CT_02');
    alicia.name = 'Alicia';
    eli.name = 'Eli';

    var participantRegistry = await getParticipantRegistry(NS+'.Citizen');
    // Update the participant in the participant registry.
    await participantRegistry.addAll([alicia,eli]);
    
    //creating sample legislator
    var diane = factory.newResource(NS,'Legislator','LG_01');
    diane.name = 'Diane';
    participantRegistry = await getParticipantRegistry(NS+'.Legislator');
    // Update the participant in the participant registry.
    await participantRegistry.add(diane);

    //creating sample politician
    var peter = factory.newResource(NS,'Politician','PL_01');
    peter.name = 'Peter';
    peter.info = 'I have morals for days!';
    participantRegistry = await getParticipantRegistry(NS+'.Politician');
    // Update the participant in the participant registry.
    await participantRegistry.add(peter);
    
}
