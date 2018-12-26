#!/bin/bash
if [[ -z $1 ]]; then
    echo usage: start.sh VERSION
else
    echo Restarting Fabric
    ~/fabric-dev-servers/stopFabric.sh
    ~/fabric-dev-servers/teardownFabric.sh
    
    composer card delete -c alicia@agora-network
    composer card delete -c eli@agora-network
    composer card delete -c diane@agora-network
    composer card delete -c peter@agora-network
    composer card delete -c will@agora-network
    
    composer card delete -c admin@agora-network
    composer card delete -c PeerAdmin@hlfv1
    if ~/fabric-dev-servers/startFabric.sh
    then 
        if  ~/fabric-dev-servers/createPeerAdminCard.sh
        then echo Installing and starting network v.$1... 
            if composer network install --card PeerAdmin@hlfv1 --archiveFile agora-network@$1.bna
            then 
                if composer network start --networkName agora-network --networkVersion $1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
                then
                composer card import --file networkadmin.card
                composer network ping --card admin@agora-network
                fi
            fi
        fi
    fi
fi