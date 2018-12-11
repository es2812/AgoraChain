#!/bin/bash
if [[ -z $1 ]]; then
    echo usage: update.sh VERSION
else
    echo Setting the new version on package.json via npm version
    if npm version $1; 
    then
        echo Creating source file...
        if composer archive create --sourceType dir --sourceName .. -a agora-network@$1.bna 
        then
                echo Done!
        fi
    fi
fi