echo Creating Sample Citizens
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Citizen","id":"A","name":"Alicia","lastname":"Florrick"}'
then read  -n 1 -p "Citizen #A created succesfully. Press any key to continue." i
fi
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Citizen","id":"E","name":"Eli","lastname":"Gold"}'
then read  -n 1 -p "Citizen #E created succesfully. Press any key to continue." i
fi
echo Creating Sample Legislator
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Legislator","id":"D","name":"Diane","lastname":"Lockhart"}'
then read  -n 1 -p "Legislator #D created succesfully. Press any key to continue." i
fi
echo Creating Sample Politicians
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Politician","id":"P","name":"Peter","lastname":"Florrick","info":"I have morals for days!"}'
then read  -n 1 -p "Politician #P created succesfully. Press any key to continue." i
fi
if composer participant add -c admin@agora-network -d '{"$class":"org.agora.net.Politician","id":"W","name":"Will","lastname":"Gardner"}' #info is optional!
then read  -n 1 -p "Politician #W created succesfully. Press any key to continue." i
fi

echo Submitting some Transactions

echo Citizen A trusts Politician P
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#A", "trusted":"resource:org.agora.net.Politician#P"}'
then read  -n 1 -p "#P now represents #A. Press any key to continue." i
fi
echo Citizen E trusts Politician P
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#E", "trusted":"resource:org.agora.net.Politician#P"}'
then read  -n 1 -p "#P now represents #E. Press any key to continue." i
fi
echo Citizen A breaks trust with Politician P
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Nulltrust", "representationToNull":"resource:org.agora.net.Representation#A"}'
then read  -n 1 -p "#P doesn't represent #A anymore. Press any key to continue." i
fi
echo Citizen A trusts Politician W
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#A", "trusted":"resource:org.agora.net.Politician#W"}'
then read  -n 1 -p "#W now represents #A. Press any key to continue." i
fi

echo Legislator D creates election
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_CreateElection", "electionID":"EL1", "description":"Choosing class representative", "category":"classroom", "options":["A","B","C","D"], "owner":"resource:org.agora.net.Legislator#D"}'
then read  -n 1 -p "Election #EL1 created. Press any key to continue." i
fi
echo Legislator D opens election EL1
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_OpenElection", "election":"resource:org.agora.net.Election#EL1"}'
then read  -n 1 -p "Election #EL1 open. Press any key to continue." i
fi

echo Politician P votes option A on election EL1
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "election":"resource:org.agora.net.Election#EL1", "choice":"A", "voter":"resource:org.agora.net.Politician#P"}'
then read  -n 1 -p "Vote by #P registered. Press any key to continue." i
fi
echo Politician W votes a write-in option: Batman on election EL1
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "election":"resource:org.agora.net.Election#EL1", "choice":"Batman", "voter":"resource:org.agora.net.Politician#W"}'
then read  -n 1 -p "Vote by #W registered. Press any key to continue." i
fi

echo Citizen A votes on EL1. She has to create the envelope to vote first
if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_PrepareEnvelope","envelopeID":"ENV1","voter":"resource:org.agora.net.Citizen#A","election":"resource:org.agora.net.Election#EL1"}'
then echo "Citizen #A create an envelope to vote in election #EL1."
read  -n 1 -p "Press any key to continue." i
fi

if composer transaction submit -c admin@agora-network -d '{"$class":"org.agora.net.TX_SecretVote","choice":"B","envelope":"resource:org.agora.net.Envelope#ENV1"}'
then echo "Citizen #A voted choice B in #EL1."
read  -n 1 -p "Press any key to continue." i
fi
