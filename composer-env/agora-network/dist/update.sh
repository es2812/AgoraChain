#!/bin/bash
if [[ -z $1 ]]; then
    echo usage: update.sh VERSION
else
    echo Setting the new version on package.json via npm version
    if npm version $1; then
    echo Restarting Fabric
    if ~/fabric-dev-servers/stopFabric.sh; then
    if ~/fabric-dev-servers/teardownFabric.sh; then
    composer card delete -c admin@agora-network
    composer card delete -c PeerAdmin@hlfv1
    if ~/fabric-dev-servers/startFabric.sh; then
    if ~/fabric-dev-servers/createPeerAdminCard.sh; then
    echo Creating source file...
    if composer archive create --sourceType dir --sourceName .. -a agora-network@$1.bna
 then
    echo Installing network... 
    if composer network install --card PeerAdmin@hlfv1 --archiveFile agora-network@$1.bna; then
    echo Starting network...
    if composer network start --networkName agora-network --networkVersion $1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card; then
    if composer card import --file networkadmin.card; then
    #echo Upgrading installed network to version $1... 
    #if composer network upgrade -n agora-network -V $1 -c admin@agora-network; then
    echo Done!
    #fi
    fi
    fi
    fi
    fi
    fi
    fi
    fi
    fi
    fi
fi