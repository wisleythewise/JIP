# JIP
## Introduction
Welcome to this repository, in here you will find a prototype that was requested to be build by Linkthings. In order to examine the technical feasability of implemeting a blockchain in the trade finance world. The supplier of the backbone of this repository is the git of [hyperledger](https://github.com/hyperledger/fabric-samples).  <br>

## Dashboard
This repository has a Dashboard which allows users to interact with the blockchain. In the picture below you will find an example of the UI.

![Dashboard UI](https://i.imgur.com/HiPgQ9K.jpg "Dashboard UI")

## Prerequisites
For this repository to fully function please install all the prerequisites listed [here](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) and [here](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) when everything is installed replace the fabric-samples folder in the freshly installed directory with this fabric-sample folder on the updated_smartcontract branch. This folder will become the base of the network <br>

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









