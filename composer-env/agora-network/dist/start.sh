~/fabric-dev-servers/stopFabric.sh
~/fabric-dev-servers/teardownFabric.sh
composer card delete -c admin@agora-network
composer card delete -c PeerAdmin@hlfv1
~/fabric-dev-servers/startFabric.sh
~/fabric-dev-servers/createPeerAdminCard.sh

composer archive create --sourceType dir --sourceName .. -a agora-network@0.0.1.bna
composer network install --card PeerAdmin@hlfv1 --archiveFile agora-network@0.0.1.bna
composer network start --networkName agora-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@agora-network