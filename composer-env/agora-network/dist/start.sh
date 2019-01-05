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
                    if composer network ping --card admin@agora-network
                    then 
                        ./initialization.sh
                        export COMPOSER_PROVIDERS='{
                            "github": {
                                "provider": "github",
                                "module": "passport-github",
                                "clientID": "386ee0e3e32d2bf76d8c",
                                "clientSecret": "9241c12721ce6240fd5e6617efcbb9bcb1758e57",
                                "authPath": "/auth/github",
                                "callbackURL": "/auth/github/callback",
                                "successRedirect": "http://localhost:4200/success",
                                "failureRedirect": "http://localhost:4200/error"
                            }
                        }'
                        composer-rest-server -c admin@agora-network -m true
                    fi
                fi
            fi
        fi
    fi
fi