composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.SampleDemo"}'
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#CT_01", "trusted":"resource:org.agora.net.Politician#PL_01"}'
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#CT_01", "trusted":"resource:org.agora.net.Politician#PL_02"}'
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#CT_02", "trusted":"resource:org.agora.net.Politician#PL_01"}'
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Nulltrust", "representationToNull":"resource:org.agora.net.Representation#CT_02"}'
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CreateElections", "electionID":"EL_01", "description":"Delegation choice", "category":"classroom", "options":["a","b","c","d"], "owner":"resource:org.agora.net.Legislator#LG_01"}'
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_OpenElections", "elections":"resource:org.agora.net.Election#EL_01"'}
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CloseElections", "elections":"resource:org.agora.net.Election#EL_01"'}
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CloseElections", "elections":"resource:org.agora.net.Election#EL_01"'}