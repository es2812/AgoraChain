echo Citizen A trusts Politician P
if composer transaction submit -c alicia@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#A", "trusted":"resource:org.agora.net.Politician#P"}'
then echo "#P now represents #A. "
fi
echo Citizen A sets restrictions
composer transaction submit -c alicia@agora-network -d '{"$class":"org.agora.net.TX_AddRestriction", "restrictionID":"R1", "category":"classroom", "choice":"A", "trustee":"resource:org.agora.net.Citizen#A"}'

echo Citizen E trusts Politician P
if composer transaction submit -c eli@agora-network -d '{"$class":"org.agora.net.TX_Trust", "trustee":"resource:org.agora.net.Citizen#E", "trusted":"resource:org.agora.net.Politician#P"}'
then echo "#P now represents #E. "
fi

echo Legislator D creates election
if composer transaction submit -c diane@agora-network -d '{"$class":"org.agora.net.TX_CreateElection", "electionID":"EL1", "description":"Choosing class representative", "category":"classroom", "options":["A","B","C","D"], "owner":"resource:org.agora.net.Legislator#D"}'
then echo "Election #EL1 created. "
fi
echo Legislator D opens election EL1
if composer transaction submit -c diane@agora-network -d '{"$class":"org.agora.net.TX_OpenElection", "election":"resource:org.agora.net.Election#EL1"}'
then echo "Election #EL1 open. "
fi

echo Politician P votes option A on election EL1
if composer transaction submit -c peter@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "election":"resource:org.agora.net.Election#EL1", "choice":"A", "voter":"resource:org.agora.net.Politician#P"}'
then echo "Vote by #P registered. "
fi

echo Politician W votes a write-in option: Batman on election EL1
if composer transaction submit -c will@agora-network -d '{"$class":"org.agora.net.TX_PublicVote", "election":"resource:org.agora.net.Election#EL1", "choice":"Batman", "voter":"resource:org.agora.net.Politician#W"}'
then echo "Vote by #W registered. "
fi

echo Legislator D closes the election EL1
if composer transaction submit -c diane@agora-network -d '{"$class":"org.agora.net.TX_CloseElection", "election":"resource:org.agora.net.Election#EL1"}'
then echo "Election #EL1 closed. "
fi