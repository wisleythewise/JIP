# JIP
## Introduction
Welcome to this repository, in here you will find a prototype that was requested to be build by Linkthings. In order to examine the technical feasability of implemeting a blockchain in the trade finance world. The supplier of the backbone of this repository is the git of [hyperledger](https://github.com/hyperledger/fabric-samples).  <br>

## Dashboard
This repository has a Dashboard which allows users to interact with the blockchain. In the picture below you will find an example of the UI.

![Dashboard UI](https://i.imgur.com/HiPgQ9K.jpg "Dashboard UI")

## Prerequisites
For this repository to fully function please install all the prerequisites listed [here](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) and [here](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) when everything is installed replace the fabric-samples folder in the freshly installed directory with this fabric-sample folder on the updated_smartcontract branch. This folder will become the base of the network <br>

## Highlevel fundamentals of the network
In this section we will talk briefly about the highlevel architecture of the Hyperledger fabric network. Formore eleborate information about the network please read the [docs](https://hyperledger-fabric.readthedocs.io/en/latest/).

![Hyperledger fabric network](https://hyperledger-fabric.readthedocs.io/en/latest/_images/network.diagram.1.png "Hyperledger fabric network")


The network depicted consists of four main layers in which entities are allowed to exist. There is the network layer, in which the ordering service entity, and consortia exists. The channel level where peers or organizations of the in channel have the ability to communicate with one another. The level of the peer which is responsible for keeping the ledger in check, and the entities that exist outside the network.

### Chaincode
The core of the network lies within the chain code. The chain code determines how the network inner mechanics function. The word chain code and smart contract are used interchangeably in the Hyperledger fabric jargon, but it is important to realize that this chain code / smart contract, differs from the definition of the smart contract stated earlier in the report. Therefore, to avoid confusion, the word chain code will be used from now on to refer to the rules within the network. 

There are different levels of chain code, due to the layered structure of the network. The network level chain code determines which entity exists in the network space, and the permissions to execute network level commands such as, adding people to the network. In the figure \ref{The Hyperledger fabric} only a single entity depicted with an O exits at this level, but there can be multiple entities existing in the network space, therefore this network level chain code also determines how many network level entities need to comply in order for a network level action to be executed. 

The channel level chain code determines how the entities in the channel also known as peers interact with each other on that channel. Although it might seem that the network level entities have more authority, only the peers in the channel have access to the channel level chain code, and only they have the permissions to update the definition. This promotes autonomy between peers and privacy. The peer level chain code determines how the peer is able to change the ledger. This chain code is the same on each peer in the channel. 


### Peers
The peers in the network, depicted with a p in figure \ref{The Hyperledger fabric}, are the entities that are responsible for a multitude of actions. The main action being maintaining the ledger. Each participant in a channel is called a peer, and these peers usually maps to different organizations. In the figure above, two different peers have joined the channel. 

Besides storing the ledger, peer are also responsible for validating all the transactions before updating their ledger according to the chain code, which governs these rules, depicted with an S in the figure. The peers only communicate with each other if they want to update the ledger, which are simple read write operations. They never disclose the whole ledger over the channel. Even while they do not disclose this information their individual ledgers are always identical, this is because the mathematical mechanism that is involved in the validation of the transactions is deterministic. The peers always will have an exactly similar ledger if and only if the transaction that are received and need to validated come in the same order to each peer order. This is where the ordering service comes in

### Ordering service consensus algorithm
As the name suggest, the ordering service, depicted with an O in figure \ref{The Hyperledger fabric}, is responsible for ordering all the transactions that the peers consequently need to validate. The ordering service opposed to other blockchain algorithms, which use computationally expense consensus algorithms which are probabilistic, uses a simple deterministic algorithm to order all the transactions. The ordering service does not concern itself with the rules within channels, it simply receives all the transactions within the network. Orders them determisticly, and send the block of transactions to the correct channel. In the figure \ref{The Hyperledger fabric} only one single channel is depicted, but in more complicated configurations a multitude of channels might be present, and the ordering service mangeg all these information flows.

### CA
Certificate authorities, depicted with an CA in figure \ref{The Hyperledger fabric}, are entities that are defined when the network is created, but they do not participate. The certificate authorities hands out digital certificates to the entities in the network, which enables these entities to identity themselves, when trying to interact with other each other. CA’s are a very common construct in the internet protocol world, and when the network is created, it decided amongst the entities within the network which CA’s are recognized as valid.

Do we want to explain the mechanism of Public private keys? It is kinda cool and we still do not have any math in the paper 


### Ledger
The ledger is where all the data from the transactions is stored depicted with an L in figure \ref{The Hyperledger fabric}, which is maintained by the peers. The ledger in Hyperledger fabric consists of two parts. One part being the blockchain and the other part the world state. The blockchain can be seen as a list of changes which have been ordered into blocks since the beginning of the network, but if a peer would want to query the actual current state of a specific metric, it would need to go to the whole ledger of transactional changes to know what current state is. Therefore, to optimize the whole system, the world state was added. The world state can be seen as the current absolute status of the system, this allows for fast queries, and little computational overhead. 


### Application and flow of information
The main components of the network have been defined. To execute a transaction within a specific channel, it is necessary to invoke the chain code on that specific channel, which is hosted on each peer in that channel. As each peer is usually mapped to a single organization, members within that organization usually communicate with their organizational peer to access to channel. To access the chain code on a channel, again which is hosted on every peer in that channel, a request needs to be forwarded to all the peers in the channel with that chain code via an application depicted with an A in figure \ref{The Hyperledger fabric}. For this application to successfully submit a request to a given peer, it needs to obtain the correct certificate from the correct CA. 

If all these conditions are satisfied, the application can send a simple read write request to all the peers. Each peer individually evaluates if this read/write actions obeys the laws of the chain code installed on that peer, and if those conditions are all satisfied, all peers sign off on the request and forward it back to the application. 

The application in turn bundles all these responses and sends them to the orderer. As explained in the earlier section, the order is only responsible for ordering all the transactions which are forwarded to it. In this specific case, only a single transaction is sent, so no ordering needs to be done. The order puts the single transaction into a block and broadcasts this block back to the peers of the correct channel, that are responsible for updating the ledger. 

The peers receiving this block from the orderer will check if the transaction in the block has received enough signatures from peers within the channel to comply to chain code on the channel to alter the ledger, and if this is the case, the ledger is updated. When these conditions are not met, the ledger is still updated, but the transaction will be marked as non-valid.

The application can take on many forms, the most primitive being the peer CLI. The Hyperledger fabric has enabled developers to interact with the network trough HTTPS request, and therefore simple servers, and websites can be developed to create a more user-friendly interface.


## Setting up the network
Setting op the network is time consuming. Please use the commands below to make sure everything is set up correctly. The network is based on the provided commercial-paper network provided inside the samples. If you want to read more about this configuration please check the docs our [here](https://github.com/hyperledger/fabric-samples/tree/main/commercial-paper). We have added a new peer to the network, three applications, a single server, and bussines logic.


    cd fabric-samples/test-network
    ./network.sh down

    cd ../commercial-paper
    ./network-starter.sh

    cd ../test-network/addOrg3/
    ./addOrg3.sh up -c mychannel -ca

### Open a new terminal
    cd ../../commercial-paper/organization/magnetocorp
    . ./magnetocorp.sh

### Open a new terminal
    cd ../digibank
    . ./digibank.sh

### Open a new terminal
    cd ../bank
    . ./bank.sh 


### Navigate to the magnetocorp terminal 

    peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
    peer lifecycle chaincode install cp.tar.gz

    export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')

    peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                            --channelID mychannel  \
                                            --name papercontract  \
                                            -v 0  \
                                            --package-id $PACKAGE_ID \
                                            --sequence 1  \
                                            --tls  \
                                            --cafile "$ORDERER_CA"

    peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1
### Navigate to the digibank terminal 

    peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
    peer lifecycle chaincode install cp.tar.gz

    export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
    echo $PACKAGE_ID

    peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                            --channelID mychannel  \
                                            --name papercontract  \
                                            -v 0  \
                                            --package-id $PACKAGE_ID \
                                            --sequence 1  \
                                            --tls  \
                                            --cafile "$ORDERER_CA"

    peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1
### Navigate to the bank terminal 

    peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
    peer lifecycle chaincode install cp.tar.gz

    export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
    echo $PACKAGE_ID

    peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                            --channelID mychannel  \
                                            --name papercontract  \
                                            -v 0  \
                                            --package-id $PACKAGE_ID \
                                            --sequence 1  \
                                            --tls  \
                                            --cafile "$ORDERER_CA"


    peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1

### Navigate to the Mageneto terminal 

    peer lifecycle chaincode commit -o localhost:7050 \
                                    --peerAddresses localhost:7051 --tlsRootCertFiles "${PEER0_ORG1_CA}" \
                                    --peerAddresses localhost:9051 --tlsRootCertFiles "${PEER0_ORG2_CA}" \
                    --peerAddresses localhost:11051 --tlsRootCertFiles "${PEER0_ORG3_CA}" \
                                    --ordererTLSHostnameOverride orderer.example.com \
                                    --channelID mychannel --name papercontract -v 0 \
                                    --sequence 1 \
                                    --tls --cafile "$ORDERER_CA" --waitForEvent

    cd application
    npm install
    node addToWallet.js



### Navigate to the bank terminal 
    npm install


### Navigate to the digibank terminal  
    cd application
    npm install
    node addToWallet.js
    node server.js  //Make sure the right ip is configured
         


### Open a new terminal
    cd ../../linkthings
    npm start                   //Make sure the right ip is configured
    npm install

### Caveat
We are reusing the CA identy of digibank application for in the bank application. This is because the server which has been developed for visualizing the blockchian is running locally on my computer, and due to time contraints it was more efficient to reuse a CA, because genreating and implementing a new CA would not be an economic decision regarding our grade, due to the fact that it was already out of scope for the project.  

<h1>Everything should be working now</h1>

### Additional CLI commands to check if everything is working correctly

#### Query the latest block
    cd test-network
    peer channel fetch config channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c mychannel --tls --cafile "$ORDERER_CA"



#### Read the channel configuration
    cd channel-artifacts

    configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
    jq .data.data[0].payload.data.config config_block.json > config.json



#### Check the logs 
    docker logs -f peer0.org1.example.com









