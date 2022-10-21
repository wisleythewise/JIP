'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());


// Setting for Hyperledger Fabric
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');

app.post('/request', async function (req, res){
    // A wallet stores a collection of identities for use

    // recieve information from the application
    const { amount, price , docNumber }  = req.body.data;

    // get the current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const current_today = mm + '-' + dd + '-' + yyyy;

    const wallet = await Wallets.newFileSystemWallet('../../magnetocorp/identity/user/isabella/wallet');

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {


        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'isabella';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../magnetocorp/gateway/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract');

        // issue commercial paper
        console.log('Submit commercial paper issue transaction.');

        const issueResponse = await contract.submitTransaction('request', 'MagnetoCorp', docNumber.toString(), current_today, price.toString(), amount.toString());

        // process response
        console.log('Process issue transaction response.'+issueResponse);

        let paper = CommercialPaper.fromBuffer(issueResponse);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`);
        console.log('Transaction complete.');

        res.status(200).json({response: issueResponse.toString()});



    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
)

app.get('/query', async function (req, res) {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'balaji';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // queries - commercial paper
        console.log('-----------------------------------------------------------------------------------------');
        console.log('****** Submitting commercial paper queries ****** \n\n ');


        // 1 asset history
        console.log('1. Query Commercial Paper History....');
        console.log('-----------------------------------------------------------------------------------------\n');
        let queryResponse = await contract.evaluateTransaction('queryHistory', 'MagnetoCorp', '00001');

        let json = JSON.parse(queryResponse.toString());

        // 2 ownership query
        console.log('2. Query Commercial Paper Ownership.... Papers owned by MagnetoCorp');
        console.log('-----------------------------------------------------------------------------------------\n');
        let queryResponse2 = await contract.evaluateTransaction('queryOwner', 'MagnetoCorp');
        json = JSON.parse(queryResponse2.toString());
        console.log(json);

        let queryResponse2_1 = await contract.evaluateTransaction('queryOwner', 'DigiBank');
        json = JSON.parse(queryResponse2_1.toString());
        console.log(json);


        console.log('\n\n');
        console.log('\n  Paper Ownership query complete.');
        console.log('-----------------------------------------------------------------------------------------\n\n');

        // 3 partial key query
        console.log('3. Query Commercial Paper Partial Key.... Papers in org.papernet.papers namespace and prefixed MagnetoCorp');
        console.log('-----------------------------------------------------------------------------------------\n');
        let queryResponse3 = await contract.evaluateTransaction('queryPartial', 'MagnetoCorp');

        json = JSON.parse(queryResponse3.toString());
        console.log(json);
        console.log('\n\n');

        console.log('\n  Partial Key query complete.');
        console.log('-----------------------------------------------------------------------------------------\n\n');


        // 4 Named query - all redeemed papers
        console.log('4. Named Query: ... All papers in org.papernet.papers that are in current state of LoC');
        console.log('-----------------------------------------------------------------------------------------\n');
        let queryResponse4 = await contract.evaluateTransaction('queryNamed', 'redeemed');

        json = JSON.parse(queryResponse4.toString());
        console.log(json);
        console.log('\n\n');

        console.log('\n  Named query "LoC" complete.');
        console.log('-----------------------------------------------------------------------------------------\n\n');

        res.status(200).json({Outstanding_requests_buyer: queryResponse2.toString(),
            approves_requests_seller: queryResponse2_1.toString(),
            LOCs : queryResponse4.toString()});


        // 5 named query - by value
        console.log('5. Named Query:.... All papers in org.papernet.papers with faceValue > 4000000');
        console.log('-----------------------------------------------------------------------------------------\n');
        let queryResponse5 = await contract.evaluateTransaction('queryNamed', 'value');

        json = JSON.parse(queryResponse5.toString());
        console.log(json);
        console.log('\n\n');

        console.log('\n  Named query by "value" complete.');
        console.log('-----------------------------------------------------------------------------------------\n\n');
    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
});

app.post('/approve', async function (req, res) {
    // A wallet stores a collection of identities for use

    // recieve information from the application
    const { amount, price , docNumber }  = req.body.data;

    console.log('check');
    const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');


    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'balaji';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }

        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // buy commercial paper
        console.log('Submit commercial paper apporove transaction.');

        const buyResponse = await contract.submitTransaction('approve', 'MagnetoCorp', docNumber.toString(), 'MagnetoCorp', 'DigiBank', price.toString(), amount.toString());

        // process response
        console.log('Process buy transaction response.');

        let paper = CommercialPaper.fromBuffer(buyResponse);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
        console.log('Transaction complete.');

        res.status(200).json({response: buyResponse.toString()});

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
});


app.post('/LoC', async function (req, res) {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');


    // get the current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const current_today = mm + '-' + dd + '-' + yyyy;

    // recieve information from the application
    const { docNumber }  = req.body.data;

    console.log(docNumber)

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // Specify userName for network access
        const userName = 'balaji';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../magnetocorp/gateway/connection-org2.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // redeem commercial paper
        console.log('Submit commercial paper redeem transaction.');

        const redeemResponse = await contract.submitTransaction('loc', 'MagnetoCorp', docNumber.toString(), 'DigiBank', 'Org2MSP', current_today.toString());

        // process response
        console.log('Process LoC transaction response.');

        let paper = CommercialPaper.fromBuffer(redeemResponse);

        console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully redeemed with ${paper.owner}`);

        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.')
        gateway.disconnect();

    }
})
//const ip =  '145.94.223.136';
const ip =  'localhost';
app.listen(8080, ip);
console.log('Running on http://' + ip + ':8080');
