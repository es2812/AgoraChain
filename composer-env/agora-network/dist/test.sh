echo Creating Sample Participants
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.SampleDemo"}'
echo Alicia trust Peter
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#CT_01", "trusted":"resource:org.agora.net.Politician#PL_01"}'
echo Alicia trust Will
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#CT_01", "trusted":"resource:org.agora.net.Politician#PL_02"}'
echo Eli trust Peter
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#CT_02", "trusted":"resource:org.agora.net.Politician#PL_01"}'
echo Eli breaks trust with Peter
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Nulltrust", "representationToNull":"resource:org.agora.net.Representation#CT_02"}'
echo Diane creates elections
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CreateElections", "electionID":"EL_01", "description":"Delegation choice", "category":"classroom", "options":["a","b","c","d"], "owner":"resource:org.agora.net.Legislator#LG_01"}'
echo Diane opens elections
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_OpenElections", "elections":"resource:org.agora.net.Election#EL_01"}'
echo Diane closes elections
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CloseElections", "elections":"resource:org.agora.net.Election#EL_01"}'
echo Diane tries to close elections again. Should fail
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CloseElections", "elections":"resource:org.agora.net.Election#EL_01"}'
echo Peter tries to vote on closed elections. Should fail
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "elections":"resource:org.agora.net.Election#EL_01", "choice":"a", "voter":"resource:org.agora.net.Politician#PL_01"}'
echo Diane opens the elections
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_OpenElections", "elections":"resource:org.agora.net.Election#EL_01"}'
echo Peter votes on elections
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "elections":"resource:org.agora.net.Election#EL_01", "choice":"a", "voter":"resource:org.agora.net.Politician#PL_01"}'
echo Peter changes his vote
composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "elections":"resource:org.agora.net.Election#EL_01", "choice":"b", "voter":"resource:org.agora.net.Politician#PL_01"}'