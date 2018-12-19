echo Creating Sample Citizens
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Citizen","id":"A","name":"Alicia","lastname":"Florrick"}'
then echo "Citizen #A created succesfully. "
    composer identity issue -c admin@agora-network -f alicia.card -u alicia -a "resource:org.agora.net.Citizen#A"
    composer card import --file alicia.card
fi
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Citizen","id":"E","name":"Eli","lastname":"Gold"}'
then echo "Citizen #E created succesfully. "
    composer identity issue -c admin@agora-network -f eli.card -u eli -a "resource:org.agora.net.Citizen#E"
    composer card import --file eli.card
fi
echo Creating Sample Legislator
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Legislator","id":"D","name":"Diane","lastname":"Lockhart"}'
then echo "Legislator #D created succesfully. "
    composer identity issue -c admin@agora-network -f diane.card -u diane -a "resource:org.agora.net.Legislator#D"
    composer card import --file diane.card
fi
echo Creating Sample Politicians
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Politician","id":"P","name":"Peter","lastname":"Florrick","info":"I have morals for days!"}'
then echo "Politician #P created succesfully. "
    composer identity issue -c admin@agora-network -f peter.card -u peter -a "resource:org.agora.net.Politician#P"
    composer card import --file peter.card
fi
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Politician","id":"W","name":"Will","lastname":"Gardner"}' #info is optional!
then echo "Politician #W created succesfully. "
    composer identity issue -c admin@agora-network -f will.card -u will -a "resource:org.agora.net.Politician#W"
    composer card import --file will.card
fi