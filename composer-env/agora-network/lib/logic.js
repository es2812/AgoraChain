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
    var alicia = factory.newResource('org.agora.net','Citizen','CT_01');
    alicia.name = 'Alicia'

    const assetRegistry = await getAssetRegistry('org.agora.net.Citizen');
    // Update the asset in the asset registry.
    await assetRegistry.update(alicia);
}
