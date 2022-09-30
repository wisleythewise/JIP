#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Copy the connection profiles so they are in the correct organizations.
sudo cp "${DIR}/../test-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/"* "${DIR}/../test-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/cert.pem"
sudo cp "${DIR}/../test-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/"* "${DIR}/../test-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/702b86d68992d9bd6ad472e5fc4c4b54359122278175371c91fa241367a39077_sk"

echo Suggest that you monitor the docker containers by running
echo "./organization/magnetocorp/configuration/cli/monitordocker.sh fabric_test"
