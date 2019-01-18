echo Creating Sample Citizens
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Citizen","id":"A","name":"Alicia","lastname":"Florrick"}'
then echo "Citizen #A created succesfully. "
    composer identity issue -c admin@agora-network -f alicia.card -u alicia -a "resource:org.agora.net.Citizen#A"
    composer card import --file alicia.card
    sed -e 's/localhost:7051/peer0.org1.example.com:7051/' -e 's/localhost:7053/peer0.org1.example.com:7053/' -e 's/localhost:7054/ca.org1.example.com:7054/' -e 's/localhost:7050/orderer.example.com:7050/' < $HOME/.composer/cards/alicia@agora-network/connection.json > /tmp/connection.json && cp -p /tmp/connection.json $HOME/.composer/cards/alicia@agora-network/
    composer card export -f alicia_exp.card -c alicia@agora-network; rm alicia.card
fi
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Citizen","id":"E","name":"Eli","lastname":"Gold"}'
then echo "Citizen #E created succesfully. "
    composer identity issue -c admin@agora-network -f eli.card -u eli -a "resource:org.agora.net.Citizen#E"
    composer card import --file eli.card
    sed -e 's/localhost:7051/peer0.org1.example.com:7051/' -e 's/localhost:7053/peer0.org1.example.com:7053/' -e 's/localhost:7054/ca.org1.example.com:7054/' -e 's/localhost:7050/orderer.example.com:7050/' < $HOME/.composer/cards/eli@agora-network/connection.json > /tmp/connection.json && cp -p /tmp/connection.json $HOME/.composer/cards/eli@agora-network/
    composer card export -f eli_exp.card -c eli@agora-network; rm eli.card
fi
echo Creating Sample Legislator
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Legislator","id":"D","name":"Diane","lastname":"Lockhart"}'
then echo "Legislator #D created succesfully. "
    composer identity issue -c admin@agora-network -f diane.card -u diane -a "resource:org.agora.net.Legislator#D"
    composer card import --file diane.card
    sed -e 's/localhost:7051/peer0.org1.example.com:7051/' -e 's/localhost:7053/peer0.org1.example.com:7053/' -e 's/localhost:7054/ca.org1.example.com:7054/' -e 's/localhost:7050/orderer.example.com:7050/' < $HOME/.composer/cards/diane@agora-network/connection.json > /tmp/connection.json && cp -p /tmp/connection.json $HOME/.composer/cards/diane@agora-network/
    composer card export -f diane_exp.card -c diane@agora-network; rm diane.card
fi
echo Creating Sample Politicians
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Politician","id":"P","name":"Peter","lastname":"Florrick","info":"I have morals for days!"}'
then echo "Politician #P created succesfully. "
    composer identity issue -c admin@agora-network -f peter.card -u peter -a "resource:org.agora.net.Politician#P"
    composer card import --file peter.card
    sed -e 's/localhost:7051/peer0.org1.example.com:7051/' -e 's/localhost:7053/peer0.org1.example.com:7053/' -e 's/localhost:7054/ca.org1.example.com:7054/' -e 's/localhost:7050/orderer.example.com:7050/' < $HOME/.composer/cards/peter@agora-network/connection.json > /tmp/connection.json && cp -p /tmp/connection.json $HOME/.composer/cards/peter@agora-network/
    composer card export -f peter_exp.card -c peter@agora-network; rm peter.card
fi
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Politician","id":"W","name":"Will","lastname":"Gardner"}' #info is optional!
then echo "Politician #W created succesfully. "
    composer identity issue -c admin@agora-network -f will.card -u will -a "resource:org.agora.net.Politician#W"
    composer card import --file will.card
    sed -e 's/localhost:7051/peer0.org1.example.com:7051/' -e 's/localhost:7053/peer0.org1.example.com:7053/' -e 's/localhost:7054/ca.org1.example.com:7054/' -e 's/localhost:7050/orderer.example.com:7050/' < $HOME/.composer/cards/will@agora-network/connection.json > /tmp/connection.json && cp -p /tmp/connection.json $HOME/.composer/cards/will@agora-network/
    composer card export -f will_exp.card -c will@agora-network; rm will.card
fi