#!/bin/bash
if [[ -z $1 ]]; then
    echo usage: deploy_and_test.sh VERSION
else
    #./createFile.sh $1
    ./start.sh $1
    ./initialization.sh
fi