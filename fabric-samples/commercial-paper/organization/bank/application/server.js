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
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../magnetocorp//gateway/connection-org2.yaml', 'utf8'));

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

        const issueResponse = await contract.submitTransaction('issue', 'MagnetoCorp', docNumber.toString(), current_today, price.toString(), amount.toString());

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
        console.log(json);
        console.log('\n\n');
        console.log('\n  History query complete.');
        console.log('-----------------------------------------------------------------------------------------\n\n');

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

        res.status(200).json({Outstanding_requests_buyer: queryResponse2.toString(),
            approves_requests_seller: queryResponse2_1.toString()});

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
        console.log('4. Named Query: ... All papers in org.papernet.papers that are in current state of redeemed');
        console.log('-----------------------------------------------------------------------------------------\n');
        let queryResponse4 = await contract.evaluateTransaction('queryNamed', 'redeemed');

        json = JSON.parse(queryResponse4.toString());
        console.log(json);
        console.log('\n\n');

        console.log('\n  Named query "redeemed" complete.');
        console.log('-----------------------------------------------------------------------------------------\n\n');


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
        console.log('Submit commercial paper buy transaction.');

        const buyResponse = await contract.submitTransaction('buy', 'MagnetoCorp', docNumber.toString(), 'MagnetoCorp', 'DigiBank', price.toString(), amount.toString());

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

app.post('/api/addproduct/', async function (req, res) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '.', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('appUser');
        if (!userExists) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channeldemo');

        // Get the contract from the network.
        const contract = network.getContract('becc');

        // Submit the specified transaction.
        await contract.submitTransaction('createProduct', req.body.productnumber, req.body.brand, req.body.price, req.body.count);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})

app.put('/api/changeprice/:product_number', async function (req, res) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.resolve(__dirname, '.', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('appUser');
        if (!userExists) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channeldemo');

        // Get the contract from the network.
        const contract = network.getContract('becc');

        // Submit the specified transaction.
        await contract.submitTransaction('changeProductPrice', req.params.product_number, req.body.price);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }	
})
const ip =  '145.94.214.60';
app.listen(8080, ip);
console.log('Running on http://' + ip + ':8080');
