#!/bin/bash
if [[ -z $1 ]]; then
    echo usage: start.sh VERSION
else
    docker kill rest
    docker kill mongo
    docker rm rest
    docker rm mongo
    echo Restarting Fabric
    ~/fabric-dev-servers/stopFabric.sh
    ~/fabric-dev-servers/teardownFabric.sh
    
    composer card delete -c alicia@agora-network
    composer card delete -c eli@agora-network
    composer card delete -c diane@agora-network
    composer card delete -c peter@agora-network
    composer card delete -c will@agora-network
    
    composer card delete -c restadmin@agora-network
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
                        docker run -d --name mongo --network composer_default -p 27017:27017 mongo
                        ./initialization.sh
                        
                        composer participant add -c admin@agora-network -d '{"$class":"org.hyperledger.composer.system.NetworkAdmin","participantId":"restadmin"}'
                        composer identity issue -c admin@agora-network -f restadmin.card -u restadmin -a "resource:org.hyperledger.composer.system.NetworkAdmin#restadmin"

                        composer card import -f restadmin.card
                        sed -e 's/localhost:7051/peer0.org1.example.com:7051/' -e 's/localhost:7053/peer0.org1.example.com:7053/' -e 's/localhost:7054/ca.org1.example.com:7054/' -e 's/localhost:7050/orderer.example.com:7050/' < $HOME/.composer/cards/restadmin@agora-network/connection.json > /tmp/connection.json && cp -p /tmp/connection.json $HOME/.composer/cards/restadmin@agora-network/
                        
                        export COMPOSER_CARD="restadmin@agora-network"
                        export COMPOSER_NAMESPACES="never"
                        export COMPOSER_MULTIUSER="true"
                        export COMPOSER_PROVIDERS='{
                            "github": {
                                "provider": "github",
                                "module": "passport-github",
                                "clientID": "386ee0e3e32d2bf76d8c",
                                "clientSecret": "9241c12721ce6240fd5e6617efcbb9bcb1758e57",
                                "authPath": "/auth/github",
                                "callbackURL": "/auth/github/callback",
                                "successRedirect": "http://20.0.0.99:4200/success",
                                "failureRedirect": "http://20.0.0.99:4200/error"
                            }
                        }'
                        export COMPOSER_DATASOURCES='{
                            "db": {
                                "name": "db",
                                "connector": "mongodb",
                                "host":"mongo"
                                }
                            }'

                        echo $COMPOSER_PROVIDERS

                        docker run \
                        -d \
                        -e COMPOSER_CARD=${COMPOSER_CARD} \
                        -e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
                        -e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
                        -e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
                        -e COMPOSER_PROVIDERS="${COMPOSER_PROVIDERS}" \
                        -e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
                        -v ~/.composer:/home/composer/.composer \
                        --name rest \
                        --network composer_default \
                        -p 3000:3000 \
                        es2812/agorachain:latest

                        docker logs rest -f
                    fi
                fi
            fi
        fi
    fi
fi